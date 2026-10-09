import { AccessError, uuidPattern } from "../../access/contracts/index";
import type { PersonIdentityPort, PersonIdentityRepository, PersonTransaction } from "../contracts/person-identity";
import { exactPersonName, personIdentityInput } from "../domain/person-identity";

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
    findExactName(transaction: PersonTransaction, organizationId: unknown, value: unknown) {
      if (!transaction || typeof transaction !== "object" || typeof organizationId !== "string" || !uuidPattern.test(organizationId)) throw new AccessError("VALIDATION");
      return repository.findExactName(transaction, organizationId.toLowerCase(), exactPersonName(value));
    },
  };
}
