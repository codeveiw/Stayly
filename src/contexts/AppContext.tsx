import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import i18n from "@/lib/i18n";
import { api } from "@/lib/api";

export type Lang = "en" | "ar";
export type Theme = "light" | "dark";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export type PendingBooking = Omit<Booking, "id" | "createdAt" | "status">;

interface AppCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  bookings: Booking[];
  addBooking: (b: PendingBooking) => Booking;
  cancelBooking: (id: string) => void;
  pendingBooking: PendingBooking | null;
  setPendingBooking: (b: PendingBooking | null) => void;
}

const Ctx = createContext<AppCtx | null>(null);

const LS = {
  lang: "lang",
  theme: "theme",
  user: "stayly:user",
  users: "stayly:users",
  bookings: "stayly:bookings",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    typeof window !== "undefined" ? ((localStorage.getItem(LS.lang) as Lang) || "en") : "en"
  );
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined" ?((localStorage.getItem(LS.theme) as Theme) || "light") : "light"
  );
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(LS.user);
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(LS.bookings);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  });

  // Apply lang/dir
  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LS.lang, lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(LS.theme, theme);
  }, [theme]);

  // Persist user/bookings
  useEffect(() => {
    if (user) localStorage.setItem(LS.user, JSON.stringify(user));
    else localStorage.removeItem(LS.user);
  }, [user]);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      api.getCurrentUser()
        .then(response => setUser(response.user))
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  const setLang = (l: Lang) => setLangState(l);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const getUsers = (): Array<User & { password: string }> => {
    const raw = localStorage.getItem(LS.users);
    return raw ? JSON.parse(raw) : [];
  };
  const saveUsers = (u: Array<User & { password: string }>) =>
    localStorage.setItem(LS.users, JSON.stringify(u));

  const register: AppCtx["register"] = async (name, email, password) => {
    try {
      const response = await api.register({ name, email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const login: AppCtx["login"] = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const addBooking: AppCtx["addBooking"] = (b) => {
    const booking: Booking = {
      ...b,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const cancelBooking = (id: string) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));

  const value = useMemo<AppCtx>(
    () => ({ lang, setLang, theme, toggleTheme, user, login, register, logout, bookings, addBooking, cancelBooking, pendingBooking, setPendingBooking }),
    [lang, theme, user, bookings, pendingBooking]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
