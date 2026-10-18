import 'server-only';
import type {Identity} from '../../shared/contracts/access';
import type {AssessmentsNavigationAvailability,LearningNavigationAvailability,TimetableNavigationAvailability} from '../../components/principal-area-navigation';
import {leadershipGateway} from './access';
import {academicsGateway} from './academics';
import {assessmentsGateway} from './assessments';
import {learningGateway} from './learning';
import {moduleGateway} from './tenancy';

async function home(identity:Identity){return leadershipGateway.getHome(identity);}

export const principalNavigationGateway={
 async timetable(identity:Identity):Promise<TimetableNavigationAvailability>{const context=await home(identity);const [timetable,cover]=await Promise.all([context.capabilities.includes('timetable.read_leadership')?moduleGateway.canUseAtScope(identity,context.scope.organizationId,context.scope.schoolId,'timetable','timetable.read_leadership').catch(()=>false):false,academicsGateway.timetableCoverAvailable(identity).catch(()=>false)]);return {timetable,cover};},
 async learning(identity:Identity):Promise<LearningNavigationAvailability>{const context=await home(identity);const [overview,manager]=await Promise.all([context.capabilities.includes('learning.read_leadership')?moduleGateway.canUseAtScope(identity,context.scope.organizationId,context.scope.schoolId,'homework','learning.read_leadership').catch(()=>false):false,learningGateway.managerAvailability(identity).catch(()=>null)]);return {overview,evidence:Boolean(manager?.capabilities.includes('RECIPIENT_STATUS_READ'))};},
 async assessments(identity:Identity):Promise<AssessmentsNavigationAvailability>{const [readiness,publication]=await Promise.all([assessmentsGateway.leadershipReadinessAvailable(identity).catch(()=>false),assessmentsGateway.publicationAvailable(identity).catch(()=>false)]);return {readiness,publication};},
};
