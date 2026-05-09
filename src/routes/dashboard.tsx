import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type Booking } from "@/contexts/AppContext";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My bookings — Stayly" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useTranslation();
  const { user } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => api.getBookings(),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(t("booking.cancelled"));
    },
    onError: () => {
      toast.error(t("Something went wrong"));
    }
  });

  if (!user || isLoading) return null;

  const onCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-in px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
      </header>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-semibold">{t("booking.empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("booking.empties")}</p>
          <Button asChild className="mt-5">
            <Link to="/hotels">{t("nav.hotels")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="grid gap-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft sm:grid-cols-[180px_1fr_auto]"
            >
              <Link to="/hotels/$hotelId" params={{ hotelId: b.hotelId }} className="block">
                <img src={b.hotelImage} alt={b.hotelName} className="h-full max-h-44 w-full object-cover" loading="lazy" />
              </Link>
              <div className="p-4 sm:py-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">{b.hotelName}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${b.status === "confirmed"
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive"
                      }`}
                  >
                    {b.status === "confirmed" ? t("booking.confirmedTag") : t("booking.cancelledTag")}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {b.checkIn} → {b.checkOut}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {t("search.guest", { count: b.guests })}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {t("hotel.nights", { count: b.nights })}</span>
                  <span className="font-semibold text-foreground">{t("hotel.total")}: ${b.total}</span>
                </div>
              </div>
              <div className="flex items-center justify-end p-4 sm:py-5">
                {b.status === "confirmed" && (
                  <Button variant="outline" size="sm" onClick={() => onCancel(b.id)}>
                    {t("booking.cancel")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
