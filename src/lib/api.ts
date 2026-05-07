const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(userData: { name: string; email: string; password: string }) {
    // Mock registration for now
    const mockUser = {
      id: '1',
      name: userData.name,
      email: userData.email,
      role: 'user'
    };
    return {
      token: 'mock-token',
      user: mockUser
    };
  }

  async login(credentials: { email: string; password: string }) {
    // Mock login for now
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: credentials.email,
      role: 'user'
    };
    return {
      token: 'mock-token',
      user: mockUser
    };
  }

  async getCurrentUser() {
    // Mock current user
    return {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      }
    };
  }

  async updateProfile(userData: { name?: string; phone?: string }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Hotel methods
  async getHotels(params?: {
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    amenities?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/hotels?${queryParams}`);
  }

  async getHotelById(id: string) {
    return this.request(`/hotels/${id}`);
  }

  // Flight methods
  async searchFlights(params: {
    departure?: string;
    destination?: string;
    date?: string;
    returnDate?: string;
    passengers?: number;
    class?: string;
  }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request(`/flights/search?${queryParams}`);
  }

  async getFlightById(id: string) {
    return this.request(`/flights/${id}`);
  }

  // Booking methods
  async getBookings() {
    return this.request('/bookings');
  }

  async createHotelBooking(bookingData: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
  }) {
    return this.request('/bookings/hotel', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async createFlightBooking(bookingData: {
    flightId: string;
    passengers: Array<{ name: string; email: string; phone: string }>;
  }) {
    return this.request('/bookings/flight', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookingById(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async cancelBooking(id: string) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // Payment methods
  async createPaymentIntent(bookingId: string) {
    return this.request('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
  }

  async confirmPayment(paymentIntentId: string) {
    return this.request('/payments/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  }

  async getPayments() {
    return this.request('/payments');
  }

  // Admin methods
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getAdminBookings() {
    return this.request('/admin/bookings');
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request(`/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminHotels() {
    return this.request('/admin/hotels');
  }

  async getAdminFlights() {
    return this.request('/admin/flights');
  }
}

export const api = new ApiClient(API_BASE_URL);