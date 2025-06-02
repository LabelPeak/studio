import { z } from "zod";

export function convertConstToZodEnum<T extends Readonly<Record<string, string>>>(
  obj: T
): z.ZodEnum<[T[keyof T], ...T[keyof T][]]> {
  const values = Object.values(obj) as [T[keyof T], ...T[keyof T][]];
  return z.enum([values[0], ...values.slice(1)]);
}
