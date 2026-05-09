import { hotels, type Hotel } from "./hotels";

const API_BASE_URL = 'http://localhost:5000/api';
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.initMockEngine();
  }

  private initMockEngine() {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem('mockUsers')) {
      localStorage.setItem('mockUsers', JSON.stringify([
        { id: "admin-1", name: "System Admin", email: "admin@stayly.com", password: "password", role: "admin", createdAt: new Date().toISOString() },
        { id: "user-1", name: "Test User", email: "user@stayly.com", password: "password", role: "user", createdAt: new Date().toISOString() }
      ]));
    }
    if (!localStorage.getItem('mockBookings')) {
      localStorage.setItem('mockBookings', JSON.stringify([]));
    }
    if (!localStorage.getItem('mockHotels')) {
      localStorage.setItem('mockHotels', JSON.stringify(hotels));
    } else {
      // Migration: Ensure all new default hotels are merged into local storage
      let savedHotels = JSON.parse(localStorage.getItem('mockHotels') || '[]');

      // Clean up previous issues if needed (id '4' was previously removed)
      savedHotels = savedHotels.filter((h: any) => h.id !== '4');

      // Add any new hotel from code that isn't in localStorage yet
      for (const defaultHotel of hotels) {
        const existing = savedHotels.find((h: any) => h.id === defaultHotel.id);
        if (!existing) {
          savedHotels.push(defaultHotel);
        } else {
          // Force fix images if they were broken in localStorage
          existing.image = defaultHotel.image;
          existing.images = defaultHotel.images;
        }
      }

      // Update local storage
      localStorage.setItem('mockHotels', JSON.stringify(savedHotels));
    }
  }

  private getSessionUser() {
    const token = localStorage.getItem('mockToken');
    if (!token) throw new Error('Not authenticated');
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = users.find((u: any) => u.id === token);
    if (!user) throw new Error('Invalid session');
    return user;
  }

  // Auth methods
  async register(userData: { name: string; email: string; password: string }) {
    await delay(600);
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    if (users.find((u: any) => u.email === userData.email)) throw new Error('Email exists');
    const newUser = { id: Date.now().toString(), ...userData, role: "user", createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(users));
    localStorage.setItem('mockToken', newUser.id);
    return { user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, token: newUser.id };
  }

  async login(credentials: { email: string; password: string }) {
    await delay(600);
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
    if (!user) throw new Error('Invalid credentials');
    localStorage.setItem('mockToken', user.id);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: user.id };
  }

  async getCurrentUser() {
    await delay(200);
    const token = localStorage.getItem('token');
    // Fallback if local UI used "token" via real api.ts 
    // Actually the app uses localStorage.getItem('token') heavily!
    // I should sync mockToken with token.
    const user = this.getSessionUser();
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async updateProfile(userData: { name?: string; phone?: string }) {
    await delay(400);
    return { success: true };
  }

  // Hotel methods
  async getHotels(params?: any) {
    await delay(300);
    const hotels = JSON.parse(localStorage.getItem('mockHotels') || '[]');
    let filtered = hotels;
    if (params?.q) {
      const q = params.q.toLowerCase().trim();
      filtered = hotels.filter((h: any) =>
        (h.name && h.name.toLowerCase().includes(q)) ||
        (h.city && h.city.toLowerCase().includes(q)) ||
        (h.country && h.country.toLowerCase().includes(q))
      );
    }
    return filtered;
  }

  async getHotelById(id: string) {
    await delay(200);
    const allHotels = JSON.parse(localStorage.getItem('mockHotels') || '[]');
    const hotel = allHotels.find((h: any) => h.id === id);
    if (!hotel) throw new Error('Not found');
    return { hotel, rooms: [], reviews: [] };
  }

  async addHotel(data: any) {
    await delay(400);
    const all = JSON.parse(localStorage.getItem('mockHotels') || '[]');
    const newHotel = {
      id: crypto.randomUUID(),
      rating: 0,
      reviewsCount: 0,
      amenities: ['wifi', 'parking'],
      images: [data.image],
      ...data,
    };
    // new ones at the beginning so they are easily visible
    all.unshift(newHotel);
    localStorage.setItem('mockHotels', JSON.stringify(all));
    return newHotel;
  }

  async deleteHotel(id: string) {
    await delay(300);
    const all = JSON.parse(localStorage.getItem('mockHotels') || '[]');
    const filtered = all.filter((h: any) => h.id !== id);
    localStorage.setItem('mockHotels', JSON.stringify(filtered));
    return { success: true };
  }

  // Booking methods
  async getBookings() {
    await delay(500);
    try {
      const user = this.getSessionUser();
      const all = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      return all.filter((b: any) => b.userId === user.id);
    } catch { return []; }
  }

  async createHotelBooking(bookingData: any) {
    await delay(800);
    const user = this.getSessionUser();
    const hotel = hotels.find(h => h.id === bookingData.hotelId);
    if (!hotel) throw new Error('Hotel not found');

    const newBooking = {
      id: crypto.randomUUID(),
      userId: user.id,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image || hotel.images[0],
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    const all = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    all.push(newBooking);
    localStorage.setItem('mockBookings', JSON.stringify(all));
    return { booking: newBooking };
  }

  async getBookingById(id: string) {
    await delay(300);
    const all = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const b = all.find((x: any) => x.id === id);
    if (!b) throw new Error('Not found');
    return { booking: b };
  }

  async cancelBooking(id: string) {
    await delay(400);
    const all = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const i = all.findIndex((x: any) => x.id === id);
    if (i !== -1) all[i].status = "cancelled";
    localStorage.setItem('mockBookings', JSON.stringify(all));
    return { success: true };
  }

  // Admin methods
  async getAdminStats() {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const revenue = bookings.reduce((acc: number, b: any) => acc + (b.total || 150), 0);
    return {
      totalUsers: users.length,
      totalBookings: bookings.length,
      totalRevenue: revenue
    };
  }

  async getAdminUsers() {
    await delay(400);
    return JSON.parse(localStorage.getItem('mockUsers') || '[]');
  }

  async getAdminBookings() {
    await delay(400);
    const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    return bookings.map((b: any) => {
      const u = users.find((x: any) => x.id === b.userId);
      return { ...b, user: u };
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateBookingStatus(id: string, status: string) {
    await delay(300);
    const all = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const i = all.findIndex((x: any) => x.id === id);
    if (i !== -1) all[i].status = status;
    localStorage.setItem('mockBookings', JSON.stringify(all));
    return { success: true };
  }

  async getAdminHotels() {
    await delay(400);
    return JSON.parse(localStorage.getItem('mockHotels') || '[]');
  }
}

// Intercept LocalStorage 'token' calls using a small sync. The UI uses localStorage.getItem('token') mostly.
if (typeof window !== "undefined") {
  const originalSet = localStorage.setItem;
  localStorage.setItem = function (key, val) {
    if (key === 'token') localStorage.setItem('mockToken', val);
    originalSet.apply(this, [key, val]);
  };
}

export const api = new ApiClient(API_BASE_URL);