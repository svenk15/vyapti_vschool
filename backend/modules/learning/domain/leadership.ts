import {AccessError,uuidPattern} from '../../access/contracts/index';

export type LeadershipLearningInput={fromDate:string|null;toDate:string|null;classId:string|null;subjectId:string|null;cursor:string|null;limit:number};
export type LeadershipFeedbackTurnaroundInput={fromDate:string|null;toDate:string|null;classId:string|null;subjectId:string|null};
const day=/^\d{4}-\d{2}-\d{2}$/;
function optionalText(value:unknown,max:number){if(value===undefined||value===null||value==='')return null;if(typeof value!=='string'){throw new AccessError('VALIDATION');}const result=value.normalize('NFC').trim();if(!result||result.length>max)throw new AccessError('VALIDATION');return result;}
function date(value:unknown){const result=optionalText(value,10);if(result&&!day.test(result))throw new AccessError('VALIDATION');if(result&&new Date(`${result}T00:00:00.000Z`).toISOString().slice(0,10)!==result)throw new AccessError('VALIDATION');return result;}
function id(value:unknown){const result=optionalText(value,36);if(result&&!uuidPattern.test(result))throw new AccessError('VALIDATION');return result?.toLowerCase()??null;}

export function leadershipLearningInput(value:unknown):LeadershipLearningInput{
 const source=value&&typeof value==='object'?value as Record<string,unknown>:{};
 const fromDate=date(source.fromDate),toDate=date(source.toDate);
 if(Boolean(fromDate)!==Boolean(toDate))throw new AccessError('VALIDATION');
 if(fromDate&&toDate){const days=(Date.parse(`${toDate}T00:00:00.000Z`)-Date.parse(`${fromDate}T00:00:00.000Z`))/86400_000;if(days<1||days>93)throw new AccessError('VALIDATION');}
 const rawLimit=source.limit===undefined?20:Number(source.limit);if(!Number.isInteger(rawLimit)||rawLimit<1||rawLimit>50)throw new AccessError('VALIDATION');
 return {fromDate,toDate,classId:id(source.classId),subjectId:id(source.subjectId),cursor:optionalText(source.cursor,2048),limit:rawLimit};
}

export function leadershipFeedbackTurnaroundInput(value:unknown):LeadershipFeedbackTurnaroundInput{
 const parsed=leadershipLearningInput(value);
 return {fromDate:parsed.fromDate,toDate:parsed.toDate,classId:parsed.classId,subjectId:parsed.subjectId};
}
