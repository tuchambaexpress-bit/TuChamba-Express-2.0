'use strict'
// Static contract checks only: no SQL interpreter, database, app imports or network.
// These checks cannot establish runtime RLS enforcement or transactional rollback.
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const sql = readFileSync(join(__dirname,
  '../supabase/migrations/20261111000000_rec_f2_contener_insert_coordinadores.sql'), 'utf8')
  .replace(/--[^\r\n]*/g, '').trim()
const drop = 'DROP POLICY coordinadores_insert_publico ON public.coordinadores;'
const before = sql.slice(0, sql.indexOf(drop))
const after = sql.slice(sql.indexOf(drop) + drop.length)
function guard(section, condition, error) {
  assert.match(section, new RegExp(`IF ${condition} THEN\\s+RAISE EXCEPTION '${error}';\\s+END IF;`, 's'))
}

test('static: transaction and bounded exclusive lock precede policy mutation', () => {
  assert.match(sql, /^BEGIN ISOLATION LEVEL READ COMMITTED;/)
  assert.match(before, /SET LOCAL lock_timeout = '5s';/)
  assert.match(before, /LOCK TABLE public\.coordinadores IN ACCESS EXCLUSIVE MODE;/)
  assert.match(sql, /END;\s+\$migration\$;\s+COMMIT;$/)
  assert.doesNotMatch(sql, /EXCEPTION\s+WHEN|ROLLBACK|SAVEPOINT/i)
})

test('static: absent table and disabled RLS have explicit abort guards', () => {
  assert.match(before, /target_table := pg_catalog\.to_regclass\('public\.coordinadores'\);/)
  guard(before, 'target_table IS NULL', 'REC_F2_COORD_TABLE_MISSING')
  guard(before, 'NOT EXISTS \\(\\s+SELECT 1 FROM pg_catalog.pg_class\\s+WHERE oid = target_table AND relrowsecurity\\s+\\)', 'REC_F2_COORD_RLS_DISABLED')
  assert.ok(before.indexOf('LOCK TABLE') < before.indexOf('REC_F2_COORD_RLS_DISABLED'))
})

test('static: exact INSERT PERMISSIVE PUBLIC true definition or explicit abort', () => {
  assert.match(before, /p\.polrelid = target_table\s+AND p\.polname = 'coordinadores_insert_publico'/)
  guard(before, "expected_policy.polcmd IS DISTINCT FROM 'a'\\s+OR expected_policy.polpermissive IS DISTINCT FROM true\\s+OR expected_policy.polroles IS DISTINCT FROM ARRAY\\[0::oid\\]\\s+OR expected_policy.polqual IS NOT NULL\\s+OR pg_catalog.pg_get_expr\\(expected_policy.polwithcheck, target_table\\)\\s+IS DISTINCT FROM 'true'", 'REC_F2_COORD_POLICY_DEFINITION_UNEXPECTED')
})

test('static: any additional INSERT or ALL policy aborts before DROP', () => {
  guard(before, "EXISTS \\(\\s+SELECT 1 FROM pg_catalog.pg_policy AS p\\s+WHERE p.polrelid = target_table\\s+AND p.oid <> expected_policy.oid\\s+AND p.polcmd IN \\('a', '\\*'\\)\\s+\\)", 'REC_F2_COORD_OTHER_INSERT_POLICY')
})

test('static: postcondition rejects remaining target or INSERT/ALL policies', () => {
  guard(after, "EXISTS \\(\\s+SELECT 1 FROM pg_catalog.pg_policy AS p\\s+WHERE p.polrelid = target_table\\s+AND \\(p.polname = 'coordinadores_insert_publico' OR p.polcmd IN \\('a', '\\*'\\)\\)\\s+\\)", 'REC_F2_COORD_INSERT_POLICY_REMAINS')
  guard(after, 'NOT EXISTS \\(\\s+SELECT 1 FROM pg_catalog.pg_class\\s+WHERE oid = target_table AND relrowsecurity\\s+\\)', 'REC_F2_COORD_RLS_POSTCONDITION_FAILED')
})

test('static: second execution explicitly rejects missing target policy', () => {
  guard(before, 'NOT FOUND', 'REC_F2_COORD_POLICY_MISSING_OR_ALREADY_APPLIED')
  assert.doesNotMatch(sql, /DROP POLICY IF EXISTS/i)
})

test('static: other policies compared by full catalog rows before and after', () => {
  assert.match(before, /SELECT coalesce\(jsonb_agg\(to_jsonb\(p\) ORDER BY p\.oid\), '\[\]'::jsonb\)\s+INTO other_policies_before\s+FROM pg_catalog\.pg_policy AS p\s+WHERE p\.polrelid = target_table AND p\.oid <> expected_policy\.oid;/)
  assert.match(after, /SELECT coalesce\(jsonb_agg\(to_jsonb\(p\) ORDER BY p\.oid\), '\[\]'::jsonb\)\s+INTO other_policies_after\s+FROM pg_catalog\.pg_policy AS p\s+WHERE p\.polrelid = target_table;/)
  guard(after, 'other_policies_after IS DISTINCT FROM other_policies_before', 'REC_F2_COORD_OTHER_POLICIES_CHANGED')
})

test('static: only one exact DROP; no data, grant, schema or other policy mutation', () => {
  assert.equal(sql.split(drop).length - 1, 1)
  assert.equal((sql.match(/\bDROP\b/gi) || []).length, 1)
  assert.doesNotMatch(sql, /\b(?:CREATE|ALTER|GRANT|REVOKE|INSERT|UPDATE|DELETE|TRUNCATE|EXECUTE|CALL)\b/i)
})
