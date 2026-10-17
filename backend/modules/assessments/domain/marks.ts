import {AssessmentsError,uuid} from './readiness';

const version=(value:unknown)=>{if(!Number.isSafeInteger(value)||Number(value)<0||Number(value)>2_147_483_647)throw new AssessmentsError('VALIDATION');return Number(value);};
export type SaveMarkInput=Readonly<{cycleId:string;planItemId:string;cohortMemberId:string;state:'NUMERIC'|'NOT_ASSESSED'|'ABSENT'|'EXCUSED';scoreScaled:number|null;expectedOutcomeVersion:number;reviewed:true;key:string}>;
export function markInput(value:Record<string,unknown>):SaveMarkInput{
 const state=value.state;if(state!=='NUMERIC'&&state!=='NOT_ASSESSED'&&state!=='ABSENT'&&state!=='EXCUSED')throw new AssessmentsError('VALIDATION');
 const score=state==='NUMERIC'?value.scoreScaled:null;if((state==='NUMERIC'&&!Number.isSafeInteger(score))||(state!=='NUMERIC'&&value.scoreScaled!==null))throw new AssessmentsError('VALIDATION');
 if(value.reviewed!==true)throw new AssessmentsError('VALIDATION');
 return {cycleId:uuid(value.cycleId),planItemId:uuid(value.planItemId),cohortMemberId:uuid(value.cohortMemberId),state,scoreScaled:score as number|null,expectedOutcomeVersion:version(value.expectedOutcomeVersion),reviewed:true,key:uuid(value.key)};
}
