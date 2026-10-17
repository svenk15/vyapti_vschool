import type {CoordinationFacade} from '../modules/coordination/application/requests';
import {CoordinationVerificationDecisionAdapter} from '../modules/coordination/infrastructure/leadership-decision-adapter';
import {createDecisionInboxUseCases} from '../modules/leadership/application/decisions';

export function createDecisionInboxServices(input:{coordination:CoordinationFacade}){return createDecisionInboxUseCases([new CoordinationVerificationDecisionAdapter(input.coordination)]);}
