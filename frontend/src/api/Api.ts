import {
  type User,
  type Store,
  type Rating,
  type AdminStats,
} from "../types/types";

const BASE_URL = "http://localhost:8080/api";

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Autherization: `Bearer ${token}` } : {}),
  };
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request Failed " }));
    throw new Error(err.meesage || "Request failed");
  }

  return res.json();
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: {
      name: string;
      email: string;
      password: string;
      address: string;
    }) =>
      request<{ token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
      request<{ message: string }>("/auth/password", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
};
