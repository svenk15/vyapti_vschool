import 'server-only';
import {createAcademicServices} from '../../backend/composition/academics';
import type {AcademicSetupFacade} from '../../backend/modules/academics/application/setup';
import {accountGateway,leadershipGateway} from './access';
import type {Identity} from '../../shared/contracts/access';
import {AccessError} from '../../backend/modules/access/contracts';
import {academicRuntimeConfiguration} from './academic-runtime-configuration';
type AcademicServices=ReturnType<typeof createAcademicServices>;
let academics:AcademicServices|undefined,configurationFailure:AccessError|undefined;
try{academics=createAcademicServices(academicRuntimeConfiguration());}catch{configurationFailure=new AccessError('UNAVAILABLE');}
function service(){if(!academics)throw configurationFailure??new AccessError('UNAVAILABLE');return academics;}
async function scope(identity:Identity|null){const home=await accountGateway.getHome(identity);return home.scope;}
export const academicsGateway={
 async workspace(identity:Identity|null){const s=await scope(identity);return service().workspace(identity,s.organizationId,s.schoolId);},
 async createYear(identity:Identity|null,input:Parameters<AcademicSetupFacade['createYear']>[3]){const s=await scope(identity);return service().createYear(identity,s.organizationId,s.schoolId,input);},
 async replaceTerms(identity:Identity|null,yearId:string,input:Parameters<AcademicSetupFacade['replaceTerms']>[4]){const s=await scope(identity);return service().replaceTerms(identity,s.organizationId,s.schoolId,yearId,input);},
 async createGrade(identity:Identity|null,input:Parameters<AcademicSetupFacade['createGrade']>[3]){const s=await scope(identity);return service().createGrade(identity,s.organizationId,s.schoolId,input);},
 async createSubject(identity:Identity|null,input:Parameters<AcademicSetupFacade['createSubject']>[3]){const s=await scope(identity);return service().createSubject(identity,s.organizationId,s.schoolId,input);},
 async createSection(identity:Identity|null,input:Parameters<AcademicSetupFacade['createSection']>[3]){const s=await scope(identity);return service().createSection(identity,s.organizationId,s.schoolId,input);},
 async publishCalendar(identity:Identity|null,calendarId:string,input:Parameters<AcademicSetupFacade['publishCalendar']>[4]){const s=await scope(identity);return service().publishCalendar(identity,s.organizationId,s.schoolId,calendarId,input);},
 async evaluateCalendar(identity:Identity|null,calendarId:string,query:Parameters<AcademicSetupFacade['evaluateCalendar']>[4]){const s=await scope(identity);return service().evaluateCalendar(identity,s.organizationId,s.schoolId,calendarId,query);},
 async transitionYear(identity:Identity|null,yearId:string,input:Parameters<AcademicSetupFacade['transitionYear']>[4]){const s=await scope(identity);return service().transitionYear(identity,s.organizationId,s.schoolId,yearId,input);},
 async retireCatalogItem(identity:Identity|null,type:Parameters<AcademicSetupFacade['retireCatalogItem']>[3],id:string,input:Parameters<AcademicSetupFacade['retireCatalogItem']>[5]){const s=await scope(identity);return service().retireCatalogItem(identity,s.organizationId,s.schoolId,type,id,input);},
 async offerings(identity:Identity|null,yearId:string){const s=await scope(identity);return service().list(identity,s.organizationId,s.schoolId,yearId);},
 async createOffering(identity:Identity|null,input:Parameters<AcademicServices['create']>[3]){const s=await scope(identity);return service().create(identity,s.organizationId,s.schoolId,input);},
 async assignTeacher(identity:Identity|null,input:Parameters<AcademicServices['assign']>[3]){const s=await scope(identity);return service().assign(identity,s.organizationId,s.schoolId,input);},
 async endTeacherAssignment(identity:Identity|null,id:string,input:Parameters<AcademicServices['end']>[4]){const s=await scope(identity);return service().end(identity,s.organizationId,s.schoolId,id,input);},
 async previewTeacherEligibility(identity:Identity|null,employeeId:string,input:Parameters<AcademicServices['preview']>[4]){const s=await scope(identity);return service().preview(identity,s.organizationId,s.schoolId,employeeId,input);},
 async setTeacherEligibility(identity:Identity|null,employeeId:string,input:Parameters<AcademicServices['set']>[4]){const s=await scope(identity);return service().set(identity,s.organizationId,s.schoolId,employeeId,input);},
 async timetablePatternContext(identity:Identity|null,academicYearId:string){const s=await scope(identity);return service().context(identity,s.organizationId,s.schoolId,academicYearId);},
 async saveTimetablePattern(identity:Identity|null,input:Parameters<AcademicServices['save']>[3]){const s=await scope(identity);return service().save(identity,s.organizationId,s.schoolId,input);},
 async timetableDraftContext(identity:Identity|null,academicYearId:string,effectiveFrom:string){const s=await scope(identity);return service().draftContext(identity,s.organizationId,s.schoolId,academicYearId,effectiveFrom);},
 async saveTimetableDraft(identity:Identity|null,input:Parameters<AcademicServices['saveDraft']>[3]){const s=await scope(identity);return service().saveDraft(identity,s.organizationId,s.schoolId,input);},
 async previewTimetableDraft(identity:Identity|null,draftId:string,expectedVersion:number){const s=await scope(identity);return service().previewDraft(identity,s.organizationId,s.schoolId,draftId,expectedVersion);},
 async timetablePublication(identity:Identity|null,id:string){const s=await scope(identity),publication=await service().publication(identity,s.organizationId,s.schoolId,id),reconciliation=await service().reconciliationStatus(identity,s.organizationId,s.schoolId,id);return {...publication,reconciliationState:reconciliation?.state??'PENDING',reconciliation};},
 async reconcileTimetable(identity:Identity|null,input:Parameters<ReturnType<typeof service>['reconcileTimetable']>[3]){const s=await scope(identity);return service().reconcileTimetable(identity,s.organizationId,s.schoolId,input);},
 async publishTimetableDraft(identity:Identity|null,input:Parameters<AcademicServices['publishDraft']>[3]){const s=await scope(identity);return service().publishDraft(identity,s.organizationId,s.schoolId,input);},
 async discardTimetableDraft(identity:Identity|null,input:Parameters<AcademicServices['discardDraft']>[3]){const s=await scope(identity);return service().discardDraft(identity,s.organizationId,s.schoolId,input);},
 async teacherTimetableWeek(identity:Identity|null,weekStart:string){const s=await scope(identity);return service().teacherTimetableWeek(identity,s.organizationId,s.schoolId,weekStart);},
 async teacherClasses(identity:Identity|null,date:string,offeringId?:string){const s=await scope(identity);return service().teacherClasses(identity,s.organizationId,s.schoolId,date,offeringId);},
 async teacherReadiness(identity:Identity|null,date:string){const s=await scope(identity);return service().teacherReadiness(identity,s.organizationId,s.schoolId,date);},
 async timetableCoverContext(identity:Identity|null,occurrenceId:string){const s=await scope(identity);return service().coverContext(identity,s.organizationId,s.schoolId,occurrenceId);},
 async timetableCoverAvailable(identity:Identity|null){const s=await scope(identity);return service().coverAvailable(identity,s.organizationId,s.schoolId);},
 async timetableCoverInbox(identity:Identity|null){const s=await scope(identity);return service().coverInbox(identity,s.organizationId,s.schoolId);},
 async timetableCoverDetail(identity:Identity|null,coverId:string){const s=await scope(identity);return service().coverDetail(identity,s.organizationId,s.schoolId,coverId);},
 async proposeTimetableCover(identity:Identity|null,input:Record<string,unknown>){const s=await scope(identity);return service().proposeCover(identity,s.organizationId,s.schoolId,input);},
 async decideTimetableCover(identity:Identity|null,coverId:string,input:Record<string,unknown>){const s=await scope(identity);return service().decideCover(identity,s.organizationId,s.schoolId,coverId,input);},
 async respondTimetableCover(identity:Identity|null,coverId:string,input:Record<string,unknown>){const s=await scope(identity);return service().respondCover(identity,s.organizationId,s.schoolId,coverId,input);},
 async closeTimetableCover(identity:Identity|null,coverId:string,input:Record<string,unknown>){const s=await scope(identity);return service().closeCover(identity,s.organizationId,s.schoolId,coverId,input);},
};

export const leadershipTimetableGateway={
 async overview(identity:Identity|null,input:{cursor?:unknown;staffingCursor?:unknown;limit?:unknown}={}){const home=await leadershipGateway.getHome(identity);return service().leadershipTimetableOverview(identity,home.scope.organizationId,home.scope.schoolId,input);},
};
