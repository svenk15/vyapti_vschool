export type PersonTransaction = object;
export type PersonIdentity = Readonly<{ id: string; firstName: string; lastName: string; version: number }>;
export type PersonIdentityInput = Readonly<{ organizationId: string; firstName: string; lastName: string }>;
export type PersonNameRevision = Readonly<{ id:string;version:number;previousFirstName:string;previousLastName:string;correctedFirstName:string;correctedLastName:string;reason:string;occurredAt:string }>;
export type PersonNameCorrectionInput = Readonly<{organizationId:string;schoolId:string;personId:string;actorAccountId:string;expectedVersion:number;firstName:string;lastName:string;reason:string}>;

export interface PersonIdentityPort {
  create(transaction: PersonTransaction, input: { organizationId: unknown; firstName: unknown; lastName?: unknown }): Promise<PersonIdentity>;
  findById(transaction: PersonTransaction, organizationId: unknown, personId: unknown): Promise<PersonIdentity | null>;
  correctionContext(transaction:PersonTransaction,organizationId:unknown,personId:unknown):Promise<Readonly<{hasEmployee:boolean;history:readonly PersonNameRevision[]}>>;
  correctName(transaction:PersonTransaction,input:{organizationId:unknown;schoolId:unknown;personId:unknown;actorAccountId:unknown;expectedVersion:unknown;firstName:unknown;lastName?:unknown;reason:unknown}):Promise<Readonly<{personVersion:number;revisionId:string}>>;
}

export interface PersonIdentityRepository {
  create(transaction: PersonTransaction, input: PersonIdentityInput): Promise<PersonIdentity>;
  findById(transaction: PersonTransaction, organizationId: string, personId: string): Promise<PersonIdentity | null>;
  correctionContext(transaction:PersonTransaction,organizationId:string,personId:string):Promise<Readonly<{hasEmployee:boolean;history:readonly PersonNameRevision[]}>>;
  correctName(transaction:PersonTransaction,input:PersonNameCorrectionInput):Promise<Readonly<{personVersion:number;revisionId:string}>>;
}
