let googleMapsPromise;

function getGoogleMapsApiKey() {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

export function loadGoogleMapsApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const apiKey = getGoogleMapsApiKey();

      if (!apiKey) {
        reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing"));
        return;
      }

      const existingScript = document.querySelector('script[data-google-maps="road-rescue"]');
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.google));
        existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = "road-rescue";
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Failed to load Google Maps"));
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}

export function getCurrentBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

export async function reverseGeocodeCoordinates(location) {
  const google = await loadGoogleMapsApi();
  const geocoder = new google.maps.Geocoder();

  const response = await geocoder.geocode({
    location: {
      lat: Number(location.latitude),
      lng: Number(location.longitude)
    }
  });

  if (!response.results?.length) {
    throw new Error("No matching address found for these coordinates");
  }

  return {
    address: response.results[0].formatted_address,
    latitude: Number(location.latitude),
    longitude: Number(location.longitude)
  };
}

export async function geocodeAddress(address) {
  const google = await loadGoogleMapsApi();
  const geocoder = new google.maps.Geocoder();
  const response = await geocoder.geocode({ address });

  if (!response.results?.length) {
    throw new Error("Could not resolve that address on Google Maps");
  }

  const match = response.results[0];
  return {
    address: match.formatted_address,
    latitude: match.geometry.location.lat(),
    longitude: match.geometry.location.lng()
  };
}

export async function getRouteMetrics(origin, destination) {
  const google = await loadGoogleMapsApi();
  const directionsService = new google.maps.DirectionsService();

  const response = await directionsService.route({
    origin: {
      lat: Number(origin.latitude),
      lng: Number(origin.longitude)
    },
    destination: {
      lat: Number(destination.latitude),
      lng: Number(destination.longitude)
    },
    travelMode: google.maps.TravelMode.DRIVING
  });

  const leg = response.routes?.[0]?.legs?.[0];

  return {
    directions: response,
    distanceText: leg?.distance?.text || "",
    durationText: leg?.duration?.text || "",
    distanceValueMeters: leg?.distance?.value || 0,
    durationValueSeconds: leg?.duration?.value || 0
  };
}

export function normalizeMechanicLocation(entry) {
  if (!entry) {
    return null;
  }

  if (entry.location?.coordinates?.length === 2) {
    return {
      latitude: Number(entry.location.coordinates[1]),
      longitude: Number(entry.location.coordinates[0]),
      address: entry.locationLabel || "",
      mechanicId: entry._id
    };
  }

  if (entry.mechanic?.location?.coordinates?.length === 2) {
    return {
      latitude: Number(entry.mechanic.location.coordinates[1]),
      longitude: Number(entry.mechanic.location.coordinates[0]),
      address: entry.mechanic.locationLabel || "",
      mechanicId: entry.mechanic._id
    };
  }

  return null;
}
