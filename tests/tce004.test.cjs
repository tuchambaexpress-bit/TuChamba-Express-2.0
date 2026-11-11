const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { webcrypto } = require('node:crypto')

// Actual handlers, transpiled in memory. Imports, cookies, environment and all
// Supabase operations are mocked; no application module or .env is loaded.
const routes = [
  'app/api/admin/aprobar-agencia/route.ts',
  'app/api/admin/rechazar-agencia/route.ts',
  'app/api/admin/reset-password/route.ts',
  'app/api/invitaciones/route.ts',
]
const origin = 'https://app.example.test'

function harness(file, scenario = {}) {
  const events = [], queries = [], clients = [], cookieWrites = [], violations = []
  let lookups = 0, authorized = false, identityVerified = false, targetAllowed = false
  const writes = [], privileged = []
  const user = scenario.user === undefined ? { id: 'mock-admin', email: 'admin@example.test' } : scenario.user
  const admin = scenario.admin === undefined ? { rol: 'maestro', status: 'activo' } : scenario.admin
  const incomingCookies = [
    { name: 'sb-mock-auth-token', value: 'synthetic-session' },
    { name: 'sb-mock-auth-token.1', value: 'synthetic-chunk' },
  ]
  const refreshedCookies = [
    { name: 'sb-mock-auth-token', value: 'synthetic-refresh', options: { path: '/', httpOnly: true, secure: true, sameSite: 'lax' } },
    { name: 'sb-mock-auth-token.1', value: '', options: { path: '/', maxAge: 0 } },
  ]
  const env = {
    NEXT_PUBLIC_APP_URL: origin, NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.example.test',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon', SUPABASE_SERVICE_ROLE_KEY: 'mock-service', ...scenario.env,
  }
  const body = { agenciaId: 'mock-agency', coordinadorId: 'mock-coordinator', email: 'target@example.test', password: 'mock-password', ...scenario.body }
  // Violations are checked outside production try/catch, so swallowed mock
  // assertions cannot accidentally make a rejection test pass.
  function contract(ok, message) { if (!ok) violations.push(message) }
  function privilegedCall(name, args, kind) {
    contract(identityVerified && authorized, 'privileged operation before authorization: ' + name)
    if (name.startsWith('auth:')) contract(kind === 'service', 'Auth admin operation requires service client')
    if (file === routes[2] && admin?.rol === 'limitado') contract(targetAllowed, 'reset before target permission check')
    privileged.push({ name, args: structuredClone(args), kind })
    events.push('privileged:' + name)
  }
  function makeClient(kind) {
    return {
      from(table) {
        events.push('from:' + table)
        const q = { table, kind, calls: [] }
        queries.push(q)
        const result = () => {
          if (table === 'administradores') {
            lookups++
            const first = lookups === 1
            contract(identityVerified, 'administrator query before identity validation')
            contract(kind === 'service', 'administrator lookup must use service client')
            const filters = q.calls.filter(c => c.method === 'eq')
            const expected = first ? user?.email : body.email
            contract(filters.length === 1 && filters[0].args[0] === 'email' &&
              filters[0].args[1] === expected, 'wrong administrator identity/target email filter')
            const selections = q.calls.filter(c => c.method === 'select')
            contract(selections.length === 1 && selections[0].args[0] === (first ? 'rol, status' : 'rol'), 'wrong administrator selection')
            contract(q.calls.at(-1)?.method === 'maybeSingle', 'wrong cardinality method')
            if (scenario.lookupThrows || (!first && scenario.targetThrows)) throw new Error('mock lookup failure')
            const rows = first
              ? (scenario.adminRows ?? (admin ? [{ email: user?.email, ...admin }] : []))
              : (scenario.targetAdmin ? [{ email: body.email, ...scenario.targetAdmin }] : [])
            const matching = rows.filter(row => filters.every(c => row[c.args[0]] === c.args[1]))
            const error = (first ? scenario.lookupError : scenario.targetError) ??
              (matching.length > 1 ? { message: 'duplicate rows' } : null)
            const row = matching.length === 1 ? matching[0] : null
            if (first) {
              authorized = !error && !!row && row.status === 'activo' && ['maestro', 'limitado'].includes(row.rol)
              events.push('admin-checked')
            } else {
              targetAllowed = !error && !row
              events.push('target-checked')
            }
            const data = row ? Object.fromEntries(selections[0].args[0].split(',').map(k => [k.trim(), row[k.trim()]])) : null
            return { data, error }
          }
          contract(identityVerified && authorized, 'business read before authorization')
          if (table === 'invitaciones') {
            const inserted = q.calls.find(c => c.method === 'insert')?.args[0]
            return {
              data: scenario.insertNoData ? null : { token: inserted?.token },
              error: scenario.insertError ?? null,
            }
          }
          if (table === 'coordinadores') return { data: { auth_user_id: 'mock-target' }, error: null }
          if (table === 'reclutadores') return { data: [], error: null }
          return { data: { id: 'mock-record', token: 'mock-invitation' }, error: null }
        }
        const query = new Proxy({}, {
          get(_, method) {
            if (method === 'then') return (resolve, reject) => Promise.resolve().then(result).then(resolve, reject)
            return (...args) => {
              q.calls.push({ method, args: structuredClone(args) })
              if (['insert', 'update', 'delete', 'upsert'].includes(method)) {
                privilegedCall(table + ':' + method, args, kind)
                contract(table !== 'administradores', 'unexpected administrator write')
                // Invitation emission now reuses the authorized service client.
                contract(kind === 'service', 'wrong business client privilege')
                writes.push(table + ':' + method)
              }
              if (method === 'single' || method === 'maybeSingle') return Promise.resolve().then(result)
              return query
            }
          },
        })
        return query
      },
      auth: { admin: {
        listUsers: async (...args) => {
          privilegedCall('auth:list-users', args, kind)
          events.push('list-users')
          return { data: { users: [{ id: 'mock-target', email: body.email }] } }
        },
        updateUserById: async (...args) => {
          privilegedCall('auth:update-user', args, kind)
          writes.push('auth:update-user')
          return { error: null }
        },
        deleteUser: async (...args) => {
          privilegedCall('auth:delete-user', args, kind)
          writes.push('auth:delete-user')
          return { error: null }
        },
      } },
    }
  }
  const exports = {}
  const compiled = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true,
  })
  assert.equal((compiled.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0)
  vm.runInNewContext(compiled.outputText, {
    exports, URL, crypto: webcrypto, process: { env },
    fetch: () => { throw new Error('Network forbidden in isolated test') },
    require(name) {
      if (name === 'next/server') return { NextResponse: { json: (responseBody, init) => Response.json(responseBody, init) } }
      if (name === 'next/headers') return { cookies: async () => {
        events.push('cookie-store')
        if (scenario.cookieStoreThrows) throw new Error('mock cookies unavailable')
        return {
          getAll() {
            events.push('cookies-read')
            if (scenario.cookieReadThrows) throw new Error('mock cookie read failure')
            return structuredClone(incomingCookies)
          },
          set(...args) {
            cookieWrites.push(structuredClone(args))
            if (scenario.cookieWriteThrows) throw new Error('mock cookie write failure')
          },
        }
      } }
      if (name === '@supabase/supabase-js') return { createClient: (url, key) => {
        const kind = key === env.SUPABASE_SERVICE_ROLE_KEY ? 'service' : 'anon'
        contract(url === env.NEXT_PUBLIC_SUPABASE_URL, 'wrong Supabase URL')
        contract(key === env.SUPABASE_SERVICE_ROLE_KEY || key === env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'unexpected key')
        contract(identityVerified, 'data client created before verified identity')
        clients.push({ kind })
        events.push('client-created:' + kind)
        return makeClient(kind)
      } }
      if (name === '@supabase/ssr') return { createServerClient: (url, key, options) => {
        contract(url === env.NEXT_PUBLIC_SUPABASE_URL && key === env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'wrong SSR client configuration')
        contract(typeof options?.cookies?.getAll === 'function' && typeof options?.cookies?.setAll === 'function', 'incomplete cookie adapter')
        return { auth: { getUser: async (...args) => {
          events.push('get-user')
          contract(args.length === 0, 'getUser must validate cookie session')
          assert.deepEqual(options.cookies.getAll(), incomingCookies)
          if (scenario.refreshCookies) options.cookies.setAll(refreshedCookies)
          if (scenario.identityThrows) throw new Error('mock identity failure')
          identityVerified = !scenario.identityError && !!user?.id && !!user.email
          events.push('identity-checked')
          return { data: { user }, error: scenario.identityError ?? null }
        } } }
      } }
      throw new Error('Unexpected import: ' + name)
    },
  }, { filename: file })
  const headers = { 'content-type': 'application/json', origin, ...scenario.headers }
  for (const [key, value] of Object.entries(headers)) if (value === null) delete headers[key]
  const request = new Request(origin + '/api/mock', { method: 'POST', headers, body: JSON.stringify(body) })
  return {
    async invoke(input = request) {
      let response, failure
      try { response = await exports.POST(input) } catch (error) { failure = error }
      assert.deepEqual(violations, [], 'mock contract violations')
      if (failure) throw failure
      return response
    },
    writes, events, queries, clients, cookieWrites, refreshedCookies, privileged,
  }
}

for (const file of routes.filter(file => file !== routes[2])) {
  const rejections = [
    ['no session', { user: null }, 401],
    ['expired or invalid session', { identityError: { message: 'mock expired' } }, 401],
    ['identity without email', { user: { id: 'mock-admin' } }, 401],
    ['non-administrator', { admin: null }, 403],
    ['inactive administrator', { admin: { rol: 'maestro', status: 'inactivo' } }, 403],
    ['unknown role', { admin: { rol: 'unknown', status: 'activo' } }, 403],
    ['identity service exception', { identityThrows: true }, 503],
    ['authorization query error', { lookupError: { message: 'mock failure' } }, 503],
    ['authorization exception', { lookupThrows: true }, 503],
    ['old key without session', { user: null, headers: { 'x-admin-key': 'mock-old-key' } }, 401],
    ['foreign origin', { headers: { origin: 'https://attacker.example.test' } }, 403],
    ['missing origin', { headers: { origin: null } }, 403],
    ['cross-site request', { headers: { 'sec-fetch-site': 'cross-site' } }, 403],
    ['missing configured origin', { env: { NEXT_PUBLIC_APP_URL: undefined } }, 503],
    ['invalid configured origin', { env: { NEXT_PUBLIC_APP_URL: 'invalid' } }, 503],
    ['insecure configured origin', { env: { NEXT_PUBLIC_APP_URL: 'http://app.example.test' } }, 503],
    ['spoofed forwarded host', { headers: { origin: 'https://attacker.example.test', 'x-forwarded-host': 'attacker.example.test', host: 'attacker.example.test' } }, 403],
  ]
  for (const [name, scenario, status] of rejections) {
    test(`${file}: ${name}`, async () => {
      const h = harness(file, scenario)
      assert.equal((await h.invoke()).status, status)
      assert.deepEqual(h.writes, [])
      assert(!h.events.includes('list-users'))
      assert(h.events.every(e => !e.startsWith('from:') || e === 'from:administradores'))
    })
  }
  for (const rol of ['maestro', 'limitado']) {
    test(`${file}: active ${rol}, authorized operation`, async () => {
      const h = harness(file, { admin: { rol, status: 'activo' } })
      assert.equal((await h.invoke()).status, 200)
      assert(h.writes.length > 0)
      assert(h.events.indexOf('identity-checked') < h.events.indexOf('admin-checked'))
    })
  }
}

for (const rol of ['maestro', 'limitado']) {
  test(`${routes[3]}: service emission preserves server fields and response for ${rol}`, async () => {
    const before = new Date()
    before.setDate(before.getDate() + 7)
    const h = harness(routes[3], { admin: { rol, status: 'activo' }, body: {
      telefonoEsperado: '5550000000', token: 'client-token', expira_at: '2000-01-01',
      tipo: 'client-type', usado: true, rol: 'client-role',
    } })
    const response = await h.invoke()
    const after = new Date()
    after.setDate(after.getDate() + 7)
    assert.equal(response.status, 200)
    const result = await response.json()
    assert.deepEqual(h.clients, [{ kind: 'service' }])
    assert.deepEqual(h.writes, ['invitaciones:insert'])
    assert.equal(h.privileged.length, 1)
    assert.equal(h.privileged[0].kind, 'service')
    assert(h.events.indexOf('admin-checked') < h.events.indexOf('privileged:invitaciones:insert'))
    const q = h.queries.find(q => q.table === 'invitaciones')
    const inserted = q.calls.find(c => c.method === 'insert').args[0]
    assert.match(inserted.token, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    assert(Date.parse(inserted.expira_at) >= before.getTime())
    assert(Date.parse(inserted.expira_at) <= after.getTime())
    assert.deepEqual(inserted, { token: result.token, tipo: 'nueva_agencia', usado: false,
      expira_at: result.expira, telefono_esperado: '5550000000' })
    assert.deepEqual(q.calls.map(c => c.method), ['insert', 'select', 'single'])
    assert.deepEqual(q.calls.find(c => c.method === 'select').args, ['token'])
    assert.deepEqual(result, { token: inserted.token, url: `${origin}/invitacion/${inserted.token}`, expira: inserted.expira_at })
    assert(!JSON.stringify(result).includes('mock-service'))
    assert(!JSON.stringify(result).includes('mock-anon'))
  })
}

for (const [name, scenario] of [
  ['insert error', { insertError: { message: 'private mock-service detail' } }],
  ['missing insert result', { insertNoData: true }],
]) {
  test(`${routes[3]}: ${name} returns generic failure`, async () => {
    const h = harness(routes[3], scenario)
    const response = await h.invoke()
    assert.equal(response.status, 500)
    assert.deepEqual(await response.json(), { error: 'Error al crear invitación' })
    assert.deepEqual(h.writes, ['invitaciones:insert'])
    assert.equal(h.privileged[0].kind, 'service')
  })
}

test(`${routes[3]}: optional phone remains null`, async () => {
  const h = harness(routes[3])
  assert.equal((await h.invoke()).status, 200)
  assert.equal(h.privileged[0].args[0].telefono_esperado, null)
})

test('old authorization and public credential removed from all six files', () => {
  for (const file of [...routes, 'components/admin/SolicitudesPanel.tsx', 'components/admin/InvitacionesPanel.tsx']) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
    assert(!/x-admin-key|ADMIN_SECRET_KEY|NEXT_PUBLIC_ADMIN_KEY/.test(source), file)
  }
})

for (const file of routes.filter(file => file !== routes[2])) {
  test(file + ': authenticated email filter ignores browser administrator claims', async () => {
    const h = harness(file, { body: { adminId: 'other-admin', adminEmail: 'other@example.test', rol: 'maestro' } })
    assert.equal((await h.invoke()).status, 200)
    const q = h.queries.find(q => q.table === 'administradores')
    assert.deepEqual(q.calls.find(c => c.method === 'eq').args, ['email', 'admin@example.test'])
  })
  test(file + ': other identity administrator row cannot authorize', async () => {
    const h = harness(file, {
      adminRows: [{ email: 'other@example.test', rol: 'maestro', status: 'activo' }],
      body: { adminId: 'other-admin', adminEmail: 'other@example.test', rol: 'maestro' },
    })
    assert.equal((await h.invoke()).status, 403)
    assert.deepEqual(h.writes, [])
    assert.deepEqual(h.privileged, [])
  })
  test(file + ': duplicate identity rows fail closed', async () => {
    const h = harness(file, { adminRows: [
      { email: 'admin@example.test', rol: 'maestro', status: 'activo' },
      { email: 'admin@example.test', rol: 'limitado', status: 'activo' },
    ] })
    assert.equal((await h.invoke()).status, 503)
    assert.deepEqual(h.privileged, [])
  })
  test(file + ': cookie adapter reads chunks and forwards refresh options', async () => {
    const h = harness(file, { refreshCookies: true })
    assert.equal((await h.invoke()).status, 200)
    assert(h.events.includes('cookies-read'))
    assert.deepEqual(h.cookieWrites, h.refreshedCookies.map(c => [c.name, c.value, c.options]))
  })
  for (const option of ['cookieStoreThrows', 'cookieReadThrows', 'cookieWriteThrows']) {
    test(file + ': fail closed on ' + option, async () => {
      const h = harness(file, { [option]: true, refreshCookies: true })
      assert.equal((await h.invoke()).status, 503)
      assert.deepEqual(h.privileged, [])
      assert.deepEqual(h.clients, [])
    })
  }
  test(file + ': origin rejected before cookies, clients or identity lookup', async () => {
    const h = harness(file, { headers: { origin: 'https://other.example.test' } })
    assert.equal((await h.invoke()).status, 403)
    assert.deepEqual(h.events, [])
    assert.deepEqual(h.queries, [])
    assert.deepEqual(h.clients, [])
  })
  test(file + ': absent fetch metadata still requires origin and identity', async () => {
    const h = harness(file)
    assert.equal((await h.invoke()).status, 200)
    assert(h.events.indexOf('identity-checked') < h.events.indexOf('admin-checked'))
    assert(h.privileged.length > 0)
  })
}
// REC-F2-001 / TCE-004 containment replaces the reset-specific target checks,
// successful reset assertions and shared authentication/cookie expectations for
// this handler. The other three handlers retain those historical cases.
for (const rol of ['maestro', 'limitado', 'unknown', null]) {
  for (const email of ['target@example.test', 'absent@example.test', 'admin@example.test']) {
    test('reset unavailable without effects: role=' + rol + ', target=' + email, async () => {
      const h = harness(routes[2], {
        admin: rol ? { rol, status: 'activo' } : null,
        user: rol ? undefined : null,
        body: { email, password: 'synthetic-unused', rol },
      })
      const response = await h.invoke()
      assert.equal(response.status, 503)
      assert.deepEqual(await response.json(), {
        error: 'Restablecimiento administrativo de contraseña no disponible',
      })
      assert.deepEqual(h.writes, [])
      assert.deepEqual(h.privileged, []) // Includes listUsers and updateUserById.
      assert(!h.events.includes('list-users'))
      assert.deepEqual(h.queries, [])
      assert.deepEqual(h.clients, [])
      assert.deepEqual(h.cookieWrites, [])
      assert.deepEqual(h.events, [])
    })
  }
}

test('reset does not inspect the request, parse JSON or require configuration', async () => {
  const h = harness(routes[2], { env: { NEXT_PUBLIC_APP_URL: undefined } })
  const unreadableRequest = new Proxy({}, {
    get() { throw new Error('Contained POST must not inspect the request') },
  })
  const response = await h.invoke(unreadableRequest)
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), {
    error: 'Restablecimiento administrativo de contraseña no disponible',
  })
  assert.deepEqual(h.privileged, [])
  assert.deepEqual(h.writes, [])
  assert.deepEqual(h.events, [])
  assert.deepEqual(h.queries, [])
  assert.deepEqual(h.clients, [])
})

// REC-F2-001: code-only access stays blocked regardless of request or identity.
const recruiterLoginRoute = 'app/api/reclutador/login/route.ts'
for (const [name, scenario, unreadable] of [
  ['known synthetic code', { body: { codigo: 'MOCK-KNOWN' } }, false],
  ['unknown synthetic code', { body: { codigo: 'MOCK-UNKNOWN' } }, false],
  ['missing code', {}, false],
  ['unreadable request', {}, true],
  ['missing configuration', { env: {
    NEXT_PUBLIC_APP_URL: undefined,
    NEXT_PUBLIC_SUPABASE_URL: undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
    SUPABASE_SERVICE_ROLE_KEY: undefined,
  } }, false],
]) {
  test('recruiter login unavailable without effects: ' + name, async () => {
    // Neither code is queried: the endpoint must not distinguish account existence.
    const h = harness(recruiterLoginRoute, scenario)
    const response = unreadable
      ? await h.invoke(new Proxy({}, {
        get() { throw new Error('Contained recruiter login must not inspect the request') },
      }))
      : await h.invoke()
    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), {
      error: 'Acceso de reclutadores temporalmente no disponible',
    })
    assert.deepEqual(h.privileged, [])
    assert.deepEqual(h.writes, [])
    assert.deepEqual(h.queries, [])
    assert.deepEqual(h.clients, [])
    assert.deepEqual(h.cookieWrites, [])
    assert.deepEqual(h.events, [])
  })
}

// Pure policy module, loaded with the same in-memory TypeScript/VM mechanism.
function loadRecruiterAccess() {
  const file = 'lib/supabase/reclutador-access.ts'
  const compiled = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  })
  assert.equal((compiled.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0)
  const exports = {}
  vm.runInNewContext(compiled.outputText, {
    exports,
    require(name) { throw new Error('Unexpected policy import: ' + name) },
    fetch() { throw new Error('Network forbidden in policy test') },
  }, { filename: file })
  return exports.canAccessReclutador
}

function recruiterAccessSnapshot() {
  return {
    auth: { userId: 'mock-auth', verified: true },
    bindings: [{ authUserId: 'mock-auth', identityId: 'mock-identity' }],
    identity: { id: 'mock-identity', enabled: true },
    session: { authUserId: 'mock-auth', identityId: 'mock-identity', valid: true },
    agencyId: 'agency-a', permission: 'read',
    memberships: [{ identityId: 'mock-identity', agencyId: 'agency-a', active: true,
      permissions: [{ permission: 'read', active: true }] }],
  }
}

for (const [name, change] of [
  ['missing binding', s => { s.bindings = [] }],
  ['ambiguous binding', s => { s.bindings.push({ ...s.bindings[0] }) }],
  ['different Auth subject', s => { s.auth.userId = 'other-auth' }],
  ['different identity binding', s => { s.bindings[0].identityId = 'other-identity' }],
  ['unverified Auth', s => { s.auth.verified = false }],
  ['suspended global identity', s => { s.identity.enabled = false }],
  ['invalid session', s => { s.session.valid = false }],
  ['session for another subject', s => { s.session.authUserId = 'other-auth' }],
  ['session for another identity', s => { s.session.identityId = 'other-identity' }],
  ['foreign agency', s => { s.agencyId = 'agency-b' }],
  ['missing explicit agency', s => { delete s.agencyId }],
  ['suspended membership', s => { s.memberships[0].active = false }],
  ['foreign membership owner', s => { s.memberships[0].identityId = 'other-identity' }],
  ['missing permission', s => { s.memberships[0].permissions = [] }],
  ['revoked permission', s => { s.memberships[0].permissions[0].active = false }],
  ['different permission', s => { s.permission = 'write' }],
  ['missing operation', s => { delete s.permission }],
  ['ambiguous memberships', s => { s.memberships.push(structuredClone(s.memberships[0])) }],
  ['contradictory memberships', s => { s.memberships.push({ ...structuredClone(s.memberships[0]), active: false }) }],
  ['duplicate grants', s => { s.memberships[0].permissions.push({ permission: 'read', active: true }) }],
  ['contradictory grants', s => { s.memberships[0].permissions.push({ permission: 'read', active: false }) }],
  ['unexpected boolean type', s => { s.memberships[0].active = 'true' }],
  ['unexpected session type', s => { s.session.valid = 1 }],
  ['unexpected membership collection', s => { s.memberships = {} }],
  ['null membership', s => { s.memberships = [null] }],
  ['null grant', s => { s.memberships[0].permissions = [null] }],
  ['empty identifier', s => { s.auth.userId = '' }],
  ['implicit normalization', s => { s.agencyId = ' agency-a ' }],
]) {
  test('recruiter access denies ' + name, () => {
    const decide = loadRecruiterAccess()
    const snapshot = recruiterAccessSnapshot()
    change(snapshot)
    const before = structuredClone(snapshot)
    assert.equal(decide(snapshot), false)
    assert.deepEqual(snapshot, before)
  })
}

test('recruiter access allows explicit valid permission without input mutation', () => {
  const decide = loadRecruiterAccess()
  const snapshot = recruiterAccessSnapshot()
  const before = structuredClone(snapshot)
  assert.equal(decide(snapshot), true)
  assert.equal(decide(snapshot), true)
  assert.deepEqual(snapshot, before)
})

test('recruiter access denies malformed top-level input and missing fields', () => {
  const decide = loadRecruiterAccess()
  for (const value of [undefined, null, false, 1, 'valid', [], {}]) assert.equal(decide(value), false)
  for (const key of Object.keys(recruiterAccessSnapshot())) {
    const snapshot = recruiterAccessSnapshot()
    delete snapshot[key]
    assert.equal(decide(snapshot), false, key)
  }
})

test('recruiter access keeps two agency authorizations independent', () => {
  const decide = loadRecruiterAccess()
  const snapshot = recruiterAccessSnapshot()
  snapshot.memberships.push({ identityId: 'mock-identity', agencyId: 'agency-b', active: true,
    permissions: [{ permission: 'read', active: true }] })
  assert.equal(decide(snapshot), true)
  snapshot.agencyId = 'agency-b'
  assert.equal(decide(snapshot), true)
  snapshot.memberships[0].active = false
  assert.equal(decide(snapshot), true)
  snapshot.agencyId = 'agency-a'
  assert.equal(decide(snapshot), false)
  snapshot.memberships.reverse()
  assert.equal(decide(snapshot), false)
  snapshot.agencyId = 'agency-b'
  assert.equal(decide(snapshot), true)
  snapshot.identity.enabled = false
  assert.equal(decide(snapshot), false)
})

const socialProfileRoutes = ['app/api/reclutador/perfil/route.ts', 'app/api/reclutador/route.ts']
const socialProfileUnavailable = { error: 'Actualización de redes sociales temporalmente no disponible' }
for (const file of socialProfileRoutes) {
  for (const [name, scenario, unreadable] of [
    ['own synthetic ID', { body: { reclutadorId: 'mock-self', redesSociales: [] } }, false],
    ['foreign synthetic ID', { body: { reclutadorId: 'mock-other', redesSociales: [] } }, false],
    ['missing ID', {}, false],
    ['unreadable body', {}, true],
    ['missing Supabase configuration', { env: {
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      SUPABASE_SERVICE_ROLE_KEY: undefined,
    } }, false],
  ]) {
    test('social profile POST contained: ' + file + ': ' + name, async () => {
      const h = harness(file, scenario)
      const response = unreadable
        ? await h.invoke(new Proxy({}, {
          get() { throw new Error('Contained social profile POST must not inspect the request') },
        }))
        : await h.invoke()
      assert.equal(response.status, 503)
      assert.deepEqual(await response.json(), socialProfileUnavailable)
      for (const effects of [h.clients, h.queries, h.writes, h.privileged, h.cookieWrites, h.events]) {
        assert.deepEqual(effects, [])
      }
    })
  }
  test('social profile GET unchanged structurally: ' + file, () => {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8').replace(/\r\n/g, '\n')
    const start = source.indexOf('export async function GET(')
    const end = source.indexOf('// POST', start)
    assert(start >= 0 && end > start)
    // Baseline GET source hash captured before this containment; line endings excluded.
    const digest = require('node:crypto').createHash('sha256').update(source.slice(start, end).trimEnd()).digest('hex')
    assert.equal(digest, '7ff8a99ae4380556f485519aad4d736aba01520952b22fea5a004de52f4b8dfb')
  })
}

test('social profile POST responses are uniform across both endpoints', async () => {
  const results = []
  for (const file of socialProfileRoutes) {
    const h = harness(file, { body: { reclutadorId: 'mock-target', redesSociales: [] } })
    const response = await h.invoke()
    results.push({ status: response.status, body: await response.json() })
    for (const effects of [h.clients, h.queries, h.writes, h.privileged, h.cookieWrites, h.events]) {
      assert.deepEqual(effects, [])
    }
  }
  assert.deepEqual(results[0], { status: 503, body: socialProfileUnavailable })
  assert.deepEqual(results[1], results[0])
})
