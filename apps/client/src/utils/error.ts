export const CLIENT_ERROR_CODE = {
  UNKNOWN: "UNKNOWN",
  NO_AUTHORIZATION: "NO_AUTHORIZATION"
} as const;

export class ClientError extends Error {
  code: keyof typeof CLIENT_ERROR_CODE;

  constructor(message: string, code?: keyof typeof CLIENT_ERROR_CODE) {
    super(message);
    this.name = "ClientError";
    this.code = code ?? "UNKNOWN";
  }
}
