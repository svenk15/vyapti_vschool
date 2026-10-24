import type {AttendanceReviewQuery} from '../../../../shared/contracts/attendance-review';
import {AccessError} from '../../access/contracts/index';
export function reviewQuery(input:Partial<AttendanceReviewQuery>={}):AttendanceReviewQuery{
 const view=input.view??'pending',offset=input.offset??0,limit=input.limit??25;
 if(!['pending','all'].includes(view)||!Number.isSafeInteger(offset)||offset<0||offset>1000000||!Number.isInteger(limit)||limit<1||limit>100)throw new AccessError('VALIDATION');
 return {view,offset,limit};
}
