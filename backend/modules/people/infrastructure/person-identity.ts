import { randomUUID } from "node:crypto";
import type { Prisma } from "../../../../generated/prisma/client";
import { AccessError } from "../../access/contracts/index";
import type { PersonIdentityRepository, PersonIdentity, PersonTransaction, PersonIdentityInput, PersonNameCorrectionInput } from "../contracts/person-identity";

function txOf(transaction: PersonTransaction) { return transaction as Prisma.TransactionClient; }

export class PrismaPersonIdentity implements PersonIdentityRepository {
  async create(transaction: PersonTransaction, input: PersonIdentityInput): Promise<PersonIdentity> {
    const row = await txOf(transaction).person.create({ data: { id: randomUUID(), organizationId: input.organizationId, firstName: input.firstName, lastName: input.lastName, contactEmail: null, version: 1, createdAt: new Date() }, select: { id: true, firstName: true, lastName: true, version:true } });
    return row;
  }

  async findById(transaction: PersonTransaction, organizationId: string, personId: string): Promise<PersonIdentity | null> {
    const rows=await txOf(transaction).$queryRaw<PersonIdentity[]>`SELECT id,first_name AS "firstName",last_name AS "lastName",version FROM vs_people_person WHERE organization_id=${organizationId}::uuid AND id=${personId}::uuid FOR UPDATE`;
    return rows[0]??null;
  }

  async correctionContext(transaction:PersonTransaction,organizationId:string,personId:string){
    const tx=txOf(transaction),[employeeCount,rows]=await Promise.all([
      tx.employee.count({where:{organizationId,personId}}),
      tx.personNameRevision.findMany({where:{organizationId,personId},orderBy:{version:"desc"},take:20})
    ]);
    return {hasEmployee:employeeCount>0,history:rows.map(row=>({...row,occurredAt:row.occurredAt.toISOString()}))};
  }

  async correctName(transaction:PersonTransaction,input:PersonNameCorrectionInput){
    const tx=txOf(transaction),person=await tx.person.findFirst({where:{organizationId:input.organizationId,id:input.personId},select:{firstName:true,lastName:true,version:true}});
    if(!person)throw new AccessError("NOT_FOUND");
    if(person.version!==input.expectedVersion)throw new AccessError("STALE_VERSION");
    if(await tx.employee.count({where:{organizationId:input.organizationId,personId:input.personId}}))throw new AccessError("PERSON_SHARED");
    if(person.firstName===input.firstName&&person.lastName===input.lastName)throw new AccessError("CONFLICT");
    const version=person.version+1,revisionId=randomUUID(),changed=await tx.person.updateMany({where:{organizationId:input.organizationId,id:input.personId,version:input.expectedVersion},data:{firstName:input.firstName,lastName:input.lastName,version}});
    if(changed.count!==1)throw new AccessError("STALE_VERSION");
    await tx.personNameRevision.create({data:{id:revisionId,organizationId:input.organizationId,personId:input.personId,version,previousFirstName:person.firstName,previousLastName:person.lastName,correctedFirstName:input.firstName,correctedLastName:input.lastName,reason:input.reason,actorAccountId:input.actorAccountId,schoolId:input.schoolId,occurredAt:new Date()}});
    return {personVersion:version,revisionId};
  }
}
