import {createGuardiansServices} from '../backend/composition/guardians';
import {uuidPattern} from '../backend/modules/guardians/domain/policy';
import {localAccessConfig} from './access-local-config';

function value(flag:string){const index=process.argv.indexOf(flag);if(index<0||!process.argv[index+1])throw new Error('USAGE');const result=process.argv[index+1];if(!uuidPattern.test(result))throw new Error('USAGE');return result.toLowerCase();}
async function main(){if(process.argv[2]!=='grant-manager')throw new Error('USAGE');const config=localAccessConfig(),service=createGuardiansServices({databaseUrl:config.databaseUrl,releasedModules:['student_core','family'],emailSender:{sendFamilyInvite:async()=>({ok:false,reason:'Operator commands do not send invitations'})}});try{const result=await service.grantManager(config.operator,{organizationId:value('--organization-id'),schoolId:value('--school-id'),accountId:value('--account-id')});process.stdout.write(`${JSON.stringify(result)}\n`);}finally{await service.disconnect();}}
main().catch(error=>{console.error(error instanceof Error&&error.message==='USAGE'?'Usage: pnpm family-operator grant-manager --organization-id <uuid> --school-id <uuid> --account-id <uuid>':'FAMILY_OPERATOR_COMMAND_FAILED');process.exitCode=1;});
