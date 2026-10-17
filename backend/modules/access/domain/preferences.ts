import type {ReducedMotionPreference,TableDensity} from '../../../../shared/contracts/access';
import {AccessError} from './policy';

function version(value:unknown){if(!Number.isInteger(value)||Number(value)<0)throw new AccessError('VALIDATION');return Number(value);}
export function normalizePreferenceUpdate(value:unknown):{density:TableDensity;reducedMotion:ReducedMotionPreference;expectedVersions:{density:number;reducedMotion:number}}{
 if(!value||typeof value!=='object')throw new AccessError('VALIDATION');
 const input=value as Record<string,unknown>,expected=input.expectedVersions;
 if((input.density!=='COMFORTABLE'&&input.density!=='COMPACT')||(input.reducedMotion!=='SYSTEM'&&input.reducedMotion!=='REDUCE')||!expected||typeof expected!=='object')throw new AccessError('VALIDATION');
 const versions=expected as Record<string,unknown>;
 return {density:input.density,reducedMotion:input.reducedMotion,expectedVersions:{density:version(versions.density),reducedMotion:version(versions.reducedMotion)}};
}
