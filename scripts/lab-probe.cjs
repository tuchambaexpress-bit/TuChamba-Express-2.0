'use strict'

// There is deliberately NO real HTTP/TLS client in this module.
// The installed SDK does not establish a key-gated, data-free probe contract.
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const lab = require('./lab-launcher.cjs')
const PRIVATE_FILE = '.lab-private/probe.config.json'
const CANDIDATE_PATH = '/rest/v1/' // Unverified candidate, offline simulations only.
const TIMEOUT_MS = 10000
const MAX_BYTES = 65536
const fail = code => { throw new Error(code) }

function validatePublicConfig(config) {
  const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  if (!config || typeof config !== 'object' || Array.isArray(config) ||
      Object.keys(config).length !== 2 || keys.some(k => !Object.hasOwn(config, k))) fail('LAB_PROBE_CONFIG_KEYS')
  if (config.NEXT_PUBLIC_SUPABASE_URL !== lab.LAB_URL) fail('LAB_PROBE_DESTINATION')
  lab.validateKey(config.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'anon')
  return Object.fromEntries(keys.map(k => [k, config[k]]))
}

function assertRestrictedAcl(acl) {
  if (!acl || !/^S-1-\d+(?:-\d+)+$/.test(acl.currentSid || '') ||
      acl.ownerSid !== acl.currentSid || acl.inheritanceProtected !== true ||
      !Array.isArray(acl.rules) || !acl.rules.length) fail('LAB_PROBE_UNSAFE_ACL')
  const trusted = new Set([acl.currentSid, 'S-1-5-18']) // Owner + SYSTEM only.
  let ownerRead = false
  for (const rule of acl.rules) {
    if (!rule || !['Allow', 'Deny'].includes(rule.type) || typeof rule.sid !== 'string' ||
        !Number.isSafeInteger(rule.rights) || rule.rights < 0 || rule.inherited !== false) fail('LAB_PROBE_UNSAFE_ACL')
    if (rule.type === 'Allow' && rule.rights !== 0 && !trusted.has(rule.sid)) fail('LAB_PROBE_UNSAFE_ACL')
    if (rule.type === 'Allow' && rule.sid === acl.currentSid && (rule.rights & 1)) ownerRead = true
  }
  if (!ownerRead) fail('LAB_PROBE_UNSAFE_ACL')
}

function inspectWindowsAcl(filename) {
  if (process.platform !== 'win32') fail('LAB_PROBE_WINDOWS_ACL_REQUIRED')
  // Only a path is encoded into the command. No credential is passed to a shell.
  const encodedPath = Buffer.from(filename, 'utf8').toString('base64')
  const script = `$ErrorActionPreference='Stop'; $p=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedPath}')); $a=Get-Acl -LiteralPath $p; $sid=[Security.Principal.WindowsIdentity]::GetCurrent().User.Value; $rules=@($a.GetAccessRules($true,$true,[Security.Principal.SecurityIdentifier]) | ForEach-Object { [pscustomobject]@{sid=$_.IdentityReference.Value;type=$_.AccessControlType.ToString();rights=[long]$_.FileSystemRights;inherited=$_.IsInherited} }); [pscustomobject]@{currentSid=$sid;ownerSid=$a.GetOwner([Security.Principal.SecurityIdentifier]).Value;inheritanceProtected=$a.AreAccessRulesProtected;rules=$rules} | ConvertTo-Json -Depth 4 -Compress`
  const executable = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  try {
    return JSON.parse(execFileSync(executable, ['-NoProfile', '-NonInteractive', '-Command', script], {
      encoding: 'utf8', timeout: 5000, maxBuffer: 32768, windowsHide: true,
      env: { SystemRoot: process.env.SystemRoot || 'C:\\Windows', WINDIR: process.env.SystemRoot || 'C:\\Windows' },
      stdio: ['ignore', 'pipe', 'ignore'],
    }).replace(/^\uFEFF/, ''))
  } catch { fail('LAB_PROBE_ACL_UNVERIFIABLE') }
}

function readProbeConfig(root, env, inspectAcl = inspectWindowsAcl) {
  lab.rejectInherited(env)
  const filename = path.join(root, PRIVATE_FILE)
  if (!fs.existsSync(filename)) fail('LAB_PROBE_CONFIG_MISSING')
  for (const p of [path.dirname(filename), filename]) if (fs.lstatSync(p).isSymbolicLink()) fail('LAB_PROBE_CONFIG_LINK')
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(filename))
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) fail('LAB_PROBE_CONFIG_LOCATION')
  const stat = fs.statSync(filename)
  if (!stat.isFile() || stat.nlink !== 1 || stat.size > 16384) fail('LAB_PROBE_CONFIG_FILE')
  assertRestrictedAcl(inspectAcl(path.dirname(filename)))
  assertRestrictedAcl(inspectAcl(filename)) // Metadata is checked BEFORE reading contents.
  try {
    execFileSync('git', ['check-ignore', '--quiet', '--', PRIVATE_FILE], { cwd: root,
      env: Object.fromEntries(Object.keys(env).filter(k => /^(SystemRoot|WINDIR|PATH|PATHEXT)$/i.test(k)).map(k => [k, env[k]])), stdio: 'ignore' })
  } catch { fail('LAB_PROBE_CONFIG_NOT_IGNORED') }
  let parsed
  try { parsed = JSON.parse(fs.readFileSync(filename, 'utf8')) } catch { fail('LAB_PROBE_CONFIG_INVALID') }
  return validatePublicConfig(parsed)
}

function assertDestination(url, method) {
  if (typeof url !== 'string' || url !== lab.LAB_URL + CANDIDATE_PATH || method !== 'GET') fail('LAB_PROBE_DESTINATION')
  const target = new URL(url)
  if (target.protocol !== 'https:' || target.hostname !== lab.PROJECT_REF + '.supabase.co' ||
      (target.port && target.port !== '443') || target.username || target.password || target.search || target.hash) fail('LAB_PROBE_DESTINATION')
}

async function evaluateOffline(config, transport, limits = {}) {
  config = validatePublicConfig(config)
  if (typeof transport !== 'function') fail('LAB_PROBE_NETWORK_NOT_AUTHORIZED')
  const timeoutMs = limits.timeoutMs ?? TIMEOUT_MS, maxBytes = limits.maxBytes ?? MAX_BYTES
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > TIMEOUT_MS ||
      !Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > MAX_BYTES) fail('LAB_PROBE_LIMITS')
  const url = lab.LAB_URL + CANDIDATE_PATH
  assertDestination(url, 'GET')
  const controller = new AbortController()
  let timer
  const bounded = new Promise((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error('LAB_PROBE_TIMEOUT')) }, timeoutMs)
  })
  try {
    const statuses = await Promise.race([bounded, (async () => {
      const statuses = []
      for (const key of ['synthetic-invalid-key', config.NEXT_PUBLIC_SUPABASE_ANON_KEY]) {
        if (controller.signal.aborted) fail('LAB_PROBE_TIMEOUT')
        const response = await transport({ url, method: 'GET', redirect: 'error', retries: 0,
          proxy: false, rejectUnauthorized: true, servername: lab.PROJECT_REF + '.supabase.co',
          headers: { apikey: key, Authorization: 'Bearer ' + key }, signal: controller.signal })
        if (!response || response.tlsAuthorized !== true || response.peerHostname !== lab.PROJECT_REF + '.supabase.co') fail('LAB_PROBE_TLS')
        const status = response.statusCode
        if (!Number.isInteger(status) || status < 100 || status > 599) fail('LAB_PROBE_RESPONSE')
        if (status >= 300 && status < 400) fail('LAB_PROBE_REDIRECT')
        if (!response.body || typeof response.body[Symbol.asyncIterator] !== 'function') fail('LAB_PROBE_RESPONSE')
        let bytes = 0
        for await (const chunk of response.body) {
          bytes += Buffer.byteLength(chunk)
          if (bytes > maxBytes) fail('LAB_PROBE_RESPONSE_TOO_LARGE')
          if (controller.signal.aborted) fail('LAB_PROBE_TIMEOUT')
        }
        statuses.push(status)
      }
      return statuses
    })()])
    return { mode: 'OFFLINE_SIMULATION', httpsReachable: null, simulatedHttpsReachable: true, authenticationValidated: false,
      reason: 'ENDPOINT_CONTRACT_UNVERIFIED', negativeStatus: statuses[0], configuredStatus: statuses[1] }
  } catch (error) {
    const allowed = new Set(['LAB_PROBE_TIMEOUT', 'LAB_PROBE_TLS', 'LAB_PROBE_RESPONSE', 'LAB_PROBE_REDIRECT', 'LAB_PROBE_RESPONSE_TOO_LARGE'])
    fail(allowed.has(error.message) ? error.message : 'LAB_PROBE_TRANSPORT_FAILED')
  } finally { clearTimeout(timer); controller.abort() }
}

function main() {
  // No opt-in environment flag: a future reviewed change and authorization are
  // required. Do not even open a credential file in the current CLI.
  console.error('LAB_PROBE_BLOCKED_ENDPOINT_CONTRACT_AND_NETWORK_AUTHORIZATION')
  process.exitCode = 1
}

module.exports = { PRIVATE_FILE, CANDIDATE_PATH, validatePublicConfig, assertRestrictedAcl,
  inspectWindowsAcl, readProbeConfig, assertDestination, evaluateOffline, main }
if (require.main === module) main()
