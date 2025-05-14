import { AUTH_TOKEN_KEY } from "@/hooks/use-auth";
import { CLIENT_ERROR_CODE, ClientError } from "@/utils/error";

interface CustomResponse<T> {
  code: number;
  data?: T;
  message?: string;
}

export async function request<T>(url: string, options?: RequestInit) {
  const raw = await fetch(import.meta.env.DEV ? url : import.meta.env.VITE_HOST + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });
  const res = (await raw.json()) as CustomResponse<T>;

  if (res.code !== 200) {
    // TODO: shared biz error
    throw new Error(res.message || "Unknown Error");
  }

  return res.data as T;
}

export function requestWithAuth<T>(url: string, options?: RequestInit) {
  const context = localStorage.getItem(AUTH_TOKEN_KEY) ?? "";
  try {
    const token = JSON.parse(context)?.state?.token;
    if (!token) {
      throw new ClientError("Auth Token Invalid", CLIENT_ERROR_CODE.NO_AUTHORIZATION);
    } else {
      return request<T>(url, {
        ...(options || {}),
        headers: {
          ...(options || {}).headers,
          Authorization: token
        }
      });
    }
  } catch {
    throw new ClientError("Auth Token Invalid", CLIENT_ERROR_CODE.NO_AUTHORIZATION);
  }
}
