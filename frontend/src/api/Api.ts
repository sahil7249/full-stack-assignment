import {
  type User,
  type Store,
  type Rating,
  type AdminStats,
} from "../types/types";

const BASE_URL = "http://localhost:8080/api";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });

  const json = await res.json().catch(() => ({ message: "request failed" }));

  if (!res.ok) {
    throw new Error(json.message);
  }

  return (json as ApiResponse<T>).data;
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
  stores: {
    getAll: (params?: { name?: string; address?: string }) => {
      const queryParams: Record<string, string> = {};
      if (params?.name) queryParams.name = params.name;
      if (params?.address) queryParams.address = params.address;
      const qs = new URLSearchParams(params as any).toString();
      return request<Store & { userRating?: number }[]>(
        `/stores${qs ? `?${qs}` : ""}`,
      );
    },
    getById: (id: string) => request<Store>(`/stores/${id}`),
  },
  admin : {
    getStats : () => request<AdminStats>('/admin/stats'),
    getUsers : (params?: { name?:string; email?:string; address?:string; role?:string}) => {
      const qs = new URLSearchParams(params as any).toString()
      return request<User[]>(`/admin/users${qs ? `?${qs}` : ''}`);
    },
    createUser: (data : Omit<User ,'id'> & { password : string }) => 
      request<User>('/admin/users/new',{ method:'POST' ,body: JSON.stringify(data)}),
    getUserById: (id : string) => request<User>(`/admin/users/${id}`),
    getStores : (params?: { name?: string; email?:string; address?: string}) => {
      const qs = new URLSearchParams(params as any).toString()
      return request<User[]>(`/admin/stores${qs ? `?${qs}` : ''}`);
    },
    createStore : (data: Omit<Store,'id' | 'averageRating' | 'totalRatings'>) => 
      request<Store>('/admin/stores',{ method:'POST',body:JSON.stringify(data) })
  },
  ratings: {
    submit: (storeId: string, value: number) =>
      request<Rating>('/ratings', { method: 'POST', body: JSON.stringify({ storeId, value }) }),
    update: (ratingId: string, value: number) =>
      request<Rating>(`/ratings/${ratingId}`, { method: 'PATCH', body: JSON.stringify({ value }) }),
  },
  owner: {
    getDashboard: () =>
      request<{ store: Store; ratings: (Rating & { user: Pick<User, 'id' | 'name' | 'email'> })[] }>('/owner/dashboard'),
  },
};
