import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Users, LayoutDashboard, Calendar, Hotel } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({ meta: [{ title: "Admin Portal — Stayly" }] }),
  component: AdminDashboard,
});

type Tab = "overview" | "bookings" | "users" | "hotels";

function AdminDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    // If not logged in, or not admin, redirect.
    if (!user || user.role !== "admin") {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-e border-border bg-card p-4">
        <div className="mb-6 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Admin Portal
        </div>
        <nav className="space-y-1">
          <NavItem active={activeTab === "overview"} icon={<LayoutDashboard />} label="Overview" onClick={() => setActiveTab("overview")} />
          <NavItem active={activeTab === "bookings"} icon={<Calendar />} label="Bookings" onClick={() => setActiveTab("bookings")} />
          <NavItem active={activeTab === "users"} icon={<Users />} label="Users" onClick={() => setActiveTab("users")} />
          <NavItem active={activeTab === "hotels"} icon={<Hotel />} label="Hotels" onClick={() => setActiveTab("hotels")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <div className="mx-auto max-w-5xl animate-fade-in">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "hotels" && <HotelsTab />}
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
    >
      <span className="*:h-4 *:w-4">{icon}</span>
      {label}
    </button>
  );
}

function OverviewTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api.getAdminStats(),
  });

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Platform Overview</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Revenue" value={`$${stats?.totalRevenue || 0}`} />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

function BookingsTab() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => api.getAdminBookings(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => api.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      toast.success("Booking status updated");
    }
  });

  if (isLoading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Manage Bookings</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left text-muted-foreground *:px-4 *:py-3 *:font-medium">
                <th>ID</th>
                <th>Customer</th>
                <th>Hotel</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((b: any) => (
                <tr key={b.id || b._id} className="*:px-4 *:py-3">
                  <td className="font-mono text-xs">{String(b.id || b._id).slice(-6)}</td>
                  <td>{b.user?.name || "Unknown"}</td>
                  <td>{b.hotel?.name || b.hotelName || "Unknown"}</td>
                  <td className="text-muted-foreground whitespace-nowrap">{b.checkIn} - {b.checkOut}</td>
                  <td>
                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${b.status === "confirmed" ? "bg-success/15 text-success" :
                      b.status === "cancelled" ? "bg-destructive/15 text-destructive" :
                        "bg-warning/15 text-warning"
                      }`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === "pending" || b.status === "confirmed" ? (
                      <Button variant="outline" size="sm" onClick={() => updateMutation.mutate({ id: b.id || b._id, status: 'cancelled' })}>
                        Cancel
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && <div className="p-8 text-center text-muted-foreground">No bookings found.</div>}
      </div>
    </div>
  );
}

function UsersTab() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => api.getAdminUsers(),
  });

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Manage Users</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((u: any) => (
          <div key={u.id || u._id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {(u.name?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">{u.name}</h3>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <div className="mt-auto pt-3 flex items-center justify-between border-t border-border mt-3 text-xs">
              <span className="text-muted-foreground">Role: <span className="font-medium text-foreground">{u.role}</span></span>
              <span className="text-muted-foreground">Joined: {new Date(u.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelsTab() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "", country: "", price: "", image: "", description: "" });

  const { data = [], isLoading } = useQuery({
    queryKey: ['adminHotels'],
    queryFn: () => api.getAdminHotels(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHotels'] });
      toast.success("Hotel deleted");
    }
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => api.addHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHotels'] });
      toast.success("Hotel added successfully!");
      setShowAdd(false);
      setFormData({ name: "", city: "", country: "", price: "", image: "", description: "" });
    }
  });

  if (isLoading) return <div>Loading hotels...</div>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl font-bold">Manage Hotels</h2>
        <Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "outline" : "default"}>
          {showAdd ? "Cancel" : "Add Hotel"}
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={(e) => {
          e.preventDefault();
          addMutation.mutate({ ...formData, price: Number(formData.price) });
        }} className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-soft animate-fade-in">
          <h3 className="mb-4 font-display text-lg font-bold">New Hotel Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">Hotel Name
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:border-primary" />
            </label>
            <label className="block text-sm font-medium">Image URL
              <input required value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:border-primary" />
            </label>
            <label className="block text-sm font-medium">City
              <input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:border-primary" />
            </label>
            <label className="block text-sm font-medium">Country
              <input required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:border-primary" />
            </label>
            <label className="block text-sm font-medium">Price per night ($)
              <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:border-primary" />
            </label>
            <label className="block text-sm font-medium">Description
              <input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:border-primary" />
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={addMutation.isPending}>{addMutation.isPending ? "Adding..." : "Save Hotel"}</Button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((h: any) => (
          <div key={h.id || h._id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft relative">
            <img src={h.image} alt={h.name} className="h-32 w-full object-cover transition-transform group-hover:scale-105" />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                if (confirm("Are you sure you want to delete this hotel?")) deleteMutation.mutate(h.id || h._id);
              }}>
              Delete
            </Button>
            <div className="p-4 relative">
              <h3 className="font-semibold">{h.name}</h3>
              <p className="text-xs text-muted-foreground">{h.city || "Unknown City"}, {h.country || "Unknown Country"}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-primary">${h.price} / night</span>
                <span className="text-xs font-medium text-muted-foreground rounded-full border px-2 py-1">
                  ★ {h.rating || "New"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
