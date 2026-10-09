// Google rating shown on the site (homepage, testimonials, services, llms.txt).
// Single source of truth so the numbers never disagree with each other.
//
// With GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID set in the build environment,
// the live rating/count are fetched from the Places API at build time.
// Otherwise (or if the request fails) the fallback below is used — update it
// when the Google review count changes.
const fallback = {
  rating: 4.8,
  count: 94,
};

const url = "https://maps.app.goo.gl/SjzYtgbit8ofnHEW8";

module.exports = async function () {
  const { GOOGLE_PLACES_API_KEY: key, GOOGLE_PLACE_ID: placeId } = process.env;
  if (key && placeId) {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
        {
          headers: {
            "X-Goog-Api-Key": key,
            "X-Goog-FieldMask": "rating,userRatingCount",
          },
          signal: AbortSignal.timeout(10000),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.rating && data.userRatingCount) {
        return { rating: data.rating, count: data.userRatingCount, url };
      }
    } catch (e) {
      console.warn(`[reviews] Places API lookup failed, using fallback: ${e.message}`);
    }
  }
  return { ...fallback, url };
};
