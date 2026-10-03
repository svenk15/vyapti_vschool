import "server-only";
import { createAccessServices } from "../../backend/composition/access";
import type { Identity } from "../../shared/contracts/access";

export const access = createAccessServices({databaseUrl:process.env.DATABASE_URL??""});
// Frontend gateway: screens consume DTOs through this host seam.
export const adminGateway = {
 getHome:(identity:Identity|null,schoolId?:string)=>access.getAdminHome(identity,schoolId),
};
