import type {Prisma} from '../../../../generated/prisma/client';
import type {SupportPupilContextPort} from '../contracts/support-pupil-context';

export class PrismaSupportPupilContext implements SupportPupilContextPort{
 async list(transaction:object,_actor:Parameters<SupportPupilContextPort['list']>[1],input:Parameters<SupportPupilContextPort['list']>[2]){const tx=transaction as Prisma.TransactionClient;if(!input.studentIds.length)return [];const rows=await tx.student.findMany({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:{in:[...input.studentIds]},status:'ACTIVE'},select:{id:true,admissionNumber:true,person:{select:{firstName:true,lastName:true}}},orderBy:[{admissionNumber:'asc'},{id:'asc'}]});return rows.map(row=>({studentId:row.id,displayName:[row.person.firstName,row.person.lastName].filter(Boolean).join(' '),admissionNumber:row.admissionNumber}));}
}
