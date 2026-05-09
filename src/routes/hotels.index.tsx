import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type AmenityKey, type Hotel } from "@/lib/hotels";
import { api } from "@/lib/api";
import { HotelCard } from "@/components/HotelCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface Search {
  q?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  sort?: "priceAsc" | "priceDesc" | "rating";
}

export const Route = createFileRoute("/hotels/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: (s.q as string) || "",
    checkIn: (s.checkIn as string) || undefined,
    checkOut: (s.checkOut as string) || undefined,
    guests: s.guests ? Number(s.guests) : undefined,
    sort: (s.sort as Search["sort"]) || "rating",
  }),
  component: HotelsList,
});

const ALL_AMENITIES: AmenityKey[] = ["wifi", "pool", "breakfast", "parking", "gym", "spa", "bar", "ac"];

function HotelsList() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [priceRange, setPriceRange] = useState<[number, number]>([50, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [selected, setSelected] = useState<AmenityKey[]>([]);
  const [openMobile, setOpenMobile] = useState(false);

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['hotels', search.q],
    queryFn: () => api.getHotels({ q: search.q })
  });

  const filtered = useMemo(() => {
    let list = hotels.filter((h: Hotel) => {
      if (h.rating < minRating) return false;
      const p = h.price || 0;
      if (p < priceRange[0] || p > priceRange[1]) return false;
      if (selected.length && !selected.every((a) => h.amenities.includes(a))) return false;
      return true;
    });
    if (search.sort === "priceAsc") list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (search.sort === "priceDesc") list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    else list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [hotels, search.sort, minRating, selected]);

  const toggleAmenity = (a: AmenityKey) =>
    setSelected((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const clearAll = () => {
    setPriceRange([50, 1000]);
    setMinRating(0);
    setSelected([]);
  };

  const FiltersPanel = (
    <aside className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{t("filters.title")}</h3>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          {t("filters.clear")}
        </Button>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold">{t("filters.priceRange")}</Label>
        <Slider
          value={priceRange}
          min={50}
          max={1000}
          step={10}
          onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold">{t("filters.rating")}</Label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${minRating === r
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-muted"
                }`}
            >
              <Star className="h-3 w-3" /> {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold">{t("filters.amenities")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {ALL_AMENITIES.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selected.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
              <span>{t(`amenities.${a}`)}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {search.q ? `"${search.q}"` : t("nav.hotels")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("filters.results", { count: filtered.length })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 lg:hidden"
            onClick={() => setOpenMobile((o) => !o)}
          >
            <SlidersHorizontal className="h-4 w-4" /> {t("filters.title")}
          </Button>
          <Select
            value={search.sort}
            onValueChange={(v) =>
              navigate({ search: (prev: Search) => ({ ...prev, sort: v as Search["sort"] }) })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("filters.sort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">{t("filters.sortRating")}</SelectItem>
              <SelectItem value="priceAsc">{t("filters.sortPriceAsc")}</SelectItem>
              <SelectItem value="priceDesc">{t("filters.sortPriceDesc")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className={`${openMobile ? "block" : "hidden"} lg:block`}>{FiltersPanel}</div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((h: Hotel) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {t("search.noResults")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
