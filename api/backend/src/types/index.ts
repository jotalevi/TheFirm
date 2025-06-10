export interface User {
  run: string;
  firstNames: string;
  lastNames: string;
  email: string;
  phone: string;
  dirStates?: number;
  dirCounty?: number;
  dirStreet1: string;
  dirStreet2?: string;
  dirStNumber: string;
  dirInNumber?: string;
  notify: boolean;
}

export interface Company {
  id: number;
  companyName: string;
  companyRun: string;
  logoIrid?: string;
  bannerIrid?: string;
  htmlIrid?: string;
  contactRut: string;
  contactName: string;
  contactSurname: string;
  contactEmail: string;
  contactPhone: string;
  contactDirStreet1: string;
  contactDirStreet2?: string;
  contactDirStNumber: string;
  contactDirInNumber?: string;
}

export interface Event {
  id: number;
  slug: string;
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  logoIrid?: string;
  bannerIrid?: string;
  templateIrid?: string;
  cssIrid?: string;
  public: boolean;
  companyId: number;
}

export interface TicketTier {
  id: number;
  tierName: string;
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
  eventId: number;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  usageLimit: number;
  usageCount: number;
  validFrom: string;
  validTo: string;
  eventId?: number;
  active: boolean;
}

export interface TicketOrder {
  id: number;
  userRun: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentReference?: string;
  items: TicketOrderItem[];
}

export interface TicketOrderItem {
  id: number;
  tierId: number;
  tierName: string;
  quantity: number;
  pricePerTicket: number;
  subtotal: number;
}

export interface LoginRequest {
  run: string;
  passwordHash: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest extends User {
  passwordHash: string;
} 