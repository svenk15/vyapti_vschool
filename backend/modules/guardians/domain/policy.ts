import type {GuardianPurpose} from '../../../../shared/contracts/guardians';
export class GuardianError extends Error{constructor(public readonly code:'UNAUTHENTICATED'|'FORBIDDEN'|'NOT_FOUND'|'VALIDATION'|'CONFLICT'|'STALE_VERSION'|'IDEMPOTENCY_CONFLICT'|'INVITATION_INVALID'|'RELEASE_UNAVAILABLE'|'MODULE_NOT_LICENSED'|'MODULE_DISABLED'|'UNAVAILABLE'){super(code);this.name='GuardianError';}}
// Keep the invitation bundle explicit. New purpose grants must never become
// ambient family authority merely because their contract is added to the
// browser-safe purpose union.
export const FAMILY_PURPOSES:readonly GuardianPurpose[]=[
 'child.summary.read',
 'attendance.read_child',
 'timetable.read_child',
];
export const NOTICE_PURPOSE:GuardianPurpose='communication.notice.read';
export const EXPLANATION_PURPOSE:GuardianPurpose='attendance.explanation.submit';
export const CALENDAR_PURPOSE:GuardianPurpose='calendar.event.read_child';
export const LEARNING_PURPOSE:GuardianPurpose='learning.assignment.read_child';
export const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function normalizedEmail(value:unknown){if(typeof value!=='string')throw new GuardianError('VALIDATION');const email=value.trim().toLowerCase();if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new GuardianError('VALIDATION');return email;}
export function displayName(value:unknown){if(typeof value!=='string')throw new GuardianError('VALIDATION');const name=value.normalize('NFC').trim().replace(/\s+/g,' ');if(name.length<2||name.length>160||/[\u0000-\u001f\u007f]/.test(name))throw new GuardianError('VALIDATION');return name;}
export function requiredUuid(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new GuardianError('VALIDATION');return value.toLowerCase();}
export function reason(value:unknown){if(typeof value!=='string')throw new GuardianError('VALIDATION');const text=value.normalize('NFC').trim();if(text.length<5||text.length>500||/[\u0000-\u001f\u007f]/.test(text))throw new GuardianError('VALIDATION');return text;}
