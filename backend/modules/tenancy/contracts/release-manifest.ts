import type {ModuleId} from '../../../../shared/contracts/modules';

/** Host-supplied release availability; business modules consume this read-only contract. */
export type ReleaseManifest=Readonly<Record<ModuleId,boolean>>;
