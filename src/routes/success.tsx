import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Users, MapPin } from "lucide-react";
import { z } from "zod";

const search = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/success")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Booking confirmed — Stayly" },
      { name: "description", content: "Your booking has been confirmed." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { t } = useTranslation();
  const { id } = Route.useSearch();
  const { bookings } = useApp();
  const booking = bookings.find((b) => b.id === id) ?? bookings[0];

  return (
    <div className="mx-auto max-w-2xl animate-fade-in px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{t("successPage.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("successPage.subtitle")}</p>

        {booking && (
          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5 text-start">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
              <span>{t("successPage.ref")}</span>
              <span className="font-mono">{booking.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-semibold">{booking.hotelName}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {booking.checkIn} → {booking.checkOut} ·{" "}
                {t("hotel.nights", { count: booking.nights })}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                {t("search.guest", { count: booking.guests })}
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3 font-display text-lg font-bold">
                <span>{t("checkout.total")}</span>
                <span className="text-primary">${booking.total}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link to="/">{t("successPage.backHome")}</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">{t("successPage.viewDashboard")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
