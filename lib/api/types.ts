export type Role = 'SUPER_ADMIN' | 'LANDLORD' | 'TENANT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string;
  language: string;
  phone: string | null;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface InviteDetails {
  email: string;
  name: string;
  orgName: string;
  expiresAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  organisationName: string;
}

export interface AcceptInviteInput {
  token: string;
  password: string;
}

export interface ApiWrapper<T> {
  data: T;
  success: boolean;
  timestamp: string;
}

export interface Property {
  id: string;
  orgId: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  geocodedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { units: number };
  units?: Unit[];
}

export interface PropertyMapPoint {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  totalUnits: number;
  occupiedUnits: number;
  pinColor: 'green' | 'amber' | 'red';
}

export interface PropertyMapData {
  data: PropertyMapPoint[];
  notGeocodedCount: number;
}

export interface Unit {
  id: string;
  orgId: string;
  propertyId: string;
  unitNumber: string;
  floor: number | null;
  bedrooms: number | null;
  sizeM2: number | null;
  tenantId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: { id: string; name: string; email: string; phone?: string | null; createdAt?: string } | null;
  property?: { id: string; name: string; street?: string; city?: string; postalCode?: string };
}

export interface TenantInvite {
  id: string;
  orgId: string;
  unitId: string;
  email: string;
  name: string;
  token: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type TicketCategory = 'PLUMBING' | 'HEATING' | 'INTERNET' | 'CLEANING' | 'NOISE' | 'ELECTRICITY' | 'OTHER';
export type TicketPriority = 'URGENT' | 'NORMAL' | 'LOW';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'FIXED' | 'CLOSED';
export type EmergencyType = 'WATER_LEAKAGE' | 'HEATING_FAILURE' | 'ELECTRICAL_HAZARD' | 'SECURITY_ISSUE' | 'OTHER';

export interface TicketStatusLog {
  id: string;
  ticketId: string;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus;
  changedBy: string;
  changedAt: string;
}

export interface TicketNote {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  orgId: string;
  unitId: string;
  tenantId: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  title: string;
  description: string;
  photos: string[];
  isEmergency: boolean;
  emergencyType: EmergencyType | null;
  closedAt: string | null;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  tenant?: { id: string; name: string; email: string; phone: string | null };
  unit?: {
    id: string;
    unitNumber: string;
    property?: { id: string; name: string; street: string; city: string };
  };
  statusHistory?: TicketStatusLog[];
  notes?: TicketNote[];
  appointments?: Appointment[];
}

export interface CreateTicketInput {
  unitId: string;
  category: TicketCategory;
  priority: TicketPriority;
  title: string;
  description: string;
  photos: string[];
  isEmergency: boolean;
  emergencyType?: EmergencyType;
}

export interface ListTicketsParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  isEmergency?: boolean;
  propertyId?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'priority' | 'last_activity';
  page?: number;
  limit?: number;
}

export interface LandlordStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  pendingInvites: number;
  openTickets: number;
  inProgressTickets: number;
  emergencyTickets: number;
  recentProperties: Property[];
  recentTickets: Ticket[];
}

export interface AdminStats {
  totalOrgs: number;
  totalUsers: number;
  totalProperties: number;
  totalUnits: number;
}

export interface CreatePropertyInput {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country?: string;
  notes?: string;
}

export interface CreateUnitInput {
  unitNumber: string;
  floor?: number;
  bedrooms?: number;
  sizeM2?: number;
  notes?: string;
}

export interface CreateInviteInput {
  unitId: string;
  email: string;
  name: string;
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  orgId: string;
  ticketId: string;
  createdById: string;
  scheduledAt: string;
  durationMin: number;
  note: string | null;
  status: AppointmentStatus;
  cancelReason: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string };
  ticket: {
    id: string;
    ticketNumber: string;
    title: string;
    priority: TicketPriority;
    tenantId: string;
    unit?: {
      id: string;
      unitNumber: string;
      property?: { id: string; name: string; street: string; city: string };
    };
  };
}

export interface CreateAppointmentInput {
  scheduledAt: string;
  durationMin?: number;
  note?: string;
}

export interface UpdateAppointmentInput {
  scheduledAt?: string;
  durationMin?: number;
  note?: string;
}

export interface CreateAppointmentResponse {
  appointment: Appointment;
  warnings: string[];
}

export interface AppointmentFilters {
  from?: string;
  to?: string;
  status?: AppointmentStatus;
}

export type MessageType = 'USER_MESSAGE' | 'SYSTEM_MESSAGE';

export interface MessageRead {
  userId: string;
  readAt: string;
}

export interface Message {
  id: string;
  orgId: string;
  ticketId: string;
  senderId: string | null;
  type: MessageType;
  content: string;
  photo: string | null;
  systemKey: string | null;
  systemData: Record<string, string> | null;
  createdAt: string;
  sender: { id: string; name: string } | null;
  reads: MessageRead[];
}

export interface SendMessageInput {
  content: string;
  photo?: string;
}

export interface MessagesPage {
  data: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
  byTicket: Record<string, number>;
}

// ── Phase 7 ─────────────────────────────────────────────────────────────────

export interface AdminPlatformStats {
  organisations: number;
  landlords: number;
  tenants: number;
  properties: number;
  units: number;
  tickets: { total: number; open: number; inProgress: number; emergencies: number };
  emailsSentToday: number;
  failedNotifications: number;
}

export interface OrgSummary {
  id: string;
  name: string;
  createdAt: string;
  landlordCount: number;
  tenantCount: number;
  propertyCount: number;
  unitCount: number;
  ticketCount: number;
}

export interface OrgDetail extends OrgSummary {
  updatedAt: string;
  userCount: number;
}

export interface OrgListResponse {
  data: OrgSummary[];
  total: number;
  page: number;
}

export interface OrgUser {
  id: string;
  orgId: string;
  role: Role;
  name: string;
  email: string;
  phone: string | null;
  language: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrgInput {
  orgName: string;
  landlordName: string;
  landlordEmail: string;
  landlordPassword: string;
}

export interface AddLandlordInput {
  name: string;
  email: string;
  password: string;
}

export interface NotificationQueueEntry {
  id: string;
  orgId: string;
  targetUserId: string;
  type: string;
  channels: string[];
  status: string;
  attempts: number;
  scheduledAt: string;
  sentAt: string | null;
  createdAt: string;
}

export interface ProfileUser extends OrgUser {}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  language?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
