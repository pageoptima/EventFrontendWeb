const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

/**
 * Search for locations using Nominatim (OpenStreetMap).
 * Nominatim usage policy: max 1 req/s, no bulk requests.
 * Debouncing is handled by the consumer hook.
 */
export async function searchLocations(query, signal) {
  const params = new URLSearchParams({
    q: query.trim(),
    format: "json",
    addressdetails: "1",
    limit: "5",
    "accept-language": "en",
  });

  const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) throw new Error("Location search failed");

  return response.json();
}

/**
 * Maps a Nominatim result to the shape expected by POST /locations.
 */
export function nominatimResultToPayload(result) {
  const addr = result.address ?? {};
  return {
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
    name: result.name || result.display_name.split(",")[0].trim() || undefined,
    address: result.display_name || undefined,
    country: addr.country || undefined,
    state: addr.state || addr.region || undefined,
    locality:
      addr.city || addr.town || addr.village || addr.suburb || undefined,
    postal_code: addr.postcode || undefined,
    provider: "nominatim",
    metadata: result,
  };
}

/**
 * Returns a short display label for a Nominatim result.
 */
export function getLocationLabel(result) {
  return result.name || result.display_name.split(",")[0].trim();
}
