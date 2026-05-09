import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Lock, Loader2, Calendar, Users, MapPin } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Stayly" },
      { name: "description", content: "Complete your booking payment securely." },
    ],
  }),
  component: CheckoutPage,
});

interface FormState {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const initialForm: FormState = { cardName: "", cardNumber: "", expiry: "", cvv: "" };

function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, pendingBooking, setPendingBooking } = useApp();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!pendingBooking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">{t("checkout.noBooking")}</h1>
        <Link to="/hotels" className="mt-4 inline-block text-primary underline">
          {t("checkout.backToHotels")}
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.cardName.trim().length < 2) e.cardName = t("checkout.errors.cardName");
    const digits = form.cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(digits)) e.cardNumber = t("checkout.errors.cardNumber");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) e.expiry = t("checkout.errors.expiry");
    if (!/^\d{3}$/.test(form.cvv)) e.cvv = t("checkout.errors.cvv");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !pendingBooking) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1600));
    // Simulate failure when card ends with 0000
    const digits = form.cardNumber.replace(/\s/g, "");
    if (digits.endsWith("0000")) {
      setProcessing(false);
      toast.error(t("checkout.failed"));
      return;
    }
    try {
      const response = await api.createHotelBooking({
        hotelId: pendingBooking.hotelId,
        roomId: "1", // Default room selection until room selection is built
        checkIn: pendingBooking.checkIn,
        checkOut: pendingBooking.checkOut,
        guests: pendingBooking.guests,
      });

      setPendingBooking(null);
      toast.success(t("checkout.success"));
      navigate({ to: "/success", search: { id: response.booking?.id || (response as any).id || "success" } });
    } catch (error: any) {
      setProcessing(false);
      toast.error(error.message || t("checkout.failed"));
    }
  };

  const update = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{t("checkout.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("checkout.subtitle")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Payment form */}
        <form onSubmit={onPay} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">{t("checkout.payment")}</h2>
          </div>

          <div className="space-y-4">
            <Field
              label={t("checkout.cardName")}
              value={form.cardName}
              onChange={(v) => update("cardName", v)}
              error={errors.cardName}
              placeholder="John Doe"
              autoComplete="cc-name"
            />
            <Field
              label={t("checkout.cardNumber")}
              value={form.cardNumber}
              onChange={(v) => update("cardNumber", formatCard(v))}
              error={errors.cardNumber}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              autoComplete="cc-number"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("checkout.expiry")}
                value={form.expiry}
                onChange={(v) => update("expiry", formatExpiry(v))}
                error={errors.expiry}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
              />
              <Field
                label={t("checkout.cvv")}
                value={form.cvv}
                onChange={(v) => update("cvv", v.replace(/\D/g, "").slice(0, 3))}
                error={errors.cvv}
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
              />
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> {t("checkout.secure")}
          </p>

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("checkout.processing")}
              </>
            ) : (
              <>
                {t("checkout.pay")} · ${pendingBooking.total}
              </>
            )}
          </Button>
        </form>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
            <img
              src={pendingBooking.hotelImage}
              alt={pendingBooking.hotelName}
              className="h-40 w-full object-cover"
            />
            <div className="p-5">
              <h2 className="mb-3 font-display text-lg font-semibold">{t("checkout.summary")}</h2>

              <div className="space-y-3 text-sm">
                <Row icon={<MapPin className="h-4 w-4" />} label={t("checkout.hotel")}>
                  {pendingBooking.hotelName}
                </Row>
                <Row icon={<Calendar className="h-4 w-4" />} label={t("checkout.dates")}>
                  {pendingBooking.checkIn} → {pendingBooking.checkOut}
                </Row>
                <Row icon={<Users className="h-4 w-4" />} label={t("checkout.guests")}>
                  {t("search.guest", { count: pendingBooking.guests })}
                </Row>
                <Row label={t("checkout.nights")}>
                  {t("hotel.nights", { count: pendingBooking.nights })}
                </Row>
              </div>

              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4 font-display text-lg font-bold">
                <span>{t("checkout.total")}</span>
                <span className="text-primary">${pendingBooking.total}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, error, placeholder, inputMode, autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary ${error ? "border-destructive" : "border-input"
          }`}
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Row({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-end font-medium">{children}</span>
    </div>
  );
}
