import type {SchoolReadinessItemId,SetupResponsibleRole} from '../../../../shared/contracts/reporting';

/** Display-only Phase 1 responsibility derived from accepted authority. */
const RESPONSIBLE_ROLE_BY_OPERATION:Readonly<Record<SchoolReadinessItemId,SetupResponsibleRole>>={
 school:'SCHOOL_ADMIN',
 academics:'SCHOOL_ADMIN',
 staff:'SCHOOL_ADMIN',
 students:'SCHOOL_ADMIN',
 attendance:'SCHOOL_ADMIN',
};

export function responsibleRoleForSetup(operation:SchoolReadinessItemId):SetupResponsibleRole|null{
 return RESPONSIBLE_ROLE_BY_OPERATION[operation]??null;
}

export function setupResponsibleRoleLabel(role:SetupResponsibleRole|null):string{
 return role==='SCHOOL_ADMIN'?'School administrator':role==='INSTITUTION_ADMIN'?'Institution administrator':role==='ASSIGNED_TEACHER'?'Assigned teacher':'No responsible role defined';
}
