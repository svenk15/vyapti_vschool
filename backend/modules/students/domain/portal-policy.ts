export type StudentPortalErrorCode='UNAUTHENTICATED'|'FORBIDDEN'|'NOT_FOUND'|'VALIDATION'|'CONFLICT'|'STALE_VERSION'|'IDEMPOTENCY_CONFLICT'|'INVITATION_INVALID'|'RELEASE_UNAVAILABLE'|'MODULE_NOT_LICENSED'|'MODULE_DISABLED'|'UNAVAILABLE';
export class StudentPortalError extends Error{constructor(readonly code:StudentPortalErrorCode){super(code);this.name='StudentPortalError';}}
export const BASE_STUDENT_PORTAL_PURPOSES=['profile.read_self','attendance.read_self','timetable.read_self'] as const;
export const STUDENT_PORTAL_PURPOSES=[...BASE_STUDENT_PORTAL_PURPOSES,'communication.notice.read_self','calendar.event.read_self','learning.assignment.read_self'] as const;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const requiredUuid=(value:unknown)=>{if(typeof value!=='string'||!uuid.test(value.toLowerCase()))throw new StudentPortalError('VALIDATION');return value.toLowerCase();};
export const normalizedEmail=(value:unknown)=>{if(typeof value!=='string')throw new StudentPortalError('VALIDATION');const email=value.normalize('NFC').trim().toLowerCase();if(email.length<3||email.length>254||!/^\S+@\S+\.\S+$/.test(email))throw new StudentPortalError('VALIDATION');return email;};
export const reason=(value:unknown)=>{if(typeof value!=='string')throw new StudentPortalError('VALIDATION');const text=value.normalize('NFC').trim();if(text.length<8||text.length>500||/[\u0000-\u001f\u007f]/.test(text))throw new StudentPortalError('VALIDATION');return text;};
export const positiveVersion=(value:unknown)=>{if(!Number.isInteger(value)||Number(value)<1)throw new StudentPortalError('VALIDATION');return Number(value);};
