import { randomBytes,randomUUID } from "node:crypto";
import { existsSync,mkdirSync,writeFileSync } from "node:fs";
import { createAccessServices } from "../backend/composition/access";
import { localAccessConfig } from "./access-local-config";
async function run(){
 const path="artifacts/iam-01/private-demo.json";
 if(existsSync(path)){console.log(`Existing demo preserved. Private credentials: ${path}`);return;}
 const config=localAccessConfig(),service=createAccessServices(config),suffix=randomUUID().slice(0,8);
 const input={organizationName:`Synthetic IAM institution ${suffix}`,schoolCode:"MAIN",schoolName:`VSchool demo ${suffix}`,timezone:"Asia/Kolkata",adminEmail:`operator-${suffix}@vschool.example`,password:randomBytes(24).toString("base64url")};
 try{const ids=await service.provisionSchool(input,config.operator);mkdirSync("artifacts/iam-01",{recursive:true});writeFileSync(path,JSON.stringify({url:"http://127.0.0.1:3400/sign-in",email:input.adminEmail,password:input.password,schoolName:input.schoolName,...ids},null,2)+"\n",{flag:"wx",mode:0o600});console.log(`Provisioned synthetic demo atomically. Private credentials: ${path}`);}finally{await service.disconnect();}
}
run().catch(()=>{console.error("DEMO_PROVISION_FAILED: inspect local configuration; credentials were not logged.");process.exitCode=1;});
