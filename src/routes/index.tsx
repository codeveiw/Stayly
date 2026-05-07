import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import { SearchBar } from "@/components/SearchBar";
import { HotelCard } from "@/components/HotelCard";
import { hotels, destinations } from "@/lib/hotels";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { t } = useTranslation();
  const featured = hotels.filter((h) => h.featured);
  const deals = hotels.filter((h) => h.deal);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[640px] w-full md:h-[680px]">
          <img
            src={heroImg}
            alt="Luxury resort by the sea"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/70" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t("hero.kicker")}
            </span>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            // eslint-disable-next-line prettier/prettier
            <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">{t("hero.subtitle")}</p>
          </div>
        </div>

        {/* search overlapping */}
        <div className="mx-auto -mt-24 max-w-6xl px-4 sm:px-6">
          <SearchBar />
        </div>
      </section>

      {/* FEATURED */}
      <Section
        title={t("sections.featured")}
        subtitle={t("sections.featuredSub")}
        ctaTo="/hotels"
        ctaLabel={t("hotel.viewDetails")}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </Section>

      {/* DESTINATIONS */}
      <Section title={t("sections.destinations")} subtitle={t("sections.destinationsSub")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <DestinationCard key={d.id} dest={d} />
          ))}
        </div>
      </Section>

      {/* DEALS */}
      <Section
        title={t("sections.deals")}
        subtitle={t("sections.dealsSub")}
        ctaTo="/hotels"
        ctaLabel={t("hotel.viewDetails")}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  ctaTo,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  ctaTo?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {ctaTo && (
          <Link
            to={ctaTo}
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function DestinationCard({ dest }: { dest: (typeof destinations)[number] }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    dest.img().then((m) => setSrc(m.default));
  }, [dest]);
  return (
    <Link
      to="/hotels"
      search={{ q: dest.name }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-soft hover-lift"
    >
      {src && (
        <img
          src={src}
          alt={dest.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="font-display text-xl font-bold">{dest.name}</h3>
        <p className="text-sm text-white/85">{dest.country}</p>
      </div>
    </Link>
  );
}
