interface CustomResponse<T> {
  code: number;
  data?: T;
  msg?: string;
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
    throw new Error(res.msg || "Unknown Error");
  }

  return res.data as T;
}

export function requestWithAuth<T>(url: string, options?: RequestInit) {
  const context = localStorage.getItem("auth");
  if (!context) {
    // TODO: shared biz error
    throw new Error("Auth Context Not Found");
  } else {
    const token = JSON.parse(context)?.state?.token;
    if (!token) {
      // TODO: shared biz error
      throw new Error("Auth Token Invalid");
    } else {
      return request<T>(url, {
        ...(options || {}),
        headers: {
          ...(options || {}).headers,
          Authorization: token
        }
      });
    }
  }
}
