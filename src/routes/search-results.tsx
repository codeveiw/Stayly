import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { HotelCard } from "@/components/HotelCard";

interface SearchParams {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    rooms?: number;
}

export const Route = createFileRoute("/search-results")({
    validateSearch: (search: Record<string, unknown>): SearchParams => ({
        destination: search.destination as string,
        checkIn: search.checkIn as string,
        checkOut: search.checkOut as string,
        adults: search.adults ? Number(search.adults) : undefined,
        children: search.children ? Number(search.children) : undefined,
        rooms: search.rooms ? Number(search.rooms) : undefined,
    }),
    component: SearchResultsPage,
});

function SearchResultsPage() {
    const searchParams = Route.useSearch();
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        async function fetchResults() {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getHotels({ q: searchParams.destination });
                if (active) {
                    setHotels(data);
                }
            } catch (err: any) {
                if (active) {
                    setError(err.message || 'An error occurred while fetching hotels.');
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchResults();

        return () => { active = false; };
    }, [searchParams]);

    return (
        <div className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold">
                    Search Results for "{searchParams.destination}"
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {searchParams.checkIn} to {searchParams.checkOut} • {searchParams.adults} Adults
                </p>
            </div>

            {loading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="flex flex-col gap-3 rounded-xl border border-border p-3 shadow-sm">
                            <div className="h-48 w-full animate-pulse rounded-lg bg-muted/60" />
                            <div className="h-5 w-3/4 animate-pulse rounded bg-muted/60" />
                            <div className="h-4 w-1/2 animate-pulse rounded bg-muted/60" />
                            <div className="mt-2 h-8 w-1/4 animate-pulse rounded bg-muted/60" />
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
                    <p className="font-semibold">Oops! Something went wrong.</p>
                    <p className="mt-1 text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && hotels.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                    No hotels found for your search criteria. Please try adjusting your filters or destination.
                </div>
            )}

            {!loading && !error && hotels.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {hotels.map((h) => (
                        <HotelCard key={h.id} hotel={h} />
                    ))}
                </div>
            )}
        </div>
    );
}
