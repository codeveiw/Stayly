import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { searchFlights, type Flight } from "@/lib/flights";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, MapPin, Clock, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/flights/")({
  component: FlightsPage,
});

function FlightsPage() {
  const { t } = useTranslation();
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [searched, setSearched] = useState(false);

  const { data: flights = [], refetch, isLoading } = useQuery({
    queryKey: ['flights', departure, destination, date, passengers],
    queryFn: () => searchFlights({ departure, destination, date, passengers: passengers }),
    enabled: false
  });

  const handleSearch = () => {
    setSearched(true);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("flights.title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find and book the perfect flight for your journey
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <Label htmlFor="departure">From</Label>
                <Input
                  id="departure"
                  placeholder="Departure city"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="destination">To</Label>
                <Input
                  id="destination"
                  placeholder="Destination city"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="passengers">Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  Search Flights
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Flight Results</h2>
            {isLoading ? (
              <div className="text-center py-12">Loading flights...</div>
            ) : flights.length === 0 ? (
              <div className="text-center py-12">No flights found</div>
            ) : (
              <div className="grid gap-6">
                {flights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FlightCard({ flight }: { flight: Flight }) {
  const departureTime = new Date(flight.departure.time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const arrivalTime = new Date(flight.arrival.time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-semibold">{flight.airline}</span>
            </div>
            <span className="text-sm text-muted-foreground">{flight.flightNumber}</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${flight.price}</div>
            <div className="text-sm text-muted-foreground">per person</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-lg font-semibold">{departureTime}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {flight.departure.city} ({flight.departure.airport})
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
              </div>
              <div className="w-16 h-px bg-border my-1"></div>
              <div className="text-xs text-muted-foreground">Direct</div>
            </div>

            <div>
              <div className="text-lg font-semibold">{arrivalTime}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {flight.arrival.city} ({flight.arrival.airport})
              </div>
            </div>
          </div>

          <Button>Book Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}