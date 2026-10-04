import { AccessError, uuidPattern } from "../../access/contracts/index";

export type StudentInput = Readonly<{ firstName: string; lastName: string; admissionNumber: string; existingPersonId: string | null }>;

function personName(value: unknown, required: boolean): string {
  if (typeof value !== "string") throw new AccessError("VALIDATION");
  const normalized = value.normalize("NFC").trim();
  if ((required && !normalized) || normalized.length > 100 || /[\u0000-\u001f\u007f]/.test(normalized)) throw new AccessError("VALIDATION");
  return normalized;
}

export function studentInput(input: { firstName: unknown; lastName?: unknown; admissionNumber: unknown; existingPersonId?: unknown }): StudentInput {
  const firstName = personName(input.firstName, true), lastName = personName(input.lastName ?? "", false);
  if (typeof input.admissionNumber !== "string") throw new AccessError("VALIDATION");
  const admissionNumber = input.admissionNumber.normalize("NFC").trim();
  if (!admissionNumber || admissionNumber.length > 40 || /[\u0000-\u001f\u007f]/.test(admissionNumber)) throw new AccessError("VALIDATION");
  const existingPersonId = input.existingPersonId == null || input.existingPersonId === "" ? null : input.existingPersonId;
  if (existingPersonId !== null && (typeof existingPersonId !== "string" || !uuidPattern.test(existingPersonId))) throw new AccessError("VALIDATION");
  return { firstName, lastName, admissionNumber, existingPersonId: existingPersonId?.toLowerCase() ?? null };
}

export function studentListQuery(input: { search?: unknown; cursor?: unknown; limit?: unknown; status?: unknown }) {
  if (input.search !== undefined && typeof input.search !== "string") throw new AccessError("VALIDATION");
  const search = typeof input.search === "string" ? input.search.normalize("NFC").trim() : "";
  if (search.length > 100 || /[\u0000-\u001f\u007f]/.test(search)) throw new AccessError("VALIDATION");
  const limit = input.limit === undefined ? 50 : Number(input.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new AccessError("VALIDATION");
  const status = input.status === undefined ? "ACTIVE" : input.status;
  if (status !== "ACTIVE" && status !== "ARCHIVED" && status !== "ALL") throw new AccessError("VALIDATION");
  const checkedStatus = status as "ACTIVE"|"ARCHIVED"|"ALL";
  const cursor = input.cursor == null || input.cursor === "" ? null : input.cursor;
  if (cursor !== null && (typeof cursor !== "string" || cursor.length > 2048)) throw new AccessError("INVALID_CURSOR");
  return { search, cursor: cursor as string | null, limit, status: checkedStatus };
}

export function exactSelectionName(value: unknown): string {
  const name = personName(value, true);
  if (name.length < 2) throw new AccessError("VALIDATION");
  return name;
}

export function displayStudentName(firstName: string, lastName: string): string { return `${firstName} ${lastName}`.trim(); }
