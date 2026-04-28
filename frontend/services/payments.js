import api from "@/services/api";

export async function createPaymentIntent(bookingId) {
  const { data } = await api.post(`/payments/${bookingId}/intent`);
  return data.data;
}

export async function listPayments() {
  const { data } = await api.get("/payments");
  return data.data;
}
