export const ROUTES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  invite: (token: string) => `/invite/${token}`,
  unauthorized: '/unauthorized',
  landlord: {
    dashboard: '/landlord/dashboard',
    properties: '/landlord/properties',
    tickets: '/landlord/tickets',
    calendar: '/landlord/calendar',
    settings: '/landlord/settings',
  },
  tenant: {
    dashboard: '/tenant/dashboard',
    tickets: '/tenant/tickets',
    newTicket: '/tenant/tickets/new',
    profile: '/tenant/profile',
  },
  admin: {
    dashboard: '/admin/dashboard',
    landlords: '/admin/landlords',
  },
} as const;
