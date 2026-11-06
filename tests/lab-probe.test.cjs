'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const vm = require('node:vm')
const { spawnSync } = require('node:child_process')
const lab = require('../scripts/lab-launcher.cjs')
const probe = require('../scripts/lab-probe.cjs')
const SID = 'S-1-5-21-100-200-300-1001'
const acl = () => ({ currentSid: SID, ownerSid: SID, inheritanceProtected: true,
  rules: [{ sid: SID, type: 'Allow', rights: 2032127, inherited: false }, { sid: 'S-1-5-18', type: 'Allow', rights: 2032127, inherited: false }] })
const config = () => ({ NEXT_PUBLIC_SUPABASE_URL: lab.LAB_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'synthetic.' + Buffer.from(JSON.stringify({ ref: lab.PROJECT_REF, role: 'anon' })).toString('base64url') + '.not-a-real-signature' })
const fails = (fn, code) => assert.throws(fn, error => error.message === code)
const rejects = (promise, code) => assert.rejects(promise, error => error.message === code)
function response(statusCode = 200, text = 'synthetic response body') {
  return { statusCode, tlsAuthorized: true, peerHostname: lab.PROJECT_REF + '.supabase.co',
    body: (async function* () { yield Buffer.from(text) })() }
}

// Real module, synthetic filesystem/ACL inspector. No private files are opened.
function reader({ values = config(), aclValues = acl(), linked = false, links = 1, exists = true } = {}) {
  const operations = []
  const context = { module: { exports: {} }, process: { platform: 'win32', env: {} }, Buffer, URL, AbortController, setTimeout, clearTimeout,
    console: { error: () => {}, log: () => {} }, require(name) {
      if (name === 'node:fs') return { existsSync: () => exists, lstatSync: () => ({ isSymbolicLink: () => linked }),
        realpathSync: value => value, statSync: () => ({ isFile: () => true, nlink: links, size: 100 }),
        readFileSync: () => { operations.push('read'); return JSON.stringify(values) } }
      if (name === 'node:path') return path
      if (name === 'node:child_process') return { execFileSync: () => { operations.push('git-ignore'); return '' } }
      if (name === './lab-launcher.cjs') return lab
      throw new Error('Unexpected import')
    } }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/lab-probe.cjs'), 'utf8'), context)
  return { operations, read: env => context.module.exports.readProbeConfig(path.join(os.tmpdir(), 'synthetic-root'), env || {}, () => { operations.push('acl'); return aclValues }) }
}

test('absent private config rejected without reading', () => {
  const r = reader({ exists: false }); fails(r.read, 'LAB_PROBE_CONFIG_MISSING'); assert.deepEqual(r.operations, [])
})
test('only URL and public key accepted; no privileged credential field', () => {
  for (const values of [undefined, {}, { ...config(), SUPABASE_SERVICE_ROLE_KEY: 'synthetic-forbidden' }]) {
    fails(() => probe.validatePublicConfig(values), 'LAB_PROBE_CONFIG_KEYS')
  }
})
test('wrong URL, public role and opaque keys rejected before transport', () => {
  fails(() => probe.validatePublicConfig({ ...config(), NEXT_PUBLIC_SUPABASE_URL: 'https://wrong.example.test' }), 'LAB_PROBE_DESTINATION')
  fails(() => probe.validatePublicConfig({ ...config(), NEXT_PUBLIC_SUPABASE_ANON_KEY: 'synthetic-opaque' }), 'LAB_KEY_PROJECT_OR_ROLE_UNVERIFIABLE')
  const wrong = 'synthetic.' + Buffer.from(JSON.stringify({ ref: lab.PROJECT_REF, role: 'service_role' })).toString('base64url') + '.fake'
  fails(() => probe.validatePublicConfig({ ...config(), NEXT_PUBLIC_SUPABASE_ANON_KEY: wrong }), 'LAB_KEY_PROJECT_OR_ROLE_UNVERIFIABLE')
})
test('inherited credential values never accessed', () => {
  const r = reader(), env = {}
  Object.defineProperty(env, 'SUPABASE_ACCESS_TOKEN', { enumerable: true, get() { throw new Error('MUST_NOT_READ') } })
  fails(() => r.read(env), 'LAB_INHERITED_CONFIGURATION'); assert.deepEqual(r.operations, [])
})
test('symbolic and hard-linked config files rejected before ACL/content', () => {
  for (const settings of [{ linked: true }, { links: 2 }]) {
    const r = reader(settings)
    fails(r.read, settings.linked ? 'LAB_PROBE_CONFIG_LINK' : 'LAB_PROBE_CONFIG_FILE')
    assert.deepEqual(r.operations, [])
  }
})
test('owner, inherited permissions and unrelated allow rules fail closed', () => {
  const insecure = [null, { ...acl(), ownerSid: 'S-1-5-18' }, { ...acl(), inheritanceProtected: false },
    { ...acl(), rules: [] }, { ...acl(), rules: [{ sid: 'S-1-1-0', type: 'Allow', rights: 1, inherited: false }] },
    { ...acl(), rules: [{ sid: SID, type: 'Allow', rights: 1, inherited: true }] }]
  for (const value of insecure) {
    fails(() => probe.assertRestrictedAcl(value), 'LAB_PROBE_UNSAFE_ACL')
    const r = reader({ aclValues: value }); fails(r.read, 'LAB_PROBE_UNSAFE_ACL'); assert.equal(r.operations.includes('read'), false)
  }
})
test('safe synthetic ACL permits reading explicit synthetic config only', () => {
  const r = reader(); assert.equal(r.read().NEXT_PUBLIC_SUPABASE_URL, lab.LAB_URL)
  assert.deepEqual(r.operations, ['acl', 'acl', 'git-ignore', 'read'])
})
test('Windows ACL implementation inspects metadata with constrained PowerShell', () => {
  let invocation
  const context = { module: { exports: {} }, process: { platform: 'win32', env: { SystemRoot: 'C:\\Windows' } }, Buffer,
    require(name) {
      if (name === 'node:fs') return {}
      if (name === 'node:path') return path.win32
      if (name === './lab-launcher.cjs') return lab
      if (name === 'node:child_process') return { execFileSync(...args) { invocation = args; return JSON.stringify(acl()) } }
      throw new Error('Unexpected import')
    } }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/lab-probe.cjs'), 'utf8'), context)
  const result = context.module.exports.inspectWindowsAcl('C:\\synthetic\\probe.config.json')
  probe.assertRestrictedAcl(result)
  assert.equal(invocation[0], 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe')
  const script = invocation[1].at(-1)
  assert.match(script, /Get-Acl -LiteralPath/); assert.doesNotMatch(script, /Get-Content|Set-Acl/)
  assert.equal(invocation[2].windowsHide, true)
})
test('only fixed host/HTTPS/443/path and GET accepted', () => {
  const url = lab.LAB_URL + probe.CANDIDATE_PATH
  probe.assertDestination(url, 'GET')
  for (const candidate of ['http://ieioysefckvafdbasqxl.supabase.co/rest/v1/', lab.LAB_URL + ':444/rest/v1/',
    lab.LAB_URL + '/auth/v1/admin/users', url + '?apikey=synthetic', 'https://other.example.test/rest/v1/', url + '#fragment']) {
    fails(() => probe.assertDestination(candidate, 'GET'), 'LAB_PROBE_DESTINATION')
  }
  fails(() => probe.assertDestination(url, 'POST'), 'LAB_PROBE_DESTINATION')
})
test('simulated control pair never claims authenticated or real HTTPS success', async () => {
  const requests = []
  const output = await probe.evaluateOffline(config(), async request => { requests.push(request); return response(requests.length === 1 ? 401 : 200) })
  assert.equal(requests.length, 2)
  for (const request of requests) {
    assert.equal(request.redirect, 'error'); assert.equal(request.retries, 0); assert.equal(request.proxy, false)
    assert.equal(request.rejectUnauthorized, true); assert.equal(request.url, lab.LAB_URL + probe.CANDIDATE_PATH)
  }
  assert.equal(output.httpsReachable, null); assert.equal(output.simulatedHttpsReachable, true)
  assert.equal(output.authenticationValidated, false); assert.equal(output.mode, 'OFFLINE_SIMULATION')
  assert.equal(JSON.stringify(output).includes(config().NEXT_PUBLIC_SUPABASE_ANON_KEY), false)
  assert.equal(JSON.stringify(output).includes('synthetic response body'), false)
})
test('both HTTP 200 statuses still do not validate a key', async () => {
  const output = await probe.evaluateOffline(config(), async () => response(200))
  assert.equal(output.authenticationValidated, false); assert.equal(output.reason, 'ENDPOINT_CONTRACT_UNVERIFIED')
})
test('redirect rejected without follow or retry', async () => {
  let count = 0
  await rejects(probe.evaluateOffline(config(), async () => { count++; return response(302) }), 'LAB_PROBE_REDIRECT')
  assert.equal(count, 1)
})
test('TLS or peer mismatch rejected', async () => {
  await rejects(probe.evaluateOffline(config(), async () => ({ ...response(), tlsAuthorized: false })), 'LAB_PROBE_TLS')
  await rejects(probe.evaluateOffline(config(), async () => ({ ...response(), peerHostname: 'other.example.test' })), 'LAB_PROBE_TLS')
})
test('oversized response aborted without exposing body', async () => {
  let signal
  await rejects(probe.evaluateOffline(config(), async request => { signal = request.signal; return response(200, 'synthetic too long') }, { maxBytes: 3 }), 'LAB_PROBE_RESPONSE_TOO_LARGE')
  assert.equal(signal.aborted, true)
})
test('timeout aborts transport without retries', async () => {
  let signal, count = 0
  await rejects(probe.evaluateOffline(config(), request => { count++; signal = request.signal; return new Promise(() => {}) }, { timeoutMs: 5 }), 'LAB_PROBE_TIMEOUT')
  assert.equal(signal.aborted, true); assert.equal(count, 1)
})
test('transport errors sanitized; no accidental default network', async () => {
  await rejects(probe.evaluateOffline(config(), async () => { throw new Error('synthetic sensitive detail') }), 'LAB_PROBE_TRANSPORT_FAILED')
  await rejects(probe.evaluateOffline(config()), 'LAB_PROBE_NETWORK_NOT_AUTHORIZED')
})
test('CLI blocks before credential access or any network implementation', () => {
  const output = []
  const context = { module: { exports: {} }, process: { exitCode: 0, env: {} },
    console: { error: code => output.push(code) }, require(name) {
      if (name === 'node:fs') return { readFileSync: () => { throw new Error('NO_PRIVATE_READ') } }
      if (name === 'node:path') return path
      if (name === 'node:child_process') return {}
      if (name === './lab-launcher.cjs') return lab
      throw new Error('NO_NETWORK_IMPORT')
    } }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/lab-probe.cjs'), 'utf8'), context)
  context.module.exports.main()
  assert.equal(context.process.exitCode, 1)
  assert.deepEqual(output, ['LAB_PROBE_BLOCKED_ENDPOINT_CONTRACT_AND_NETWORK_AUTHORIZATION'])
})
test('real launcher dispatches probe but cannot enable connections with flags', () => {
  const env = {}
  for (const k of Object.keys(process.env)) if (/^(SystemRoot|WINDIR)$/i.test(k)) env[k] = process.env[k]
  const launcher = path.join(__dirname, '../scripts/lab-launcher.cjs')
  for (const [args, expected] of [
    [['probe'], 'LAB_PROBE_BLOCKED_ENDPOINT_CONTRACT_AND_NETWORK_AUTHORIZATION'],
    [['probe', '--connect'], 'LAB_COMMAND_NOT_ALLOWED'],
  ]) {
    const result = spawnSync(process.execPath, [launcher, ...args], { env, encoding: 'utf8', timeout: 5000, windowsHide: true })
    assert.equal(result.status, 1)
    assert.equal(result.stdout, '')
    assert.equal(result.stderr.trim(), expected)
  }
})
