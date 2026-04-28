import api from "@/services/api";

export async function createReview(payload) {
  const { data } = await api.post("/reviews", payload);
  return data.data;
}
