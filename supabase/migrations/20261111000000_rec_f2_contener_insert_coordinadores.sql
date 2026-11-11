-- REC-F2-001/002: prepared only; applying this file requires separate authorization.
-- First versioned SQL migration in this checkout; timestamp naming introduced here.
-- Contract: strict one-shot migration. Missing/changed policy or a second run aborts.
-- No data changes, replacement policy, GRANT changes, or application changes.
-- Compensation: keep public INSERT denied; suspend affected onboarding and prepare
-- an authorized forward fix. Never automatically restore WITH CHECK (true).
-- service_role bypass remains; application authorization is a separate pending fix.
-- Pending: token/invitacionId binding, email-based admin lookup, specific authority,
-- invitation consistency/single consumption, and other privileged operations.
-- Future validation: real PostgreSQL, synthetic roles/data, rollback on guard failure,
-- denied anon/authenticated INSERT and preserved legitimate service operations.
-- Static tests do not execute or validate PostgreSQL/RLS behavior.

BEGIN ISOLATION LEVEL READ COMMITTED;
SET LOCAL lock_timeout = '5s';

DO $migration$
DECLARE
  target_table oid;
  expected_policy pg_catalog.pg_policy%ROWTYPE;
  other_policies_before jsonb;
  other_policies_after jsonb;
BEGIN
  target_table := pg_catalog.to_regclass('public.coordinadores');
  IF target_table IS NULL THEN
    RAISE EXCEPTION 'REC_F2_COORD_TABLE_MISSING';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class
    WHERE oid = target_table AND relkind = 'r'
  ) THEN
    RAISE EXCEPTION 'REC_F2_COORD_TABLE_KIND_UNEXPECTED';
  END IF;

  -- Serialize policy/table DDL through commit; timeout aborts without changes.
  LOCK TABLE public.coordinadores IN ACCESS EXCLUSIVE MODE;

  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class
    WHERE oid = target_table AND relrowsecurity
  ) THEN
    RAISE EXCEPTION 'REC_F2_COORD_RLS_DISABLED';
  END IF;

  SELECT p.* INTO expected_policy
  FROM pg_catalog.pg_policy AS p
  WHERE p.polrelid = target_table
    AND p.polname = 'coordinadores_insert_publico';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REC_F2_COORD_POLICY_MISSING_OR_ALREADY_APPLIED';
  END IF;

  -- pg_policy command a = INSERT, * = ALL; role OID 0 = PUBLIC.
  IF expected_policy.polcmd IS DISTINCT FROM 'a'
     OR expected_policy.polpermissive IS DISTINCT FROM true
     OR expected_policy.polroles IS DISTINCT FROM ARRAY[0::oid]
     OR expected_policy.polqual IS NOT NULL
     OR pg_catalog.pg_get_expr(expected_policy.polwithcheck, target_table)
        IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'REC_F2_COORD_POLICY_DEFINITION_UNEXPECTED';
  END IF;

  -- Conservative guard: reject every other INSERT/ALL, even restrictive policies.
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy AS p
    WHERE p.polrelid = target_table
      AND p.oid <> expected_policy.oid
      AND p.polcmd IN ('a', '*')
  ) THEN
    RAISE EXCEPTION 'REC_F2_COORD_OTHER_INSERT_POLICY';
  END IF;

  SELECT coalesce(jsonb_agg(to_jsonb(p) ORDER BY p.oid), '[]'::jsonb)
    INTO other_policies_before
  FROM pg_catalog.pg_policy AS p
  WHERE p.polrelid = target_table AND p.oid <> expected_policy.oid;

  DROP POLICY coordinadores_insert_publico ON public.coordinadores;

  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy AS p
    WHERE p.polrelid = target_table
      AND (p.polname = 'coordinadores_insert_publico' OR p.polcmd IN ('a', '*'))
  ) THEN
    RAISE EXCEPTION 'REC_F2_COORD_INSERT_POLICY_REMAINS';
  END IF;

  SELECT coalesce(jsonb_agg(to_jsonb(p) ORDER BY p.oid), '[]'::jsonb)
    INTO other_policies_after
  FROM pg_catalog.pg_policy AS p
  WHERE p.polrelid = target_table;
  IF other_policies_after IS DISTINCT FROM other_policies_before THEN
    RAISE EXCEPTION 'REC_F2_COORD_OTHER_POLICIES_CHANGED';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class
    WHERE oid = target_table AND relrowsecurity
  ) THEN
    RAISE EXCEPTION 'REC_F2_COORD_RLS_POSTCONDITION_FAILED';
  END IF;
END;
$migration$;

COMMIT;
