import { querySetupStatus } from "../modules/platform/application/get-setup-status";
import { PrismaSetupProbe } from "../modules/platform/infrastructure/prisma-setup-probe";

/** Portable wiring: the hosting adapter supplies configuration. */
export function createPlatformServices(config: { databaseUrl: string | undefined }) {
  const probe = new PrismaSetupProbe(config.databaseUrl);
  return { getSetupStatus: () => querySetupStatus(probe) };
}
