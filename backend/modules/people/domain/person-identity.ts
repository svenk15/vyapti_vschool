import { AccessError, uuidPattern } from "../../access/contracts/index";

function name(value: unknown, required: boolean): string {
  if (typeof value !== "string") throw new AccessError("VALIDATION");
  const normalized = value.normalize("NFC").trim();
  if ((required && !normalized) || normalized.length > 100 || /[\u0000-\u001f\u007f]/.test(normalized)) throw new AccessError("VALIDATION");
  return normalized;
}

export function personIdentityInput(input: { organizationId: unknown; firstName: unknown; lastName?: unknown }) {
  if (typeof input.organizationId !== "string" || !uuidPattern.test(input.organizationId)) throw new AccessError("VALIDATION");
  return { organizationId: input.organizationId.toLowerCase(), firstName: name(input.firstName, true), lastName: name(input.lastName ?? "", false) };
}
