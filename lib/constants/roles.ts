export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  LANDLORD: 'LANDLORD',
  TENANT: 'TENANT',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_DASHBOARD: Record<Role, string> = {
  SUPER_ADMIN: '/admin/dashboard',
  LANDLORD: '/landlord/dashboard',
  TENANT: '/tenant/dashboard',
};
