interface CustomResponse<T> {
  statusCode: number;
  data?: T;
  message?: string;
}

export async function request<T>(
  url: string,
  options?: RequestInit
) {
  const res = await fetch(url, options);
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
        Authorization: `Bearer ${token}`
      }
    });
  }
}
