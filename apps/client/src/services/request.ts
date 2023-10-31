interface CustomResponse<T> {
  code: number;
  data?: T;
  msg?: string;
}

export async function request<T>(
  url: string,
  options?: RequestInit
) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    }
  });
  const data = await res.json() as CustomResponse<T>;
  return data;
}

export function requestWithAuth<T>(
  url: string,
  options?: RequestInit
) {
  const context = localStorage.getItem("auth");
  if (!context) {
    throw new Error("Auth Context Not Found");
  } else {
    const token = JSON.parse(context)?.state?.token;
    if (!token) throw new Error("Auth Token Invalid");
    else return request<T>(url, {
      ...(options || {}),
      headers: {
        ...(options || {})?.headers,
        Authorization: token
      }
    });
  }
}
