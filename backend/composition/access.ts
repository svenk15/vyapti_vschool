import { randomUUID } from "node:crypto";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createAccessUseCases } from "../modules/access/application/services";
import { PrismaAccessRepository } from "../modules/access/infrastructure/repository";
import { BcryptPasswords } from "../modules/access/infrastructure/passwords";
import { PrismaProvisionEvidence } from "../modules/platform/infrastructure/provision-evidence";
export function createAccessServices(config:{databaseUrl:string;now?:()=>Date}) {
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
 const repository=new PrismaAccessRepository(db,tx=>new PrismaProvisionEvidence(tx),config.now);
 return {...createAccessUseCases(repository,new BcryptPasswords(),randomUUID),disconnect:()=>db.$disconnect()};
}
