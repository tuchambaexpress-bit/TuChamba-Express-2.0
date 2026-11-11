'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Real endpoint and password helper, transpiled in memory. No app/service imports,
// .env reads, real credentials, network calls or writes outside mock event arrays.
const routeFile = 'app/api/registro-agencia/route.ts'
const routeSource = fs.readFileSync(path.join(__dirname, '..', routeFile), 'utf8')
function compile(source) {
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  })
  assert.equal(result.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0)
  return result.outputText
}
const passwordExports = {}
vm.runInNewContext(compile(fs.readFileSync(path.join(__dirname, '../lib/validarPassword.ts'), 'utf8')),
  { exports: passwordExports }, { timeout: 1000 })
const compiledRoute = compile(routeSource)
const ID = '00000000-0000-0000-0000-000000000001'
const AGENCY = '00000000-0000-0000-0000-000000000002'
const AUTH = '00000000-0000-0000-0000-000000000003'
function body() {
  return { token: 'synthetic-token', invitacionId: ID, agencia: { nombre: 'Agencia sintética' },
    coordinador: { nombre: 'Coordinador sintético', email: 'synthetic@example.invalid', telefono: '5550000000' },
    password: 'Clave123!' }
}
function harness(options = {}) {
  const events = [], violations = []
  const invitation = options.invitation === null ? null : {
    id: ID, usado: false, expira_at: '2099-01-01T00:00:00Z', telefono_esperado: null, ...options.invitation,
  }
  const copy = value => JSON.parse(JSON.stringify(value))
  const record = (kind, details) => events.push({ kind, ...copy(details) })
  const client = {
    auth: { admin: {
      async createUser(value) { record('auth.create', value); return { data: { user: { id: AUTH } }, error: null } },
      async deleteUser(id) { record('auth.delete', { id }); return { error: null } },
    } },
    from(table) {
      let operation, value
      const filters = []
      const query = {
        select() { return query },
        eq(key, val) { filters.push([key, val]); return query },
        insert(val) { operation = 'insert'; value = val; return query },
        update(val) { operation = 'update'; value = val; return query },
        delete() { operation = 'delete'; return query },
        async single() { return result() },
        then(resolve, reject) { return Promise.resolve().then(result).then(resolve, reject) },
      }
      function result() {
        if (!operation && table === 'invitaciones') {
          record('lookup', { table, filters })
          return { data: invitation, error: options.lookupError ? { message: 'synthetic lookup failure' } : null }
        }
        record('db.write', { table, operation, value: value ?? null, filters })
        if (table === 'agencias' && operation === 'insert') return { data: { id: AGENCY }, error: null }
        if (['coordinadores', 'invitaciones'].includes(table)) return { data: null, error: null }
        violations.push('Unexpected mock operation')
        return { data: null, error: { message: 'Unexpected mock operation' } }
      }
      return query
    },
  }
  const exports = {}
  vm.runInNewContext(compiledRoute, {
    exports, process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://synthetic.invalid', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-key' } },
    require(name) {
      if (name === '@supabase/supabase-js') return { createClient(url, key) {
        if (url !== 'https://synthetic.invalid' || key !== 'synthetic-key') violations.push('Unexpected client')
        record('client', {}); return client
      } }
      if (name === 'next/server') return { NextResponse: { json: (value, init) => Response.json(value, init) } }
      if (name === '@/lib/validarPassword') return passwordExports
      throw Error('Forbidden import: ' + name)
    },
    fetch() { throw Error('Network forbidden') },
    console: { error() { throw Error('Unexpected error log') } },
  }, { timeout: 1000 })
  return {
    events,
    async invoke(input = body()) {
      const request = new Request('https://synthetic.invalid/api/registro-agencia', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: options.raw === undefined ? JSON.stringify(input) : options.raw,
      })
      const response = await exports.POST(request)
      assert.deepEqual(violations, [])
      return { status: response.status, body: await response.json() }
    },
  }
}
function noWrites(h) {
  assert.deepEqual(h.events.filter(e => e.kind === 'db.write' || e.kind.startsWith('auth.')), [])
}

test('token válido e ID coincidente vinculan y consumen la misma invitación', async () => {
  const h = harness(), response = await h.invoke()
  assert.deepEqual(response, { status: 200, body: { ok: true } })
  assert.deepEqual(h.events.map(e => e.kind), ['client', 'lookup', 'auth.create', 'db.write', 'db.write', 'db.write'])
  assert.deepEqual(h.events.find(e => e.kind === 'lookup').filters, [['token', 'synthetic-token']])
  const writes = h.events.filter(e => e.kind === 'db.write')
  assert.equal(writes[0].value.invitacion_id, ID)
  assert.equal(writes[1].value.agencia_id, AGENCY)
  assert.equal(writes[1].value.auth_user_id, AUTH)
  assert.deepEqual(writes[2], { kind: 'db.write', table: 'invitaciones', operation: 'update',
    value: { usado: true, agencia_id: AGENCY }, filters: [['id', ID]] })
})

test('ID discrepante rechaza sin crear usuarios, agencias, coordinadores ni consumir', async () => {
  const h = harness(), input = body(); input.invitacionId = '00000000-0000-0000-0000-000000000099'
  assert.equal((await h.invoke(input)).status, 400)
  assert.equal(h.events.filter(e => e.kind === 'lookup').length, 1)
  noWrites(h)
})

test('ID ausente se rechaza según el contrato obligatorio del formulario', async () => {
  const h = harness(), input = body(); delete input.invitacionId
  assert.equal((await h.invoke(input)).status, 400); noWrites(h)
  assert.deepEqual(h.events, [])
})

for (const [name, options, error] of [
  ['token inexistente', { invitation: null }, 'Token inválido'],
  ['error de consulta incluso con datos', { lookupError: true }, 'Token inválido'],
  ['invitación sin ID confiable', { invitation: { id: null } }, 'Token inválido'],
  ['invitación vencida', { invitation: { expira_at: '2000-01-01T00:00:00Z' } }, 'Este link ha expirado'],
  ['caducidad inválida', { invitation: { expira_at: 'invalid' } }, 'Este link ha expirado'],
  ['invitación consumida', { invitation: { usado: true } }, 'Este link ya fue utilizado'],
  ['teléfono discrepante', { invitation: { telefono_esperado: '5559999999' } }, 'Datos incorrectos para registro'],
]) test(name + ' se rechaza sin escrituras', async () => {
  const h = harness(options), response = await h.invoke()
  assert.deepEqual(response, { status: 400, body: { error } }); noWrites(h)
})

test('JSON malformado se rechaza sin consultas ni escrituras', async () => {
  const h = harness({ raw: '{' }); assert.equal((await h.invoke()).status, 400)
  assert.deepEqual(h.events, [])
})

test('estructuras y tipos inválidos se rechazan antes de mutar', async () => {
  const inputs = [null, [], {}, { ...body(), agencia: null }, { ...body(), coordinador: null },
    { ...body(), token: 123 }, { ...body(), invitacionId: {} }, { ...body(), password: {} },
    { ...body(), coordinador: { ...body().coordinador, telefono: {} } },
    { ...body(), agencia: { nombre: ' ' } }, { ...body(), coordinador: { nombre: 'Nombre' } }]
  for (const input of inputs) {
    const h = harness(); assert.equal((await h.invoke(input)).status, 400); noWrites(h)
  }
})

test('contraseña inválida se rechaza antes de crear Auth', async () => {
  const h = harness(); assert.equal((await h.invoke({ ...body(), password: 'short' })).status, 400); noWrites(h)
})

test('campos extra del cliente no sustituyen el sujeto, agencia o estado', async () => {
  const h = harness(), input = body()
  input.agencia.id = 'untrusted-agency'; input.agencia.invitacion_id = 'untrusted-invitation'
  input.coordinador.auth_user_id = 'untrusted-auth'; input.coordinador.agencia_id = 'untrusted-agency'
  input.coordinador.status = 'activo'; input.coordinador.rol = 'maestro'
  assert.equal((await h.invoke(input)).status, 200)
  const writes = h.events.filter(e => e.kind === 'db.write')
  assert.equal(writes[0].value.invitacion_id, ID)
  assert.equal(writes[0].value.status, 'pendiente_aprobacion')
  assert.equal(writes[1].value.agencia_id, AGENCY)
  assert.equal(writes[1].value.auth_user_id, AUTH)
  assert.equal(writes[1].value.status, 'pendiente_aprobacion')
})

test('AST: vínculo y consumo proceden del ID servidor, no del ID cliente', () => {
  const tree = ts.createSourceFile(routeFile, routeSource, ts.ScriptTarget.Latest, true)
  const declarations = [], bindings = [], consumption = []
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) === 'invitacionIdValidada') declarations.push(node.initializer.getText(tree))
    if (ts.isPropertyAssignment(node) && node.name.getText(tree) === 'invitacion_id') bindings.push(node.initializer.getText(tree))
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'eq' &&
        node.arguments[0]?.text === 'id') consumption.push(node.arguments[1].getText(tree))
    ts.forEachChild(node, visit)
  }
  visit(tree)
  assert.deepEqual(declarations, ['invitacion.id'])
  assert.deepEqual(bindings, ['invitacionIdValidada'])
  assert.deepEqual(consumption, ['nuevaAgencia.id', 'invitacionIdValidada'])
})
