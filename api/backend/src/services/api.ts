import axios from 'axios';
import { 
  User, 
  Company, 
  Event, 
  TicketTier, 
  Coupon, 
  TicketOrder,
  LoginRequest,
  LoginResponse,
  RegisterRequest
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterRequest): Promise<void> => {
  await api.post('/auth/register', userData);
};

// Users
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUser = async (run: string): Promise<User> => {
  const response = await api.get<User>(`/users/${run}`);
  return response.data;
};

export const updateUser = async (run: string, userData: Partial<User>): Promise<User> => {
  const response = await api.put<User>(`/users/${run}`, userData);
  return response.data;
};

// Companies
export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get<Company[]>('/companies');
  return response.data;
};

export const getCompany = async (id: number): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${id}`);
  return response.data;
};

export const createCompany = async (companyData: Omit<Company, 'id'>): Promise<Company> => {
  const response = await api.post<Company>('/companies', companyData);
  return response.data;
};

export const updateCompany = async (id: number, companyData: Partial<Company>): Promise<Company> => {
  const response = await api.put<Company>(`/companies/${id}`, companyData);
  return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/companies/${id}`);
};

// Events
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/events');
  return response.data;
};

export const getEvent = async (id: number): Promise<Event> => {
  const response = await api.get<Event>(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  const response = await api.post<Event>('/events', eventData);
  return response.data;
};

export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<Event> => {
  const response = await api.put<Event>(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};

// Ticket Tiers
export const getTicketTiers = async (eventId: number): Promise<TicketTier[]> => {
  const response = await api.get<TicketTier[]>(`/events/${eventId}/tiers`);
  return response.data;
};

export const getTicketTier = async (id: number): Promise<TicketTier> => {
  const response = await api.get<TicketTier>(`/tiers/${id}`);
  return response.data;
};

export const createTicketTier = async (tierData: Omit<TicketTier, 'id'>): Promise<TicketTier> => {
  const response = await api.post<TicketTier>('/tiers', tierData);
  return response.data;
};

export const updateTicketTier = async (id: number, tierData: Partial<TicketTier>): Promise<TicketTier> => {
  const response = await api.put<TicketTier>(`/tiers/${id}`, tierData);
  return response.data;
};

export const deleteTicketTier = async (id: number): Promise<void> => {
  await api.delete(`/tiers/${id}`);
};

// Coupons
export const getCoupons = async (eventId?: number): Promise<Coupon[]> => {
  const url = eventId ? `/events/${eventId}/coupons` : '/coupons';
  const response = await api.get<Coupon[]>(url);
  return response.data;
};

export const getCoupon = async (id: number): Promise<Coupon> => {
  const response = await api.get<Coupon>(`/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (couponData: Omit<Coupon, 'id'>): Promise<Coupon> => {
  const response = await api.post<Coupon>('/coupons', couponData);
  return response.data;
};

export const updateCoupon = async (id: number, couponData: Partial<Coupon>): Promise<Coupon> => {
  const response = await api.put<Coupon>(`/coupons/${id}`, couponData);
  return response.data;
};

export const deleteCoupon = async (id: number): Promise<void> => {
  await api.delete(`/coupons/${id}`);
};

// Orders
export const getOrders = async (): Promise<TicketOrder[]> => {
  const response = await api.get<TicketOrder[]>('/orders');
  return response.data;
};

export const getUserOrders = async (userRun: string): Promise<TicketOrder[]> => {
  const response = await api.get<TicketOrder[]>(`/users/${userRun}/orders`);
  return response.data;
};

export const getOrder = async (id: number): Promise<TicketOrder> => {
  const response = await api.get<TicketOrder>(`/orders/${id}`);
  return response.data;
}; 