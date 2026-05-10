import { Flight } from "@/lib/flights";

let cachedToken = "";
let tokenExpiration = 0;

/**
 * Fetch OAuth2 token from Amadeus
 */
async function getAmadeusToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiration) {
    return cachedToken;
  }

  const clientId = import.meta.env.VITE_AMADEUS_API_KEY;
  const clientSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

  if (!clientId || !clientSecret) {
    console.error("VITE_AMADEUS_API_KEY or VITE_AMADEUS_API_SECRET is missing.");
    throw new Error("API credentials are not configured.");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Amadeus API.");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Expire 10 seconds early to avoid edge cases
  tokenExpiration = Date.now() + (data.expires_in - 10) * 1000;

  return cachedToken;
}

/**
 * Parses PTnHnM duration string into total minutes
 */
function parseDuration(duration: string): number {
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  return hours * 60 + minutes;
}

/**
 * Search flights using Amadeus Flight Offers API
 */
export async function searchAmadeusFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  adults: number;
}): Promise<Flight[]> {
  try {
    const token = await getAmadeusToken();
    const { origin, destination, departureDate, adults } = params;

    const url = new URL("https://test.api.amadeus.com/v2/shopping/flight-offers");
    url.searchParams.append("originLocationCode", origin);
    url.searchParams.append("destinationLocationCode", destination);
    url.searchParams.append("departureDate", departureDate);
    url.searchParams.append("adults", adults.toString());
    url.searchParams.append("max", "10");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Amadeus API error:", await response.text());
      throw new Error("Failed to load flights from Amadeus API.");
    }

    const json = await response.json();

    const flights: Flight[] = [];

    const airlines = json.dictionaries?.carriers || {};

    for (const offer of json.data || []) {
      if (!offer.itineraries || offer.itineraries.length === 0) continue;

      const itinerary = offer.itineraries[0];
      const segments = itinerary.segments;
      if (!segments || segments.length === 0) continue;

      const firstSeg = segments[0];
      const lastSeg = segments[segments.length - 1];

      const airlineCode = firstSeg.carrierCode;
      const airlineName = airlines[airlineCode] || airlineCode;

      flights.push({
        id: offer.id,
        flightNumber: `${airlineCode}${firstSeg.number}`,
        airline: airlineName,
        departure: {
          airport: firstSeg.departure.iataCode,
          city: firstSeg.departure.iataCode, // Amadeus only gives IATA by default
          country: "Unknown",
          time: firstSeg.departure.at,
        },
        arrival: {
          airport: lastSeg.arrival.iataCode,
          city: lastSeg.arrival.iataCode,
          country: "Unknown",
          time: lastSeg.arrival.at,
        },
        duration: parseDuration(itinerary.duration),
        price: parseFloat(offer.price.total),
        class: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "Economy",
        availableSeats: offer.numberOfBookableSeats,
        totalSeats: offer.numberOfBookableSeats,
        status: "Available",
        aircraft: firstSeg.aircraft?.code || "Unknown",
      });
    }

    return flights;
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
}
