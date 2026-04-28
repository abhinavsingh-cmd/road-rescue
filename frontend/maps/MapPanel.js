import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { getRouteMetrics } from "@/services/maps";
import { hoverLift, tapReaction } from "@/components/Motion";

function isValidLocation(location) {
  return Boolean(location && Number.isFinite(Number(location.latitude)) && Number.isFinite(Number(location.longitude)));
}

function toLatLngLiteral(location) {
  return {
    lat: Number(location.latitude),
    lng: Number(location.longitude)
  };
}

export default function MapPanel({
  customerLocation,
  mechanicLocation,
  nearbyMechanics = [],
  interactive = false,
  onLocationSelect,
  title = "Verified Service Location",
  subtitle = "Real-time arrival tracking and route guidance",
  heightClass = "min-h-[460px]"
}) {
  const { google, loading, error } = useGoogleMaps();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const clickListenerRef = useRef(null);
  const markersRef = useRef([]);
  const [routeInfo, setRouteInfo] = useState(null);

  const previewMechanic = useMemo(() => {
    if (isValidLocation(mechanicLocation)) return mechanicLocation;
    const firstNearby = nearbyMechanics.find((entry) => isValidLocation(entry.mapLocation) || (entry.location && isValidLocation({ latitude: entry.location.coordinates[1], longitude: entry.location.coordinates[0] })));
    if (!firstNearby) return null;
    return firstNearby.mapLocation || { latitude: firstNearby.location.coordinates[1], longitude: firstNearby.location.coordinates[0] };
  }, [mechanicLocation, nearbyMechanics]);

  const primaryCustomer = isValidLocation(customerLocation) ? customerLocation : null;

  useEffect(() => {
    if (!google || !mapContainerRef.current) return undefined;

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center: primaryCustomer ? toLatLngLiteral(primaryCustomer) : { lat: 12.9716, lng: 77.5946 },
        zoom: primaryCustomer ? 15 : 12,
        styles: [
          { "elementType": "geometry", "stylers": [{ "color": "#050505" }] },
          { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
          { "elementType": "labels.text.stroke", "stylers": [{ "color": "#050505" }] },
          { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
          { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
          { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#0a0a0a" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
          { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#1a1a1a" }] },
          { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#444" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000" }] }
        ],
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: "greedy",
        backgroundColor: "#050505"
      });

      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#faff5d",
          strokeOpacity: 0.8,
          strokeWeight: 6,
          zIndex: 10
        }
      });
      directionsRendererRef.current.setMap(mapRef.current);
    }

    if (clickListenerRef.current) google.maps.event.removeListener(clickListenerRef.current);

    if (interactive && onLocationSelect) {
      clickListenerRef.current = mapRef.current.addListener("click", (event) => {
        onLocationSelect({
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng()
        });
      });
    }

    return () => { if (clickListenerRef.current) google.maps.event.removeListener(clickListenerRef.current); };
  }, [google, interactive, onLocationSelect, primaryCustomer]);

  useEffect(() => {
    if (!google || !mapRef.current) return undefined;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    if (primaryCustomer) {
      const customerMarker = new google.maps.Marker({
        map: mapRef.current,
        position: toLatLngLiteral(primaryCustomer),
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: "#faff5d",
          fillOpacity: 1,
          strokeColor: "#000",
          strokeWeight: 2,
          scale: 1.8,
          anchor: new google.maps.Point(12, 24)
        }
      });
      markersRef.current.push(customerMarker);
      bounds.extend(customerMarker.getPosition());
    }

    nearbyMechanics.forEach((entry) => {
      const loc = entry.mapLocation || (entry.location ? { latitude: entry.location.coordinates[1], longitude: entry.location.coordinates[0] } : null);
      if (!isValidLocation(loc)) return;

      const marker = new google.maps.Marker({
        map: mapRef.current,
        position: toLatLngLiteral(loc),
        icon: {
          path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z",
          fillColor: "#fff",
          fillOpacity: 0.1,
          strokeColor: "#ffffff22",
          strokeWeight: 1,
          scale: 1,
          anchor: new google.maps.Point(12, 12)
        }
      });
      markersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    if (isValidLocation(mechanicLocation)) {
      const mechanicMarker = new google.maps.Marker({
        map: mapRef.current,
        position: toLatLngLiteral(mechanicLocation),
        icon: {
          path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z",
          fillColor: "#faff5d",
          fillOpacity: 1,
          strokeColor: "#000",
          strokeWeight: 2,
          scale: 1.6,
          anchor: new google.maps.Point(12, 12)
        }
      });
      markersRef.current.push(mechanicMarker);
      bounds.extend(mechanicMarker.getPosition());
    }

    if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds, 80);
  }, [google, primaryCustomer, mechanicLocation, nearbyMechanics]);

  useEffect(() => {
    let active = true;
    async function renderRoute() {
      if (!primaryCustomer || !previewMechanic || !directionsRendererRef.current) {
        directionsRendererRef.current?.set("directions", null);
        setRouteInfo(null);
        return;
      }
      try {
        const route = await getRouteMetrics(previewMechanic, primaryCustomer);
        if (!active) return;
        directionsRendererRef.current.setDirections(route.directions);
        setRouteInfo({ distanceText: route.distanceText, durationText: route.durationText });
      } catch (e) {
        if (active) { directionsRendererRef.current?.set("directions", null); setRouteInfo(null); }
      }
    }
    renderRoute();
    return () => { active = false; };
  }, [primaryCustomer, previewMechanic]);

  return (
    <motion.div 
      className="premium-panel overflow-hidden border-white/[0.08] bg-[#080808]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#faff5d]" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Live Mission Intelligence</p>
          </div>
          <h3 className="font-display text-3xl font-bold text-white tracking-tighter">{title}</h3>
        </div>
        
        <AnimatePresence>
          {routeInfo && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-10"
            >
              <div className="space-y-2 border-l border-white/10 pl-8">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Distance</p>
                <p className="text-xl font-black text-white tracking-tighter">{routeInfo.distanceText}</p>
              </div>
              <div className="space-y-2 border-l border-white/10 pl-8">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Estimated Arrival</p>
                <p className="text-xl font-black text-primary tracking-tighter uppercase">{routeInfo.durationText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-10 pb-10">
        <div className="relative rounded-[40px] overflow-hidden border border-white/[0.08] bg-black shadow-2xl">
          {loading ? (
            <div className={`${heightClass} flex flex-col items-center justify-center gap-6 bg-white/[0.02]`}>
              <div className="h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Syncing Satellite Uplink</p>
            </div>
          ) : error ? (
            <div className={`${heightClass} flex items-center justify-center text-[10px] font-black uppercase tracking-[0.4em] text-red-500/40 px-12 text-center`}>
              Maps Core Offline: {error.message}
            </div>
          ) : (
            <div ref={mapContainerRef} className={`${heightClass} w-full grayscale invert contrast-[1.2] opacity-70`} />
          )}
          
          {/* Overlay Vingette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </div>
        
        {interactive && (
          <div className="mt-8 flex items-center justify-center">
             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">Adjust rescue point on map</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
