import type {CoordinationFacade} from '../modules/coordination/application/requests';
import {CoordinationVerificationDecisionAdapter} from '../modules/coordination/infrastructure/leadership-decision-adapter';
import {createDecisionInboxUseCases} from '../modules/leadership/application/decisions';
import type {AssessmentsModerationFacade} from '../modules/assessments/application/moderation';
import {AssessmentsModerationDecisionAdapter} from '../modules/assessments/infrastructure/leadership-decision-adapter';
import {FinanceExceptionDecisionAdapter} from '../modules/finance/infrastructure/leadership-decision-adapter';

export function createDecisionInboxServices(input:{coordination:CoordinationFacade;assessments?:AssessmentsModerationFacade;finance?:ConstructorParameters<typeof FinanceExceptionDecisionAdapter>[0]}){return createDecisionInboxUseCases([new CoordinationVerificationDecisionAdapter(input.coordination),...(input.assessments?[new AssessmentsModerationDecisionAdapter(input.assessments)]:[]),...(input.finance?[new FinanceExceptionDecisionAdapter(input.finance)]:[])]);}
