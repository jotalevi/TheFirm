import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces para tipado
interface UserData {
  run: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notify: boolean;
  isAdmin: boolean;
}

interface CompanyData {
  id?: number;
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
  contactDirStates?: number;
  contactDirCounty?: number;
  contactDirStreet1: string;
  contactDirStreet2?: string;
  contactDirStNumber: string;
  contactDirInNumber?: string;
}

interface EventData {
  id?: number;
  name: string;
  companyId: number;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  description: string;
}

interface TicketTierData {
  id?: number;
  eventId: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

// Interceptor para manejar tokens JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios para Autenticación
export const authService = {
  login: async (run: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      run,
      passwordHash: password,
    });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
};

// Servicios para Usuarios
export const userService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get(`/users?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },
  getById: async (run: string) => {
    const response = await apiClient.get(`/users/${run}`);
    return response.data;
  },
  getByCompany: async (companyId: number) => {
    const response = await apiClient.get(`/users/by-company/${companyId}`);
    return response.data;
  },
  create: async (userData: UserData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  update: async (run: string, userData: UserData) => {
    const response = await apiClient.put(`/users/${run}`, userData);
    return response.data;
  },
  delete: async (run: string) => {
    const response = await apiClient.delete(`/users/${run}`);
    return response.data;
  }
};

// Servicios para Empresas
export const companyService = {
  getAll: async () => {
    const response = await apiClient.get('/companies');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/companies/${id}`);
    return response.data;
  },
  create: async (companyData: any) => {
    const response = await apiClient.post('/companies', companyData);
    return response.data;
  },
  update: async (id: number, companyData: any) => {
    const response = await apiClient.put(`/companies/${id}`, companyData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/companies/${id}`);
    return response.data;
  }
};

// Servicios para Eventos
export const eventService = {
  getAll: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },
  getPublic: async () => {
    const response = await apiClient.get('/events/public');
    return response.data;
  },
  getAllForAdmin: async () => {
    const response = await apiClient.get('/events/all');
    return response.data;
  },
  getById: async (slug: string) => {
    const response = await apiClient.get(`/events/${slug}`);
    return response.data;
  },
  create: async (eventData: any) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },
  update: async (slug: string, eventData: any) => {
    const response = await apiClient.put(`/events/${slug}`, eventData);
    return response.data;
  },
  delete: async (slug: string) => {
    const response = await apiClient.delete(`/events/${slug}`);
    return response.data;
  }
};

// Servicios para Tickets
export const ticketService = {
  getTiersByEvent: async (eventSlug: string) => {
    const response = await apiClient.get(`/events/${eventSlug}/tiers`);
    return response.data;
  },
  getTierById: async (eventSlug: string, tierId: number) => {
    const response = await apiClient.get(`/events/${eventSlug}/tiers/${tierId}`);
    return response.data;
  },
  createTier: async (eventSlug: string, tierData: any) => {
    const response = await apiClient.post(`/events/${eventSlug}/tiers`, tierData);
    return response.data;
  },
  updateTier: async (eventSlug: string, tierId: number, tierData: any) => {
    const response = await apiClient.put(`/events/${eventSlug}/tiers/${tierId}`, tierData);
    return response.data;
  },
  deleteTier: async (eventSlug: string, tierId: number) => {
    const response = await apiClient.delete(`/events/${eventSlug}/tiers/${tierId}`);
    return response.data;
  },
  getOrders: async (page = 1, limit = 10, search = '', status = '') => {
    const response = await apiClient.get(`/orders?page=${page}&limit=${limit}&search=${search}&status=${status}`);
    return response.data;
  },
  getOrderById: async (id: number) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }
};

// Servicios para Analytics
export const analyticsService = {
  getStats: async () => {
    const response = await apiClient.get('/analytics/overall');
    return response.data;
  },
  getSalesByMonth: async (year = new Date().getFullYear()) => {
    const response = await apiClient.get(`/analytics/events/1`);
    return response.data;
  },
  getTrafficSources: async () => {
    const response = await apiClient.get('/analytics/companies/1');
    return response.data;
  },
  getPopularEvents: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  }
};

// Servicios para gestión de roles de usuario
export const userRoleService = {
  setUserAdmin: async (userRun: string, isAdmin: boolean) => {
    const response = await apiClient.put(`/users/${userRun}/admin`, isAdmin);
    return response.data;
  },
  addUserToCompanyModeration: async (userRun: string, companyId: number) => {
    const response = await apiClient.post(`/users/${userRun}/moderate-company/${companyId}`);
    return response.data;
  },
  removeUserFromCompanyModeration: async (userRun: string, companyId: number) => {
    const response = await apiClient.delete(`/users/${userRun}/moderate-company/${companyId}`);
    return response.data;
  },
  getUserCompaniesModerated: async (userRun: string) => {
    const response = await apiClient.get(`/users/${userRun}/companies-moderated`);
    return response.data;
  }
};

export default apiClient; 