/**
 * Role naming has drifted between the database and the applications:
 *
 *   - production `roles` table uses `Agent` (Admin / Manager / Agent)
 *   - the legacy seed scripts create `SalesAgent` / `MarketSalesperson` / `StoreSalesperson`
 *   - the web employee form submits `Agent`
 *
 * Rather than rewriting every existing row, we treat the sales-agent role names
 * as aliases of one another wherever a role is compared or validated.
 */

const ROLE_ALIASES: Record<string, string[]> = {
  agent: ["agent", "salesagent"],
  marketsalesperson: ["marketsalesperson"],
  storesalesperson: ["storesalesperson"],
};

const ALIAS_TO_CANONICAL = new Map<string, string>();
for (const [canonical, aliases] of Object.entries(ROLE_ALIASES)) {
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL.set(alias, canonical);
  }
}

/** Canonical role name for a given role string, e.g. "SalesAgent" -> "agent". */
export function canonicalRole(role: string | null | undefined): string {
  if (!role) return "";
  const key = role.trim().toLowerCase();
  return ALIAS_TO_CANONICAL.get(key) ?? key;
}

/** True when the given role is one of the allowed roles (alias-aware). */
export function roleMatches(role: string | null | undefined, allowed: string[]): boolean {
  const canonical = canonicalRole(role);
  if (!canonical) return false;
  return allowed.some((candidate) => canonicalRole(candidate) === canonical);
}

/** All spellings accepted for a role, for validation messages and API docs. */
export const SALES_AGENT_ROLE_NAMES = ["Agent", "SalesAgent"];

/** True when the role is one of the privileged roles (Admin / Manager). */
export function isPrivileged(role: string | null | undefined): boolean {
  const canonical = canonicalRole(role);
  return canonical === "admin" || canonical === "manager";
}

/** True when the role identifies a sales agent of any kind. */
export function isSalesAgent(role: string | null | undefined): boolean {
  const canonical = canonicalRole(role);
  return (
    canonical === "agent" ||
    canonical === "marketsalesperson" ||
    canonical === "storesalesperson"
  );
}

/**
 * Look up a role row by name, falling back to an alias when the exact name is
 * absent, so callers can use whichever spelling the client sent.
 */
export async function findRoleByName(
  prisma: { role: { findFirst: (args: any) => Promise<any> } },
  name: string
): Promise<{ id: number; name: string } | null> {
  const exact = await prisma.role.findFirst({ where: { name } });
  if (exact) return exact;

  const fallback = name === "Agent" ? "SalesAgent" : "Agent";
  const match = await prisma.role.findFirst({ where: { name: fallback } });
  return match ?? null;
}

