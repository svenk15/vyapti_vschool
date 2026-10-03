import { createAccessServices } from "../backend/composition/access";
import { AccessError } from "../backend/modules/access/contracts";
import { localAccessConfig } from "./access-local-config";
import type { ProvisionInput } from "../shared/contracts/access";
async function password(){
 if(process.argv.includes("--password-stdin")){let value="";for await(const chunk of process.stdin){value+=chunk;if(value.length>1024)throw new Error("VALIDATION");}return value.replace(/\r?\n$/,"");}
 if(!process.stdin.isTTY)throw new Error("Use --password-stdin with a private pipe, or an interactive terminal.");
 process.stderr.write("Administrator password (hidden): ");process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding("utf8");
 return new Promise<string>((resolve,reject)=>{let value="";const listener=(chunk:string)=>{for(const c of chunk){if(c==="\u0003"){finish();reject(new Error("CANCELLED"));return;}if(c==="\r"||c==="\n"){finish();resolve(value);return;}if(c==="\u007f")value=value.slice(0,-1);else if(value.length<1024)value+=c;}};function finish(){process.stdin.off("data",listener);process.stdin.setRawMode(false);process.stdin.pause();process.stderr.write("\n");}process.stdin.on("data",listener);});
}
async function run(){
 const args=process.argv.slice(2),fields=["organizationName","schoolCode","schoolName","timezone","adminEmail"] as const;
 for(let i=0;i<args.length;i++){if(args[i]==="--password-stdin")continue;if(!fields.some(field=>args[i]===`--${field}`))throw new Error("VALIDATION");i++;}
 const input={} as ProvisionInput;
 for(const field of fields){const index=args.indexOf(`--${field}`);if(index<0||!args[index+1]||args[index+1].startsWith("--"))throw new Error("Required: --organizationName --schoolCode --schoolName --timezone --adminEmail; password is prompted or read with --password-stdin.");input[field]=args[index+1];}
 const config=localAccessConfig();input.password=await password();const service=createAccessServices(config);
 try{console.log(JSON.stringify(await service.provisionSchool(input,config.operator)));}finally{await service.disconnect();}
}
run().catch(error=>{console.error(error instanceof AccessError?error.code:error instanceof Error&&["CANCELLED","LOCAL_CONFIGURATION_REQUIRED"].includes(error.message)?error.message:"PROVISION_FAILED: verify configuration and required arguments. No credentials were logged.");process.exitCode=1;});
