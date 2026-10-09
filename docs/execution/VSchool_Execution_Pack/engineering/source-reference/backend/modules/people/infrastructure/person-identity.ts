import { randomUUID } from "node:crypto";
import type { Prisma } from "../../../../generated/prisma/client";
import type { PersonIdentityRepository, PersonIdentity, PersonTransaction, PersonIdentityInput } from "../contracts/person-identity";

function txOf(transaction: PersonTransaction) { return transaction as Prisma.TransactionClient; }

export class PrismaPersonIdentity implements PersonIdentityRepository {
  async create(transaction: PersonTransaction, input: PersonIdentityInput): Promise<PersonIdentity> {
    const row = await txOf(transaction).person.create({ data: { id: randomUUID(), organizationId: input.organizationId, firstName: input.firstName, lastName: input.lastName, contactEmail: null, version: 1, createdAt: new Date() }, select: { id: true, firstName: true, lastName: true } });
    return row;
  }

  async findById(transaction: PersonTransaction, organizationId: string, personId: string): Promise<PersonIdentity | null> {
    return txOf(transaction).person.findFirst({ where: { id: personId, organizationId }, select: { id: true, firstName: true, lastName: true } });
  }

  async findExactName(transaction: PersonTransaction, organizationId: string, exactName: string): Promise<readonly PersonIdentity[]> {
    return txOf(transaction).$queryRaw<PersonIdentity[]>`
      SELECT id, first_name AS "firstName", last_name AS "lastName"
      FROM vs_people_person
      WHERE organization_id = ${organizationId}::uuid
        AND lower(btrim(concat_ws(' ', first_name, last_name))) = lower(${exactName})
      ORDER BY last_name, first_name, id
      LIMIT 20`;
  }
}
