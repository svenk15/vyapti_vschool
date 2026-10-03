import "server-only";
import { createAccessServices } from "../../backend/composition/access";
import type { Identity } from "../../shared/contracts/access";

export const access = createAccessServices({databaseUrl:process.env.DATABASE_URL??"",cursorSecret:process.env.NEXTAUTH_SECRET});
// Frontend gateway: screens consume DTOs through this host seam.
export const adminGateway = {
 getSettings:access.getSettings,
 listMembers:access.listMembers,
 command:access.command,
 getHome:(identity:Identity|null,schoolId?:string)=>access.getAdminHome(identity,schoolId),
};
