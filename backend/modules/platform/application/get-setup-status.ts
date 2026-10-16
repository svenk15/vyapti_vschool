import { describeReadiness, type SetupState } from "../domain/readiness";
export interface SetupProbe {
  inspect(): Promise<SetupState>;
}
export async function querySetupStatus(probe: SetupProbe) {
  try {
    return describeReadiness(await probe.inspect());
  } catch {
    return describeReadiness("unavailable");
  }
}
