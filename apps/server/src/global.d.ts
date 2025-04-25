import "hono";

declare module "hono" {
  interface ContextVariableMap {
    authPayload: {
      operatorId: number;
      operatorIsSuperAdmin: boolean;
    };
  }
}
