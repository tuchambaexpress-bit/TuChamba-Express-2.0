'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Real Server Component, transpiled in memory. No Next server, .env, React
// renderer or Supabase runtime is loaded. JSX is inspected as a synthetic tree.
const source = fs.readFileSync(path.join(__dirname, '../app/invitacion/[token]/page.tsx'), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true,
})
assert.equal(compiled.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0)
const token = 'synthetic-token-A'
const invitation = { id: 'synthetic-id-A', usado: false, expira_at: '2099-01-01T00:00:00Z' }

async function render(scenario = {}, requestedToken = token) {
  const calls = [], clients = [], violations = []
  const exports = {}
  const jsx = (type, props) => ({ type, props })
  const contract = (ok, message) => { if (!ok) violations.push(message) }
  vm.runInNewContext(compiled.outputText, {
    exports,
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://synthetic.invalid',
      SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-secret' } },
    fetch() { violations.push('Unexpected network'); throw Error('Network forbidden') },
    require(name) {
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx }
      if (name === '@/components/invitacion/FormularioInvitacion') return { default: 'InvitationForm' }
      if (name === '@supabase/supabase-js') return { createClient(...args) {
        clients.push(args)
        if (scenario.clientThrows) throw Error('synthetic-service-secret client failure')
        const query = {
          select(...args) { calls.push(['select', ...args]); return query },
          eq(...args) { calls.push(['eq', ...args]); return query },
          async single() {
            calls.push(['single'])
            contract(calls.length === 4 && calls[2][0] === 'eq' && calls[2][1] === 'token' &&
              calls[2][2] === requestedToken, 'Query must be restricted before execution')
            if (scenario.queryThrows) throw Error('synthetic-service-secret backend failure')
            return { data: scenario.data === undefined ? invitation : scenario.data,
              error: scenario.error ?? null }
          },
        }
        return { from(...args) { calls.push(['from', ...args]); return query } }
      } }
      violations.push('Unexpected import: ' + name)
      throw Error('Unexpected import: ' + name)
    },
  })
  assert.equal(exports.dynamic, 'force-dynamic')
  const tree = await exports.default({ params: { token: requestedToken } })
  assert.deepEqual(violations, [])
  assert.equal(clients.length, 1)
  assert.equal(clients[0][0], 'https://synthetic.invalid')
  assert.equal(clients[0][1], 'synthetic-service-secret')
  assert.deepEqual(JSON.parse(JSON.stringify(clients[0][2])), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  if (!scenario.clientThrows) assert.deepEqual(calls, [
    ['from', 'invitaciones'], ['select', 'id, usado, expira_at'],
    ['eq', 'token', requestedToken], ['single'],
  ])
  const serialized = JSON.stringify(tree)
  assert(!serialized.includes('synthetic-service-secret'))
  assert(!serialized.includes('synthetic.invalid'))
  return { tree, serialized }
}

function forms(node) {
  if (!node || typeof node !== 'object') return []
  if (Array.isArray(node)) return node.flatMap(forms)
  return [...(node.type === 'InvitationForm' ? [node] : []), ...forms(node.props?.children)]
}

test('valid token renders only the existing form props with one exact minimal query', async () => {
  const { tree, serialized } = await render({ data: { ...invitation,
    token: 'other-token-B', telefono_esperado: 'private-phone', admin: 'private-admin' } })
  const found = forms(tree)
  assert.equal(found.length, 1)
  assert.deepEqual(JSON.parse(JSON.stringify(found[0].props)), { token, invitacionId: invitation.id })
  for (const privateValue of ['other-token-B', 'private-phone', 'private-admin']) {
    assert(!serialized.includes(privateValue))
  }
})

for (const [name, scenario, message] of [
  ['nonexistent token', { data: null }, 'Link inválido'],
  ['used token', { data: { ...invitation, usado: true } }, 'Link ya utilizado'],
  ['expired token', { data: { ...invitation, expira_at: '2000-01-01T00:00:00Z' } }, 'Link expirado'],
  ['invalid expiration', { data: { ...invitation, expira_at: 'invalid' } }, 'Link expirado'],
  ['query error with data', { error: { message: 'synthetic-service-secret' } }, 'Link inválido'],
  ['query exception', { queryThrows: true }, 'Link inválido'],
  ['client exception', { clientThrows: true }, 'Link inválido'],
  ['missing invitation ID', { data: { ...invitation, id: null } }, 'Link inválido'],
]) {
  test(name + ' never enables the form', async () => {
    const { tree, serialized } = await render(scenario)
    assert.deepEqual(forms(tree), [])
    assert(serialized.includes(message))
  })
}

test('token is passed as an exact value, never interpreted as arbitrary query filters', async () => {
  const requestedToken = 'synthetic-A,token.eq.synthetic-B%_*'
  const { tree } = await render({}, requestedToken)
  assert.equal(forms(tree)[0].props.token, requestedToken)
})

test('nullable unused state preserves the existing form contract', async () => {
  const { tree } = await render({ data: { ...invitation, usado: null } })
  assert.equal(forms(tree).length, 1)
})
