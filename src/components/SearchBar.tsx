import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e: { location?: string; checkIn?: string; checkOut?: string; guests?: string } = {};
    if (!location.trim()) e.location = t("search.errors.location");
    if (!checkIn) e.checkIn = t("search.errors.checkIn");
    if (!checkOut) e.checkOut = t("search.errors.checkOut");
    else if (checkIn && new Date(checkOut) <= new Date(checkIn))
      e.checkOut = t("search.errors.checkOutAfter");
    if (!guests || guests < 1) e.guests = t("search.errors.guests");
    return e;
  }, [location, checkIn, checkOut, guests, t]);

  const isValid = Object.keys(errors).length === 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    navigate({
      to: `/hotels?q=${location.trim()}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&sort=rating`,
    });
    setLoading(false);
  };

  const showErr = (k: keyof typeof errors) => submitted && errors[k];

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`rounded-2xl border border-border bg-card p-3 shadow-elegant md:p-2 ${
        compact ? "" : "animate-slide-up"
      }`}
    >
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_0.8fr_auto] md:gap-2">
        <Field
          icon={<MapPin className="h-4 w-4" />}
          label={t("search.location")}
          error={showErr("location")}
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("search.locationPh")}
            aria-invalid={!!showErr("location")}
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/70"
          />
        </Field>
        <Field
          icon={<Calendar className="h-4 w-4" />}
          label={t("search.checkin")}
          error={showErr("checkIn")}
        >
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm font-medium outline-none"
          />
        </Field>
        <Field
          icon={<Calendar className="h-4 w-4" />}
          label={t("search.checkout")}
          error={showErr("checkOut")}
        >
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm font-medium outline-none"
          />
        </Field>
        <Field
          icon={<Users className="h-4 w-4" />}
          label={t("search.guests")}
          error={showErr("guests")}
        >
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full cursor-pointer bg-transparent text-sm font-medium outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {t("search.guest", { count: n })}
              </option>
            ))}
          </select>
        </Field>
        <Button
          type="submit"
          size="lg"
          className="h-full gap-2"
          disabled={loading || (submitted && !isValid)}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span>{t("search.cta")}</span>
        </Button>
      </div>

      {submitted && !isValid && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-2 text-xs text-destructive">
          {Object.values(errors).map((msg, i) => (
            <span key={i}>• {msg}</span>
          ))}
        </div>
      )}
    </form>
  );
}

function Field({
  icon,
  label,
  children,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  error?: string | false;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2.5 transition-colors focus-within:bg-background ${
        error ? "border-destructive/60" : "border-transparent focus-within:border-primary/40"
      }`}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}
