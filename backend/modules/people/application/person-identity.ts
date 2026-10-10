import { AccessError, uuidPattern } from "../../access/contracts/index";
import type { PersonIdentityPort, PersonIdentityRepository, PersonTransaction } from "../contracts/person-identity";
import { personIdentityInput } from "../domain/person-identity";

export function createPersonIdentityUseCases(repository: PersonIdentityRepository): PersonIdentityPort {
  return {
    create(transaction: PersonTransaction, input: { organizationId: unknown; firstName: unknown; lastName?: unknown }) {
      if (!transaction || typeof transaction !== "object") throw new AccessError("UNAVAILABLE");
      return repository.create(transaction, personIdentityInput(input));
    },
    findById(transaction: PersonTransaction, organizationId: unknown, personId: unknown) {
      if (!transaction || typeof transaction !== "object" || typeof organizationId !== "string" || !uuidPattern.test(organizationId) || typeof personId !== "string" || !uuidPattern.test(personId)) throw new AccessError("VALIDATION");
      return repository.findById(transaction, organizationId.toLowerCase(), personId.toLowerCase());
    },
    correctionContext(transaction,organizationId,personId){
      if(!transaction||typeof transaction!=="object"||typeof organizationId!=="string"||!uuidPattern.test(organizationId)||typeof personId!=="string"||!uuidPattern.test(personId))throw new AccessError("VALIDATION");
      return repository.correctionContext(transaction,organizationId.toLowerCase(),personId.toLowerCase());
    },
    correctName(transaction,input){
      if(!transaction||typeof transaction!=="object")throw new AccessError("UNAVAILABLE");
      for(const value of [input.organizationId,input.schoolId,input.personId,input.actorAccountId])if(typeof value!=="string"||!uuidPattern.test(value))throw new AccessError("VALIDATION");
      if(!Number.isSafeInteger(input.expectedVersion)||Number(input.expectedVersion)<1||typeof input.reason!=="string")throw new AccessError("VALIDATION");
      const reason=input.reason.normalize("NFC").trim();if(reason.length<5||reason.length>500||/[\u0000-\u001f]/.test(reason))throw new AccessError("VALIDATION");
      const person=personIdentityInput({organizationId:input.organizationId,firstName:input.firstName,lastName:input.lastName});
      return repository.correctName(transaction,{...person,schoolId:(input.schoolId as string).toLowerCase(),personId:(input.personId as string).toLowerCase(),actorAccountId:(input.actorAccountId as string).toLowerCase(),expectedVersion:Number(input.expectedVersion),reason});
    },
  };
}
