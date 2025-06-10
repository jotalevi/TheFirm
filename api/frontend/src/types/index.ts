// Interfaces para Usuarios
export interface User {
  run: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dirStates?: number;
  dirCounty?: number;
  dirStreet1: string;
  dirStreet2?: string;
  dirStNumber: string;
  dirInNumber?: string;
  notify: boolean;
  isAdmin: boolean;
}

export interface UsersResponse {
  users: User[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

// Interfaces para Empresas
export interface Company {
  id?: number;
  name: string;
  run: string;
  logoIrid?: string;
  bannerIrid?: string;
  htmlIrid?: string;
  contactRut: string;
  contactName: string;
  contactSurname: string;
  contactEmail: string;
  contactPhone: string;
  contactDirStates?: number;
  contactDirCounty?: number;
  contactDirStreet1: string;
  contactDirStreet2?: string;
  contactDirStNumber: string;
  contactDirInNumber?: string;
  events?: Event[];
}

export interface CompaniesResponse {
  companies: Company[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

// Interfaces para Eventos
export interface Event {
  id?: number;
  name: string;
  companyId: number;
  companyName?: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  description: string;
  logoIrid?: string;
  bannerIrid?: string;
  templateIrid?: string;
  cssIrid?: string;
  ticketTiers?: TicketTier[];
}

export interface EventsResponse {
  events: Event[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

// Interfaces para Tickets
export interface TicketTier {
  id?: number;
  eventId: number;
  eventName?: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  basePrice: number;
  entryAllowedFrom?: string;
  entryAllowedTo?: string;
  singleUse: boolean;
  singleDaily: boolean;
  tierPdfTemplateIrid?: string;
  tierMailTemplateIrid?: string;
  stockInitial: number;
  stockCurrent: number;
  stockSold: number;
}

export interface TicketTiersResponse {
  tiers: TicketTier[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

export interface TicketOrderItem {
  id: number;
  orderId: number;
  tierId: number;
  tierName?: string;
  price: number;
  quantity: number;
  tier?: TicketTier;
}

export interface TicketOrder {
  id: number;
  userId: string;
  userName?: string;
  eventId: number;
  eventName?: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentReference?: string;
  items: TicketOrderItem[];
  user?: User;
}

export interface TicketOrdersResponse {
  orders: TicketOrder[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

// Interfaces para Analytics
export interface StatItem {
  title: string;
  value: string;
  change?: number;
}

export interface AnalyticsStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalUsers: number;
  totalCompanies: number;
}

export interface MonthlySales {
  month: string;
  tickets: number;
  revenue: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
}

export interface PopularEvent {
  name: string;
  views: number;
  tickets: number;
  conversion: number;
} 