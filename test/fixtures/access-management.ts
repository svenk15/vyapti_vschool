import { randomBytes,randomUUID } from "node:crypto";
import { BcryptPasswords } from "../../backend/modules/access/infrastructure/passwords";
import type { PrismaClient } from "../../generated/prisma/client";
import type { Identity,ProvisionResult,RoleCode } from "../../shared/contracts/access";
export function schoolInput(){const suffix=randomUUID();return {organizationName:`Synthetic management ${suffix}`,schoolName:`Management school ${suffix.slice(0,8)}`,schoolCode:"MAIN",timezone:"Asia/Kolkata",adminEmail:`admin-${suffix}@vschool.example`,password:randomBytes(24).toString("base64url")};}
export async function activeStaffFixture(db:PrismaClient,scope:ProvisionResult,roles:RoleCode[]=["TEACHER"]){
 // Dedicated test-only active staff; production activation is IAM-03.
 const accountId=randomUUID(),membershipId=randomUUID(),email=`staff-${randomUUID()}@vschool.example`,password=randomBytes(24).toString("base64url"),hash=await new BcryptPasswords().hash(password);
 await db.$transaction(async tx=>{await tx.userAccount.create({data:{id:accountId,normalizedEmail:email,passwordHash:hash,status:"ACTIVE",tokenVersion:1,failedAttempts:0,version:1,createdAt:new Date()}});await tx.schoolMembership.create({data:{id:membershipId,organizationId:scope.organizationId,schoolId:scope.schoolId,accountId,status:"ACTIVE",version:1}});await tx.roleGrant.createMany({data:roles.map(code=>({id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,membershipId,code}))});});
 return {accountId,membershipId,email,password,identity:{accountId,tokenVersion:1} satisfies Identity};
}
