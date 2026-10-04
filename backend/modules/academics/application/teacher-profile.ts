import {AccessError,uuidPattern} from '../../access/contracts/index';
import type {TeacherProfilePort} from '../contracts/teacher-profile';
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
export function createTeacherProfileUseCases(port:TeacherProfilePort){return {
 enable(transaction:object,input:{organizationId:unknown;schoolId:unknown;employeeId:unknown;actorAccountId:unknown;occurredAt:unknown}){if(!transaction||typeof transaction!=='object'||typeof input.occurredAt!=='string'||!Number.isFinite(Date.parse(input.occurredAt)))throw new AccessError('VALIDATION');return port.enable(transaction,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),employeeId:id(input.employeeId),actorAccountId:id(input.actorAccountId),occurredAt:input.occurredAt});},
 disable(transaction:object,input:{organizationId:unknown;schoolId:unknown;employeeId:unknown;actorAccountId:unknown;occurredAt:unknown}){if(!transaction||typeof transaction!=='object'||typeof input.occurredAt!=='string'||!Number.isFinite(Date.parse(input.occurredAt)))throw new AccessError('VALIDATION');return port.disable(transaction,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),employeeId:id(input.employeeId),actorAccountId:id(input.actorAccountId),occurredAt:input.occurredAt});}
};}
