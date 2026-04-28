import api from "@/services/api";
import { normalizeMechanicLocation } from "@/services/maps";

export async function getMechanicDashboard() {
  const { data } = await api.get("/mechanics/dashboard/summary");
  return data.data;
}

export async function updateMechanicAvailability(isAvailable) {
  const { data } = await api.patch("/mechanics/availability", { isAvailable });
  return data.data;
}

export async function updateMechanicLocation(payload) {
  const { data } = await api.patch("/mechanics/location", payload);
  return data.data;
}

export async function searchNearbyMechanics({ latitude, longitude, radiusKm = 15, limit = 8 }) {
  const { data } = await api.get("/mechanics", {
    params: {
      latitude,
      longitude,
      radiusKm,
      limit
    }
  });

  return (data.data || []).map((entry) => ({
    ...entry,
    mapLocation: normalizeMechanicLocation(entry)
  }));
}
