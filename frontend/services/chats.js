import api from "@/services/api";

export async function getBookingChat(bookingId) {
  const { data } = await api.get(`/chats/${bookingId}`);
  return data.data;
}

export async function sendBookingMessage(bookingId, text) {
  const { data } = await api.post(`/chats/${bookingId}/messages`, { text });
  return data.data;
}
