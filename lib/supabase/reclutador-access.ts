/** Server-authoritative snapshot only; never construct from request/localStorage.
 * Runtime validation cannot establish provenance, freshness or DB uniqueness.
 */
export interface ReclutadorAccessSnapshot {
  readonly auth: { readonly userId: string; readonly verified: boolean }
  readonly bindings: readonly { readonly authUserId: string; readonly identityId: string }[]
  readonly identity: { readonly id: string; readonly enabled: boolean }
  readonly session: { readonly authUserId: string; readonly identityId: string; readonly valid: boolean }
  readonly agencyId: string
  readonly permission: string
  readonly memberships: readonly {
    readonly identityId: string
    readonly agencyId: string
    readonly active: boolean
    readonly permissions: readonly { readonly permission: string; readonly active: boolean }[]
  }[]
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.values(Object.getOwnPropertyDescriptors(value)).every(d => 'value' in d)
}

function identifier(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value
}

/** Pure decision for one explicit agency/permission; does not authenticate or refresh.
 * Denies malformed/ambiguous snapshots. No input mutation, I/O or implicit agency.
 */
export function canAccessReclutador(snapshot: ReclutadorAccessSnapshot | null | undefined): boolean {
  try {
    if (!record(snapshot)) return false
    const { auth, bindings, identity, session, agencyId, permission, memberships } = snapshot
    if (!record(auth) || !identifier(auth.userId) || auth.verified !== true ||
        !record(identity) || !identifier(identity.id) || identity.enabled !== true ||
        !record(session) || session.valid !== true ||
        session.authUserId !== auth.userId || session.identityId !== identity.id ||
        !identifier(agencyId) || !identifier(permission) ||
        !Array.isArray(bindings) || bindings.length !== 1 ||
        !Array.isArray(memberships)) return false
    const binding = bindings[0]
    if (!record(binding) || binding.authUserId !== auth.userId ||
        binding.identityId !== identity.id) return false

    const agencies = new Set<string>()
    let allowed = false
    for (const member of memberships) {
      if (!record(member) || member.identityId !== identity.id ||
          !identifier(member.agencyId) || typeof member.active !== 'boolean' ||
          !Array.isArray(member.permissions) || agencies.has(member.agencyId)) return false
      agencies.add(member.agencyId)
      const permissions = new Set<string>()
      let hasPermission = false
      for (const grant of member.permissions) {
        if (!record(grant) || !identifier(grant.permission) ||
            typeof grant.active !== 'boolean' || permissions.has(grant.permission)) return false
        permissions.add(grant.permission)
        if (grant.permission === permission && grant.active) hasPermission = true
      }
      if (member.agencyId === agencyId && member.active && hasPermission) allowed = true
    }
    return allowed
  } catch {
    return false
  }
}
