import api from "@/services/api";

export async function listNotifications() {
  const { data } = await api.get("/notifications");
  return data.data;
}

export async function markNotificationRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data.data;
}
