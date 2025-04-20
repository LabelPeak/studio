import "hono";

declare module "hono" {
  interface ContextVariableMap {
    operatorId: number;
    operatorIsSuperAdmin: boolean;
  }
}
