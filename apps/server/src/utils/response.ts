export function createResponse<T>(
  data: T,
  message: string = "ok",
  code: number = 200
) {
  return {
    data,
    message,
    code
  }
}