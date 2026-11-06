'use strict'

// Offline preparation only. Never imports Next, dotenv or Supabase.
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { execFileSync } = require('node:child_process')

const PROJECT_REF = 'ieioysefckvafdbasqxl'
const LAB_URL = `https://${PROJECT_REF}.supabase.co`
const APP_ORIGIN = 'https://localhost:3443'
const CONFIG_RELATIVE = '.lab-private/lab.config.json'
const MARKER = '.tce-lab-copy.json'
const REQUIRED = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_APP_URL']
const fail = code => { throw new Error(code) }
const inside = (root, target) => {
  const relative = path.relative(root, target)
  return !relative || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative))
}

function rejectInherited(env) {
  if (Object.keys(env).some(k => /supabase/i.test(k) || /^(NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_TCE_LAB_MODE|TCE_LAB_.+)$/i.test(k))) {
    fail('LAB_INHERITED_CONFIGURATION')
  }
}

function validateKey(key, role) {
  // A project claim catches accidental cross-project legacy keys, not forgery.
  // Opaque keys cannot be checked offline and are deliberately unsupported.
  try {
    if (typeof key !== 'string' || key.length > 8192 || key.split('.').length !== 3) fail('invalid')
    const claims = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8'))
    if (claims.ref !== PROJECT_REF || claims.role !== role) fail('invalid')
  } catch { fail('LAB_KEY_PROJECT_OR_ROLE_UNVERIFIABLE') }
}

function validateConfig(config) {
  if (!config || Array.isArray(config) || typeof config !== 'object' ||
      Object.keys(config).length !== REQUIRED.length || REQUIRED.some(k => !Object.hasOwn(config, k))) fail('LAB_CONFIG_KEYS')
  if (config.NEXT_PUBLIC_SUPABASE_URL !== LAB_URL) fail('LAB_SUPABASE_URL')
  if (config.NEXT_PUBLIC_APP_URL !== APP_ORIGIN) fail('LAB_APP_ORIGIN')
  validateKey(config.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'anon')
  validateKey(config.SUPABASE_SERVICE_ROLE_KEY, 'service_role')
  return Object.fromEntries(REQUIRED.map(k => [k, config[k]]))
}

function cleanEnvironment(parent, config) {
  const result = {}
  const osKeys = new Set(['systemroot', 'windir', 'comspec', 'path', 'pathext', 'temp', 'tmp', 'userprofile', 'localappdata', 'appdata'])
  for (const k of Object.keys(parent)) if (osKeys.has(k.toLowerCase())) result[k] = parent[k]
  return { ...result, ...validateConfig(config), NODE_ENV: 'development', NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_TCE_LAB_MODE: 'true' }
}

function readPrivateConfig(root, env) {
  rejectInherited(env) // Check names only; never reads inherited Supabase values.
  const filename = path.join(root, CONFIG_RELATIVE)
  if (!fs.existsSync(filename)) fail('LAB_CONFIG_MISSING')
  for (const p of [path.dirname(filename), filename]) if (fs.lstatSync(p).isSymbolicLink()) fail('LAB_CONFIG_LINK')
  if (!inside(fs.realpathSync(root), fs.realpathSync(filename))) fail('LAB_CONFIG_LOCATION')
  try {
    execFileSync('git', ['check-ignore', '--quiet', '--', CONFIG_RELATIVE], { cwd: root, env: cleanGitEnvironment(env), stdio: 'ignore' })
  } catch { fail('LAB_CONFIG_NOT_IGNORED') }
  const configStat = fs.statSync(filename)
  if (!configStat.isFile() || configStat.nlink !== 1 || configStat.size > 16384) fail('LAB_CONFIG_FILE')
  let parsed
  try { parsed = JSON.parse(fs.readFileSync(filename, 'utf8')) } catch { fail('LAB_CONFIG_INVALID') }
  return validateConfig(parsed)
}

function cleanGitEnvironment(parent) {
  const env = {}
  for (const k of Object.keys(parent)) if (/^(systemroot|windir|comspec|path|pathext|temp|tmp)$/i.test(k)) env[k] = parent[k]
  return env
}

function allowedFile(relative) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.includes(':') || relative.includes('\0')) return false
  const parts = relative.split('/')
  if (parts.some(p => !p || p === '.' || p === '..' || p.startsWith('.'))) return false
  if (parts.some(p => /^(node_modules|coverage|out|build|dist|logs?|credentials?|secrets?|certs?)$/i.test(p))) return false
  if (['package.json', 'package-lock.json', 'next.config.js', 'next-env.d.ts', 'tsconfig.json', 'postcss.config.js', 'tailwind.config.ts', 'tailwind.config.js'].includes(relative)) return true
  if (relative === 'scripts/lab-launcher.cjs') return true
  if (/^(app|components|hooks|lib|types)\//.test(relative)) return /\.(ts|tsx|js|jsx|css)$/.test(relative) && !/\.(test|spec)\./.test(relative)
  if (relative.startsWith('public/')) return /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf)$/.test(relative) || relative === 'public/manifest.json'
  return false
}

function prepareCopy(root, files, outputBase = os.tmpdir()) {
  root = fs.realpathSync(root)
  outputBase = fs.realpathSync(outputBase)
  if (inside(root, outputBase)) fail('LAB_COPY_MUST_BE_OUTSIDE_REPOSITORY')
  // Validate the entire manifest before creating output or reading file contents.
  const selected = []
  for (const relative of files) {
    if (!allowedFile(relative)) continue
    let current = root
    for (const part of relative.split('/')) {
      current = path.join(current, part)
      if (fs.lstatSync(current).isSymbolicLink()) fail('LAB_SOURCE_LINK')
    }
    const stat = fs.statSync(current)
    if (!inside(root, fs.realpathSync(current)) || !stat.isFile() || stat.nlink !== 1) fail('LAB_SOURCE_FILE')
    selected.push(relative)
  }
  if (!selected.includes('package.json') || !selected.includes('next.config.js')) fail('LAB_SOURCE_INCOMPLETE')
  const destination = fs.mkdtempSync(path.join(outputBase, 'tce-2-lab-run-'))
  for (const relative of selected) {
    const target = path.join(destination, relative)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(path.join(root, relative), target, fs.constants.COPYFILE_EXCL)
  }
  fs.writeFileSync(path.join(destination, MARKER), JSON.stringify({ projectRef: PROJECT_REF, origin: APP_ORIGIN, servicesAuthorized: false }) + '\n', { flag: 'wx' })
  return { destination, files: selected }
}

function validateRuntime(env) {
  if (env.NEXT_PUBLIC_TCE_LAB_MODE !== 'true') fail('LAB_MODE_REQUIRED')
  validateConfig(Object.fromEntries(REQUIRED.map(k => [k, env[k]])))
}

function main(args = process.argv.slice(2)) {
  try {
    if (args.length !== 1 || !['check', 'prepare'].includes(args[0])) fail('LAB_ONLY_CHECK_OR_PREPARE_NO_SERVICES')
    const root = path.resolve(__dirname, '..')
    const config = readPrivateConfig(root, process.env)
    cleanEnvironment(process.env, config) // No process is launched, nor env file written.
    if (args[0] === 'prepare') {
      const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, env: cleanGitEnvironment(process.env), encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).split('\0').filter(Boolean)
      const result = prepareCopy(root, [...new Set(files)])
      console.log(JSON.stringify({ status: 'LAB_COPY_PREPARED_NO_SERVICES', directory: result.destination, files: result.files.length }))
    } else console.log('LAB_CONFIGURATION_SYNTAX_AND_PROJECT_CLAIMS_OK_NO_CONNECTION')
  } catch (error) {
    // Never print parser errors, values, file contents, environment or stack.
    const code = /^LAB_[A-Z_]+$/.test(error.message || '') ? error.message : 'LAB_PREPARATION_FAILED'
    console.error(code)
    process.exitCode = 1
  }
}

module.exports = { PROJECT_REF, LAB_URL, APP_ORIGIN, CONFIG_RELATIVE, MARKER, rejectInherited, validateConfig, cleanEnvironment, readPrivateConfig, allowedFile, prepareCopy, validateRuntime, main }
if (require.main === module) main()
