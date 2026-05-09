import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Wifi, Waves, Coffee, Car, Dumbbell, Sparkles, Wine, Snowflake, Calendar, Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/hotels/$hotelId")({
  component: HotelDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center">Hotel not found. <Link to="/hotels" className="text-primary underline">Browse</Link></div>
  ),
});

const AMENITY_ICONS = {
  wifi: Wifi, pool: Waves, breakfast: Coffee, parking: Car,
  gym: Dumbbell, spa: Sparkles, bar: Wine, ac: Snowflake,
} as const;

function HotelDetail() {
  const { hotelId } = Route.useParams();
  const { t } = useTranslation();
  const { user, setPendingBooking } = useApp();
  const navigate = useNavigate();

  const { data: hotelData, isLoading } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => api.getHotelById(hotelId),
  });

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [activeImg, setActiveImg] = useState(0);

  const nights = useMemo(() => {
    const d = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    return Math.max(1, d);
  }, [checkIn, checkOut]);

  if (isLoading) {
    return <div className="p-12 text-center">Loading...</div>;
  }

  if (!hotelData) {
    return <div className="p-12 text-center">Hotel not found. <Link to="/hotels" className="text-primary underline">Browse</Link></div>;
  }

  const { hotel, rooms, reviews = [] } = hotelData;
  const total = nights * (hotel.price || 0);

  const onBook = () => {
    if (!user) {
      toast.info(t("checkout.signInRequired"));
      navigate({ to: "/login" });
      return;
    }
    setPendingBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      checkIn, checkOut, guests, nights, total,
    });
    navigate({ to: "/checkout" });
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link to="/hotels" className="hover:text-foreground">{t("nav.hotels")}</Link>
        <span className="mx-2">/</span>
        <span>{hotel.name}</span>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{hotel.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {hotel.city}, {hotel.country}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
          <Star className="h-4 w-4 fill-accent text-accent" /> {hotel.rating}
          <span className="text-xs font-normal text-muted-foreground">
            ({t("hotel.reviews", { count: hotel.reviewsCount })})
          </span>
        </div>
      </div>

      {/* GALLERY */}
      <div className="grid gap-2 overflow-hidden rounded-2xl md:grid-cols-[2fr_1fr]">
        <img
          src={hotel.images[activeImg]}
          alt={hotel.name}
          className="h-[280px] w-full object-cover sm:h-[460px]"
        />
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
          {hotel.images.slice(0, 4).map((g: string, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImg(i)}
              className={`overflow-hidden rounded-xl ${activeImg === i ? "ring-2 ring-primary" : ""}`}
            >
              <img src={g} alt={`${hotel.name} ${i + 1}`} className="h-28 w-full object-cover transition-transform hover:scale-105 sm:h-full" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <section className="mb-8">
            <h2 className="mb-3 font-display text-xl font-semibold">{t("hotel.description")}</h2>
            <p className="leading-relaxed text-muted-foreground">{hotel.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-display text-xl font-semibold">{t("hotel.amenities")}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {hotel.amenities.map((a: keyof typeof AMENITY_ICONS) => {
                const Icon = AMENITY_ICONS[a];
                return (
                  <div key={a} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{t(`amenities.${a}`)}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">
              {t("hotel.reviews", { count: hotel.reviewsCount })}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r: { author: string; rating: number; text: string }, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold">{r.author}</span>
                    <span className="flex items-center gap-1 text-sm text-accent">
                      <Star className="h-3.5 w-3.5 fill-accent" /> {r.rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* BOOKING */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
            <div className="mb-4 flex items-baseline gap-2">
              {hotel.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">${hotel.oldPrice}</span>
              )}
              <span className="font-display text-3xl font-bold text-primary">${hotel.price}</span>
              <span className="text-sm text-muted-foreground">/ {t("hotel.perNight")}</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <DateField label={t("search.checkin")} value={checkIn} onChange={setCheckIn} />
                <DateField label={t("search.checkout")} value={checkOut} onChange={setCheckOut} min={checkIn} />
              </div>
              <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {t("search.guests")}
                </span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{t("search.guest", { count: n })}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="my-4 space-y-2 border-y border-border py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ${hotel.price} × {t("hotel.nights", { count: nights })}
                </span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between font-display text-lg font-bold">
                <span>{t("hotel.total")}</span>
                <span className="text-primary">${total}</span>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={onBook}>
              {t("hotel.bookNow")}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DateField({
  label, value, onChange, min,
}: { label: string; value: string; onChange: (v: string) => void; min?: string }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" /> {label}
      </span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
