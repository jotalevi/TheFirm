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
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get(`/companies?page=${page}&limit=${limit}&search=${search}`);
    return {
      items: response.data,
      currentPage: page,
      totalPages: 1,
      totalItems: response.data.length,
      pageSize: limit
    };
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/companies/${id}`);
    return response.data;
  },
  create: async (companyData: CompanyData) => {
    const response = await apiClient.post('/companies', companyData);
    return response.data;
  },
  update: async (id: number, companyData: CompanyData) => {
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
  getAll: async (page = 1, limit = 10, search = '', filter = '') => {
    const response = await apiClient.get(`/events?page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },
  create: async (eventData: EventData) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },
  update: async (id: number, eventData: EventData) => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  }
};

// Servicios para Tickets
export const ticketService = {
  getTiers: async (page = 1, limit = 10, search = '', eventId = '') => {
    const response = await apiClient.get(`/tickets/tiers?page=${page}&limit=${limit}&search=${search}&eventId=${eventId}`);
    return response.data;
  },
  getTierById: async (id: number) => {
    const response = await apiClient.get(`/tickets/tiers/${id}`);
    return response.data;
  },
  createTier: async (tierData: TicketTierData) => {
    const response = await apiClient.post('/tickets/tiers', tierData);
    return response.data;
  },
  updateTier: async (id: number, tierData: TicketTierData) => {
    const response = await apiClient.put(`/tickets/tiers/${id}`, tierData);
    return response.data;
  },
  deleteTier: async (id: number) => {
    const response = await apiClient.delete(`/tickets/tiers/${id}`);
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

export default apiClient; 