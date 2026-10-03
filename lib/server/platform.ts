import "server-only";
import { createPlatformServices } from "../../backend/composition/platform";

// Next.js adapter only. NestJS can call the same factory with its ConfigService.
const platform = createPlatformServices({ databaseUrl: process.env.DATABASE_URL });
export const getSetupStatus = platform.getSetupStatus;
