import api from "@/services/api";

export async function signupCustomer(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data.data;
}

export async function loginCustomer(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
}

export async function signupMechanic(payload) {
  const { data } = await api.post("/mechanics/signup", payload);
  return data.data;
}

export async function loginMechanic(payload) {
  const { data } = await api.post("/mechanics/login", payload);
  return data.data;
}

export async function fetchProfile() {
  const { data } = await api.get("/auth/me");
  return data.data;
}

export async function updateProfile(payload) {
  const { data } = await api.patch("/auth/me", payload);
  return data.data;
}
