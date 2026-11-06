'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const vm = require('node:vm')
const { execFileSync } = require('node:child_process')
const ts = require('typescript')
const { minify } = require('next/dist/compiled/terser')
const lab = require('../scripts/lab-launcher.cjs')
const root = path.resolve(__dirname, '..')

// Deliberately unsigned synthetic tokens; no real credentials, dotenv or network.
const key = (role, ref = lab.PROJECT_REF) => 'synthetic.' + Buffer.from(JSON.stringify({ role, ref })).toString('base64url') + '.not-a-real-signature'
const config = () => ({ NEXT_PUBLIC_SUPABASE_URL: lab.LAB_URL, NEXT_PUBLIC_APP_URL: lab.APP_ORIGIN,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: key('anon'), SUPABASE_SERVICE_ROLE_KEY: key('service_role') })
const reject = (fn, code) => assert.throws(fn, error => error.message === code)
const fixture = () => fs.mkdtempSync(path.join(os.tmpdir(), 'tce-lab-test-'))

// Exercise the actual command dispatcher with a synthetic in-memory filesystem.
// No real private config or environment is read, nor any child process launched.
function command(args, values = config(), env = {}, exists = true) {
  const errors = [], operations = []
  const source = fs.readFileSync(path.join(root, 'scripts/lab-launcher.cjs'), 'utf8')
  const context = { __dirname: root, process: { env, argv: [], exitCode: 0 }, module: { exports: {} }, Buffer,
    console: { error: code => errors.push(code), log: () => {} }, require(name) {
      if (name === 'node:fs') return {
        existsSync: () => exists, lstatSync: () => ({ isSymbolicLink: () => false }), realpathSync: value => value,
        statSync: () => ({ isFile: () => true, nlink: 1, size: 100 }),
        readFileSync: () => { operations.push('read-config'); return JSON.stringify(values) },
      }
      if (name === 'node:child_process') return { execFileSync: (_, arguments_) => { operations.push(arguments_[0]); if (arguments_[0] !== 'check-ignore') throw new Error('NO_PREPARE_ALLOWED') } }
      if (name === 'node:path') return path
      if (name === 'node:os') return os
      throw new Error('Unexpected import')
    } }
  vm.runInNewContext(source, context)
  context.module.exports.main(args)
  return { errors, operations, exitCode: context.process.exitCode }
}

test('missing private configuration fails without reading any env file', () => {
  reject(() => lab.readPrivateConfig(fixture(), {}), 'LAB_CONFIG_MISSING')
  for (const action of ['check', 'prepare']) {
    const result = command([action], config(), {}, false)
    assert.deepEqual(result.errors, ['LAB_CONFIG_MISSING'])
    assert.deepEqual(result.operations, [])
  }
  for (const args of [[], ['start'], ['prepare', '--skip-validation']]) {
    const result = command(args)
    assert.deepEqual(result.errors, ['LAB_COMMAND_NOT_ALLOWED'])
    assert.deepEqual(result.operations, [])
  }
})
test('wrong project URL rejected', () => {
  const values = { ...config(), NEXT_PUBLIC_SUPABASE_URL: 'https://wrong-project.example.test' }
  reject(() => lab.validateConfig(values), 'LAB_SUPABASE_URL')
  for (const action of ['check', 'prepare']) {
    const result = command([action], values)
    assert.deepEqual(result.errors, ['LAB_SUPABASE_URL'])
    assert.equal(result.operations.includes('ls-files'), false)
  }
})
test('URL with suffix, path, credentials or trailing slash rejected', () => {
  for (const value of [lab.LAB_URL + '.example.test', lab.LAB_URL + '/rest/v1', lab.LAB_URL + '/', 'https://user:synthetic@ieioysefckvafdbasqxl.supabase.co']) {
    reject(() => lab.validateConfig({ ...config(), NEXT_PUBLIC_SUPABASE_URL: value }), 'LAB_SUPABASE_URL')
  }
})
test('inherited Supabase values are not even accessed', () => {
  const env = {}
  Object.defineProperty(env, 'SUPABASE_SERVICE_ROLE_KEY', { enumerable: true, get() { throw new Error('VALUE_MUST_NOT_BE_READ') } })
  reject(() => lab.rejectInherited(env), 'LAB_INHERITED_CONFIGURATION')
  for (const action of ['check', 'prepare']) {
    const result = command([action], config(), env)
    assert.deepEqual(result.errors, ['LAB_INHERITED_CONFIGURATION'])
    assert.deepEqual(result.operations, [])
  }
})
test('inherited Supabase aliases and app origin rejected', () => {
  for (const name of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_ACCESS_TOKEN', 'supabase_db_url', 'NEXT_PUBLIC_APP_URL']) {
    reject(() => lab.rejectInherited({ [name]: 'synthetic' }), 'LAB_INHERITED_CONFIGURATION')
  }
})
test('HTTP and alternative origins rejected', () => {
  for (const value of ['http://localhost:3443', 'https://localhost:3000', 'https://127.0.0.1:3443', 'https://foreign.example.test', lab.APP_ORIGIN + '/']) {
    reject(() => lab.validateConfig({ ...config(), NEXT_PUBLIC_APP_URL: value }), 'LAB_APP_ORIGIN')
    for (const action of ['check', 'prepare']) {
      const result = command([action], { ...config(), NEXT_PUBLIC_APP_URL: value })
      assert.deepEqual(result.errors, ['LAB_APP_ORIGIN'])
      assert.equal(result.operations.includes('ls-files'), false)
    }
  }
})
test('opaque keys, wrong project and service key in public slot fail closed', () => {
  for (const value of ['synthetic-opaque-key', key('anon', 'wrong-ref'), key('service_role')]) {
    reject(() => lab.validateConfig({ ...config(), NEXT_PUBLIC_SUPABASE_ANON_KEY: value }), 'LAB_KEY_PROJECT_OR_ROLE_UNVERIFIABLE')
  }
})
test('unknown configuration keys rejected', () => reject(() => lab.validateConfig({ ...config(), DATABASE_URL: 'synthetic' }), 'LAB_CONFIG_KEYS'))
test('child environment strips injected modules, proxies and unrelated public values', () => {
  const env = lab.cleanEnvironment({ PATH: 'synthetic-path', NODE_OPTIONS: '--require synthetic', NODE_PATH: 'synthetic', HTTPS_PROXY: 'synthetic', NEXT_PUBLIC_OTHER: 'synthetic' }, config())
  for (const name of ['NODE_OPTIONS', 'NODE_PATH', 'HTTPS_PROXY', 'NEXT_PUBLIC_OTHER']) assert.equal(Object.hasOwn(env, name), false)
  assert.equal(env.NEXT_PUBLIC_TCE_LAB_MODE, 'true')
  assert.equal(env.NEXT_TELEMETRY_DISABLED, '1')
})
test('copy excludes all private candidates before any copy read', () => {
  const source = fixture()
  const files = ['package.json', 'next.config.js', 'app/page.tsx', '.env.local', '.env', '.env.lab.local',
    'app/.env.local', '.git/config', '.vercel/project.json', '.lab-private/lab.config.json',
    'node_modules/stub/index.js', '.next/cache/file', 'credentials.json', 'public/private.key', 'app/private.pem', 'debug.log']
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(source, file)), { recursive: true })
    fs.writeFileSync(path.join(source, file), 'synthetic fixture only')
  }
  const original = fs.copyFileSync
  fs.copyFileSync = (from, ...rest) => {
    assert.equal(lab.allowedFile(path.relative(source, from).split(path.sep).join('/')), true)
    return original(from, ...rest)
  }
  let result
  try { result = lab.prepareCopy(source, files) } finally { fs.copyFileSync = original }
  assert.deepEqual(result.files, ['package.json', 'next.config.js', 'app/page.tsx'])
  for (const file of files.slice(3)) assert.equal(fs.existsSync(path.join(result.destination, file)), false)
  assert.equal(fs.existsSync(path.join(result.destination, lab.MARKER)), true)
})
test('traversal and absolute paths not eligible for copying', () => {
  for (const file of ['../app/file.ts', '/app/file.ts', 'C:/app/file.ts', 'app/../file.ts', 'app\\file.ts', 'app/.aws/credentials.ts']) assert.equal(lab.allowedFile(file), false)
})
test('copy destination inside source rejected', () => {
  const source = fixture()
  reject(() => lab.prepareCopy(source, [], source), 'LAB_COPY_MUST_BE_OUTSIDE_REPOSITORY')
})
test('symbolic directories and hard links cannot smuggle files into copy', () => {
  const source = fixture(), outside = fixture()
  fs.writeFileSync(path.join(source, 'package.json'), '{}')
  fs.writeFileSync(path.join(source, 'next.config.js'), '')
  fs.mkdirSync(path.join(source, 'public'))
  fs.writeFileSync(path.join(outside, 'image.png'), 'synthetic')
  fs.symlinkSync(outside, path.join(source, 'public', 'linked'), process.platform === 'win32' ? 'junction' : 'dir')
  reject(() => lab.prepareCopy(source, ['package.json', 'next.config.js', 'public/linked/image.png']), 'LAB_SOURCE_LINK')
  fs.mkdirSync(path.join(source, 'app'))
  const privateFile = path.join(outside, 'synthetic-private.txt')
  fs.writeFileSync(privateFile, 'synthetic fixture only')
  fs.linkSync(privateFile, path.join(source, 'app', 'linked.ts'))
  reject(() => lab.prepareCopy(source, ['package.json', 'next.config.js', 'app/linked.ts']), 'LAB_SOURCE_FILE')
})
test('actual repository copy has no private files, dependencies or pre-existing artifacts', () => {
  const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
  const result = lab.prepareCopy(root, [...new Set(files)])
  assert.equal(path.relative(root, result.destination).startsWith('..'), true)
  for (const relative of result.files) assert.equal(lab.allowedFile(relative), true)
  for (const excluded of ['.env', '.env.local', '.lab-private', '.git', '.next', '.vercel', 'node_modules', 'RECUPERACION_TCE_2.0']) assert.equal(fs.existsSync(path.join(result.destination, excluded)), false)
  console.log('Synthetic validation copy (no configuration, dependencies or services): ' + result.destination)
})

async function compile(file, laboratory) {
  const js = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const result = await minify(js, { compress: { global_defs: {
    'process.env.NEXT_PUBLIC_TCE_LAB_MODE': laboratory ? 'true' : undefined,
    'process.env.NEXT_PUBLIC_APP_URL': lab.APP_ORIGIN,
  }, dead_code: true }, mangle: false })
  return result.code
}
test('offline generated lab layout excludes GTM, Pixel and both noscript requests', async () => {
  const output = await compile('app/layout.tsx', true)
  for (const marker of ['googletagmanager.com', 'connect.facebook.net', 'facebook.com/tr', 'gtm-script', 'fb-pixel']) assert.equal(output.includes(marker), false, marker)
})
test('offline generated lab candidate code excludes fbq Lead call', async () => {
  const output = await compile('components/candidato/VacanteDetalle.tsx', true)
  assert.equal(/fbq\s*\(/.test(output), false)
  assert.equal(output.includes('"Lead"'), false)
})
test('non-lab compilation preserves existing telemetry branches', async () => {
  const output = await compile('app/layout.tsx', false)
  assert.equal(output.includes('googletagmanager.com'), true)
  assert.equal(output.includes('connect.facebook.net'), true)
  const candidate = await compile('components/candidato/VacanteDetalle.tsx', false)
  assert.equal(candidate.includes('"Lead"'), true)
})
test('next config fails closed in an isolated copy, even without launcher flags', () => {
  const source = fs.readFileSync(path.join(root, 'next.config.js'), 'utf8')
  const evaluate = (env, isolated = true) => {
    const context = { __dirname: '/synthetic-copy', process: { env }, module: { exports: {} }, require(name) {
    if (name === 'node:fs') return { existsSync: () => isolated }
    if (name === 'node:path') return path
    if (name === './scripts/lab-launcher.cjs') return lab
    throw new Error('Unexpected import')
    } }
    vm.runInNewContext(source, context)
    return context.module.exports
  }
  reject(() => evaluate({}), 'LAB_MODE_REQUIRED')
  reject(() => evaluate({ ...config(), NEXT_PUBLIC_TCE_LAB_MODE: 'true' }), 'LAB_SERVICES_NOT_AUTHORIZED')
  assert.equal(Object.keys(evaluate({}, false)).length, 0)
})
