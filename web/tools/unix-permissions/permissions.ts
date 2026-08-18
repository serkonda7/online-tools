/**
 * Pure Unix file-mode conversions. No DOM, no framework — so it is trivially
 * testable and reusable by any other tool that needs to speak chmod.
 *
 * A `Mode` is the low 9 bits: user (<<6), group (<<3), other (<<0).
 */

export const ROLES = ['user', 'group', 'other'] as const;
export const PERMISSIONS = ['read', 'write', 'execute'] as const;

export type Role = (typeof ROLES)[number];
export type Permission = (typeof PERMISSIONS)[number];
export type Mode = number;

export const DEFAULT_MODE: Mode = 0o644;

const ROLE_SHIFT: Record<Role, number> = { user: 6, group: 3, other: 0 };
const PERMISSION_BIT: Record<Permission, number> = { read: 4, write: 2, execute: 1 };
export const PERMISSION_SYMBOL: Record<Permission, string> = {
  read: 'r',
  write: 'w',
  execute: 'x',
};

const OCTAL_PATTERN = /^[0-7]{3}$/;
// An optional leading file-type character, then three rwx triplets.
const SYMBOLIC_PATTERN = /^[-dlbcps]?([r-][w-][x-]){3}$/;

export function bitFor(role: Role, permission: Permission): number {
  return PERMISSION_BIT[permission] << ROLE_SHIFT[role];
}

export function has(mode: Mode, role: Role, permission: Permission): boolean {
  return (mode & bitFor(role, permission)) !== 0;
}

export function withPermission(
  mode: Mode,
  role: Role,
  permission: Permission,
  enabled: boolean,
): Mode {
  const bit = bitFor(role, permission);
  return enabled ? mode | bit : mode & ~bit;
}

export function toOctal(mode: Mode): string {
  return (mode & 0o777).toString(8).padStart(3, '0');
}

export function toSymbolic(mode: Mode): string {
  let out = '-';
  for (const role of ROLES) {
    for (const permission of PERMISSIONS) {
      out += has(mode, role, permission) ? PERMISSION_SYMBOL[permission] : '-';
    }
  }
  return out;
}

/** Returns `null` when the input is not three octal digits. */
export function parseOctal(input: string): Mode | null {
  const value = input.trim();
  return OCTAL_PATTERN.test(value) ? Number.parseInt(value, 8) : null;
}

/** Accepts `rwxr-xr-x` or `-rwxr-xr-x`. Returns `null` when malformed. */
export function parseSymbolic(input: string): Mode | null {
  const value = input.trim();
  if (!SYMBOLIC_PATTERN.test(value)) return null;

  const marks = value.length === 10 ? value.slice(1) : value;
  let mode = 0;
  ROLES.forEach((role, roleIndex) => {
    PERMISSIONS.forEach((permission, permissionIndex) => {
      if (marks[roleIndex * 3 + permissionIndex] !== '-') {
        mode |= bitFor(role, permission);
      }
    });
  });
  return mode;
}
