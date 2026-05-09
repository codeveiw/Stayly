import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState<any[]>([]);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!destination.trim()) {
      setApiSuggestions([]);
      setIsSearchingAPI(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearchingAPI(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            destination
          )}&format=json&addressdetails=1&limit=5`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        setApiSuggestions(data);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      } finally {
        setIsSearchingAPI(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [destination]);

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const errors = useMemo(() => {
    const e: { destination?: string; checkIn?: string; checkOut?: string; guests?: string } = {};
    if (!destination.trim()) e.destination = "Destination is required";
    if (!checkIn) e.checkIn = "Check-in date is required";
    if (!checkOut) e.checkOut = "Check-out date is required";
    else if (checkIn && new Date(checkOut) <= new Date(checkIn))
      e.checkOut = "Check-out must be after check-in";
    if (adults < 1) e.guests = "At least 1 adult is required";
    if (rooms < 1) e.guests = "At least 1 room is required";
    return e;
  }, [destination, checkIn, checkOut, adults, rooms]);

  const isValid = Object.keys(errors).length === 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      Object.values(errors).forEach(err => toast.error(err));
      return;
    }

    setLoading(true);

    const searches = [destination.trim(), ...recentSearches.filter(s => s !== destination.trim())].slice(0, 5);
    setRecentSearches(searches);
    localStorage.setItem("recent_searches", JSON.stringify(searches));

    await new Promise((r) => setTimeout(r, 350));
    navigate({
      to: `/search-results`,
      search: {
        destination: destination.trim(),
        checkIn,
        checkOut,
        adults,
        children,
        rooms
      } as any
    });
    setLoading(false);
  };

  const showErr = (k: keyof typeof errors) => submitted && errors[k];

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`rounded-2xl border border-border bg-card p-3 shadow-elegant md:p-2 ${compact ? "" : "animate-slide-up"
        }`}
    >
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1.2fr_auto] md:gap-2">
        <div className="relative" ref={suggestionsRef}>
          <Field
            icon={<MapPin className="h-4 w-4" />}
            label={"Destination"}
            error={showErr("destination")}
          >
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={"City, region, or hotel"}
              aria-invalid={!!showErr("destination")}
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/70"
            />
          </Field>
          {showSuggestions && (recentSearches.length > 0 || apiSuggestions.length > 0 || isSearchingAPI) && (
            <div className="absolute top-full left-0 z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-md border bg-popover shadow-md">
              {isSearchingAPI && (
                <div className="px-3 py-4 text-xs flex items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching places...
                </div>
              )}
              {!isSearchingAPI && apiSuggestions.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Places match</div>
                  <ul>
                    {apiSuggestions.map((s, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                          onClick={() => {
                            setDestination(s.display_name);
                            setShowSuggestions(false);
                          }}
                        >
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="line-clamp-2">{s.display_name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!isSearchingAPI && apiSuggestions.length === 0 && recentSearches.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Recent Searches</div>
                  <ul>
                    {recentSearches.map((s, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                          onClick={() => {
                            setDestination(s);
                            setShowSuggestions(false);
                          }}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
        <Field
          icon={<Calendar className="h-4 w-4" />}
          label={t("search.checkin", "Check-in")}
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
          label={t("search.checkout", "Check-out")}
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
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="text-left">
              <Field
                as="div"
                icon={<Users className="h-4 w-4" />}
                label={t("search.guests", "Guests")}
                error={showErr("guests")}
              >
                <div className="w-full truncate bg-transparent text-sm font-medium">
                  {adults} Adults, {children} Children, {rooms} Room{rooms > 1 && "s"}
                </div>
              </Field>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Adults</div>
                  <div className="text-xs text-muted-foreground">Age 13+</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setAdults(Math.max(1, adults - 1))} className="h-8 w-8 p-0">-</Button>
                  <span className="w-4 text-center text-sm">{adults}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => setAdults(adults + 1)} className="h-8 w-8 p-0">+</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Children</div>
                  <div className="text-xs text-muted-foreground">Ages 0-12</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setChildren(Math.max(0, children - 1))} className="h-8 w-8 p-0">-</Button>
                  <span className="w-4 text-center text-sm">{children}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => setChildren(children + 1)} className="h-8 w-8 p-0">+</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Rooms</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setRooms(Math.max(1, rooms - 1))} className="h-8 w-8 p-0">-</Button>
                  <span className="w-4 text-center text-sm">{rooms}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => setRooms(rooms + 1)} className="h-8 w-8 p-0">+</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          type="submit"
          size="lg"
          className="h-full gap-2"
          disabled={loading || (submitted && !isValid)}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span>{t("search.cta", "Search")}</span>
        </Button>
      </div>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
  error,
  as: Component = "label",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  error?: string | false;
  as?: React.ElementType;
}) {
  return (
    <Component
      className={`flex h-full w-full items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2.5 transition-colors focus-within:bg-background ${error ? "border-destructive/60" : "border-transparent focus-within:border-primary/40"
        }`}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {children}
      </span>
    </Component>
  );
}
