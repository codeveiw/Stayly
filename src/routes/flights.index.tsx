// import { createFileRoute, useNavigate } from "@tanstack/react-router";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { searchAmadeusFlights } from "@/services/flightService";
// import type { Flight } from "@/lib/flights";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plane, MapPin, Clock, Loader2, AlertCircle } from "lucide-react";

// export const Route = createFileRoute("/flights/")({
//   component: FlightsPage,
// });

// function FlightsPage() {
//   const { t } = useTranslation();
//   const [departure, setDeparture] = useState("");
//   const [destination, setDestination] = useState("");
//   const [date, setDate] = useState("");
//   const [passengers, setPassengers] = useState(1);
//   const [searched, setSearched] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [flights, setFlights] = useState<Flight[]>([]);

//   const handleSearch = async () => {
//     if (!departure || !destination || !date) {
//       setError("Please fill in departure, destination, and date.");
//       return;
//     }
//     setSearched(true);
//     setLoading(true);
//     setError(null);
//     setFlights([]);

//     try {
//       const results = await searchAmadeusFlights({
//         origin: departure.toUpperCase(),
//         destination: destination.toUpperCase(),
//         departureDate: date,
//         adults: passengers,
//       });
//       setFlights(results);
//     } catch (err: any) {
//       setError(err.message || "An error occurred while searching for flights.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
//       <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
//             {t("flights.title", "Find Your Perfect Flight")}
//           </h1>
//           <p className="mt-4 text-lg text-muted-foreground">
//             {t("flights.subtitle", "Find and book the perfect flight for your journey")}
//           </p>
//         </div>

//         {/* Search Form */}
//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle>{t("flights.searchFlights", "Search Flights")}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//               <div>
//                 <Label htmlFor="departure">{t("flights.from", "From")}</Label>
//                 <Input
//                   id="departure"
//                   placeholder="IATA Code (e.g. JFK)"
//                   value={departure}
//                   onChange={(e) => setDeparture(e.target.value)}
//                   maxLength={3}
//                   className="uppercase"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="destination">{t("flights.to", "To")}</Label>
//                 <Input
//                   id="destination"
//                   placeholder="IATA Code (e.g. LHR)"
//                   value={destination}
//                   onChange={(e) => setDestination(e.target.value)}
//                   maxLength={3}
//                   className="uppercase"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="date">{t("flights.date", "Date")}</Label>
//                 <Input
//                   id="date"
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="passengers">{t("flights.passengers", "Passengers")}</Label>
//                 <Input
//                   id="passengers"
//                   type="number"
//                   min="1"
//                   max="9"
//                   value={passengers}
//                   onChange={(e) => setPassengers(parseInt(e.target.value))}
//                 />
//               </div>
//               <div className="flex items-end">
//                 <Button onClick={handleSearch} className="w-full" disabled={loading}>
//                   {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("flights.searchFlights", "Search Flights")}
//                 </Button>
//               </div>
//             </div>
//             {error && (
//               <div className="text-destructive text-sm mt-4 flex items-center gap-2">
//                 <AlertCircle className="h-4 w-4" />
//                 {error}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Results */}
//         {searched && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6">{t("flights.flightResults", "Flight Results")}</h2>
//             {loading ? (
//               <div className="text-center py-12 flex flex-col items-center gap-4 text-muted-foreground">
//                 <Loader2 className="h-8 w-8 animate-spin" />
//                 Loading flights...
//               </div>
//             ) : flights.length === 0 && !error ? (
//               <div className="text-center py-12 text-muted-foreground">No flights found</div>
//             ) : (
//               <div className="grid gap-6">
//                 {flights.map((flight) => (
//                   <FlightCard key={flight.id} flight={flight} />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function FlightCard({ flight }: { flight: Flight }) {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const departureTime = new Date(flight.departure.time).toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit'
//   });
//   const arrivalTime = new Date(flight.arrival.time).toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit'
//   });

//   const onBookNow = () => {
//     navigate({
//       to: "/booking/flight/$id",
//       params: { id: flight.id },
//       state: { flight }
//     });
//   };

//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Plane className="h-5 w-5 text-primary" />
//               <span className="font-semibold">{flight.airline}</span>
//             </div>
//             <span className="text-sm text-muted-foreground">{flight.flightNumber}</span>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-primary">${flight.price.toFixed(2)}</div>
//             <div className="text-sm text-muted-foreground">per person</div>
//           </div>
//         </div>

//         <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-8">
//             <div>
//               <div className="text-lg font-semibold">{departureTime}</div>
//               <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                 <MapPin className="h-3 w-3" />
//                 {flight.departure.city} ({flight.departure.airport})
//               </div>
//             </div>

//             <div className="flex flex-col items-center">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Clock className="h-4 w-4" />
//                 {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
//               </div>
//               <div className="w-16 h-px bg-border my-1"></div>
//               <div className="text-xs text-muted-foreground">Direct</div>
//             </div>

//             <div>
//               <div className="text-lg font-semibold">{arrivalTime}</div>
//               <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                 <MapPin className="h-3 w-3" />
//                 {flight.arrival.city} ({flight.arrival.airport})
//               </div>
//             </div>
//           </div>

//           <Button onClick={onBookNow}>{t("flights.bookNow", "Book Now")}</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }