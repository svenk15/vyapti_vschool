export type PersonTransaction = object;
export type PersonIdentity = Readonly<{ id: string; firstName: string; lastName: string }>;
export type PersonIdentityInput = Readonly<{ organizationId: string; firstName: string; lastName: string }>;

export interface PersonIdentityPort {
  create(transaction: PersonTransaction, input: { organizationId: unknown; firstName: unknown; lastName?: unknown }): Promise<PersonIdentity>;
  findById(transaction: PersonTransaction, organizationId: unknown, personId: unknown): Promise<PersonIdentity | null>;
  findExactName(transaction: PersonTransaction, organizationId: unknown, exactName: unknown): Promise<readonly PersonIdentity[]>;
}

export interface PersonIdentityRepository {
  create(transaction: PersonTransaction, input: PersonIdentityInput): Promise<PersonIdentity>;
  findById(transaction: PersonTransaction, organizationId: string, personId: string): Promise<PersonIdentity | null>;
  findExactName(transaction: PersonTransaction, organizationId: string, exactName: string): Promise<readonly PersonIdentity[]>;
}
