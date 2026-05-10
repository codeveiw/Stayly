import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Star, MapPin } from "lucide-react";
import type { Hotel } from "@/lib/hotels";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const discount = hotel.oldPrice
    ? Math.round(((hotel.oldPrice - (hotel.price || 0)) / hotel.oldPrice) * 100)
    : 0;

  return (
    <Link
      to="/hotels/$hotelId"
      params={{ hotelId: hotel.id }}
      className="group block overflow-hidden rounded-2xl bg-card shadow-soft hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hotel.image}
          alt={isAr && hotel.name_ar ? hotel.name_ar : hotel.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {discount > 0 && (
          <span className="absolute start-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow-soft">
            -{discount}%
          </span>
        )}
        <span className="absolute end-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold shadow-soft">
          <Star className="h-3 w-3 fill-accent text-accent" />
          {hotel.rating}
        </span>
      </div>
      <div className="p-4">
        <h3 className="truncate font-display text-lg font-semibold">
          {isAr && hotel.name_ar ? hotel.name_ar : hotel.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {isAr && hotel.city_ar ? hotel.city_ar : hotel.city},{" "}
          {isAr && hotel.country_ar ? hotel.country_ar : hotel.country}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            {hotel.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">${hotel.oldPrice}</span>
            )}
            <p className="font-display text-xl font-bold text-primary">
              ${hotel.price}
              <span className="ms-1 text-xs font-normal text-muted-foreground">
                / {t("hotel.perNight")}
              </span>
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {t("hotel.reviews", { count: hotel.reviewsCount })}
          </span>
        </div>
      </div>
    </Link>
  );
}
