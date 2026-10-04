import { mkdirSync,openSync,writeFileSync,closeSync,realpathSync } from "node:fs";
import { resolve,relative,dirname } from "node:path";
import { createAccessServices } from "../backend/composition/access";
import { localAccessConfig } from "./access-local-config";
import { AccessError } from "../backend/modules/access/contracts";
export async function runActivationOperator(recovery:boolean){
 const args=process.argv.slice(2),names=["accountId","membershipIds","caseReference","reason","output"];
 const values:Record<string,string>={};for(let i=0;i<args.length;i+=2){const name=args[i].replace(/^--/,"");if(!names.includes(name)||!args[i+1]||args[i+1].startsWith("--")||values[name])throw new AccessError("VALIDATION");values[name]=args[i+1];}
 const config=localAccessConfig(),path=resolve(values.output??""),artifactRoot=resolve("artifacts"),inside=relative(artifactRoot,path);
 if(!values.output||!inside||! /^(?:iam-03\/)?private-[A-Za-z0-9_.-]+\.json$/.test(inside)||inside.includes("private-demo.json"))throw new AccessError("VALIDATION");
 mkdirSync(dirname(path),{recursive:true});if(realpathSync(artifactRoot)!==artifactRoot||realpathSync(dirname(path))!==dirname(path))throw new AccessError("VALIDATION");const fd=openSync(path,"wx",0o600),service=createAccessServices(config);
 try{const issued=await service.issueActivation({accountId:values.accountId,membershipIds:values.membershipIds?values.membershipIds.split(","):[],caseReference:values.caseReference,reason:values.reason},config.operator,recovery);writeFileSync(fd,JSON.stringify({url:new URL("/activate",process.env.VSCHOOL_DEMO_URL??process.env.NEXTAUTH_URL??"http://127.0.0.1:3400").href,...issued},null,2)+"\n");console.log(JSON.stringify({activationId:issued.activationId,expiresAt:issued.expiresAt,privateInstructions:relative(process.cwd(),path)}));}
 finally{closeSync(fd);await service.disconnect();}
}
export function activationOperatorFailure(error:unknown){console.error(error instanceof AccessError?error.code:"OPERATOR_ACTIVATION_FAILED: verify local configuration and use a new private output path.");process.exitCode=1;}
