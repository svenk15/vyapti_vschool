export type SetupState =
  | "not_configured"
  | "unavailable"
  | "schema_missing"
  | "seed_missing"
  | "ready";
export type SetupStatus = {
  state: SetupState;
  ready: boolean;
  label: string;
  message: string;
  nextCommand: string;
};
export function describeReadiness(state: SetupState): SetupStatus {
  const details: Record<SetupState, Omit<SetupStatus, "state" | "ready">> = {
    not_configured: {
      label: "Setup needed",
      message:
        "Create your local database connection with the setup command, then restart the server.",
      nextCommand: "pnpm setup:local",
    },
    unavailable: {
      label: "Not connected",
      message:
        "PostgreSQL could not be reached. Start it, then check the port and connection in your private .env file.",
      nextCommand: "brew services start postgresql@16",
    },
    schema_missing: {
      label: "Connection works",
      message:
        "PostgreSQL is reachable. Create the starter table and its setup marker next.",
      nextCommand: "pnpm db:setup",
    },
    seed_missing: {
      label: "Schema ready",
      message:
        "The starter table exists. Add the setup marker to finish verification.",
      nextCommand: "pnpm db:setup",
    },
    ready: {
      label: "Database connected",
      message:
        "The app read its setup marker from PostgreSQL through Prisma. Your local foundation is ready.",
      nextCommand: "pnpm check",
    },
  };
  return { state, ready: state === "ready", ...details[state] };
}
