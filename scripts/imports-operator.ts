import {localAccessConfig} from './access-local-config';
import {createImportsServices} from '../backend/composition/imports';

async function main(){
 const command=process.argv[2];if(command!=='purge-expired')throw new Error('SUPPORTED_COMMAND: purge-expired');
 const config=localAccessConfig(),service=createImportsServices({databaseUrl:config.databaseUrl});
 try {const result=await service.purgeExpired(config.operator);process.stdout.write(`Expired import payloads purged: ${result.sourcesPurged} source files, ${result.detailsPurged} row details.\n`);}
 finally {await service.disconnect();}
}
main().catch(()=>{console.error('IMPORT_RETENTION_REFUSED: guarded local configuration and operator audit must be available.');process.exitCode=1;});
