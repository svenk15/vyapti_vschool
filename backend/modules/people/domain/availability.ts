import {AccessError} from '../../access/contracts/index';
import type {AvailabilitySourceKind,RecordAvailabilityInput} from '../../../../shared/contracts/people-availability';

const sourceKinds=new Set<AvailabilitySourceKind>(['OPERATIONAL','APPROVED_REQUEST','CORRECTION']);
export function availabilityInput(input:RecordAvailabilityInput):RecordAvailabilityInput{
 const startsAt=new Date(input.startsAt),endsAt=new Date(input.endsAt);
 if(!['AVAILABLE','UNAVAILABLE'].includes(input.state)||!sourceKinds.has(input.sourceKind)||!Number.isInteger(input.expectedVersion)||input.expectedVersion<0||!Number.isFinite(startsAt.getTime())||!Number.isFinite(endsAt.getTime())||endsAt<=startsAt||endsAt.getTime()-startsAt.getTime()>31*86400000)throw new AccessError('VALIDATION');
 const timezone=input.timezone.normalize('NFC').trim(),sourceReference=input.sourceReference.normalize('NFC').trim();
 try{new Intl.DateTimeFormat('en',{timeZone:timezone});}catch{throw new AccessError('VALIDATION');}
 if(!timezone||timezone.length>64||sourceReference.length<3||sourceReference.length>120||/[\u0000-\u001f\u007f]/.test(sourceReference))throw new AccessError('VALIDATION');
 return {...input,startsAt:startsAt.toISOString(),endsAt:endsAt.toISOString(),timezone,sourceReference};
}
export function availabilityState(intervals:readonly {state:'AVAILABLE'|'UNAVAILABLE'}[]){return intervals.some(item=>item.state==='UNAVAILABLE')?'UNAVAILABLE':intervals.some(item=>item.state==='AVAILABLE')?'AVAILABLE':'UNKNOWN';}
