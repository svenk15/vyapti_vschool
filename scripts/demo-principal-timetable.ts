import {config} from 'dotenv';
import {existsSync,readFileSync} from 'node:fs';
import {createAccessServices} from '../backend/composition/access';
import {createAcademicServices} from '../backend/composition/academics';
import {localAccessConfig} from './access-local-config';

config({path:'.env.local',quiet:true});config({quiet:true});
const principalPath='artifacts/leadership-01/private-demo.json',timetablePath='artifacts/timetable-01/private-demo.json',released=['academic_core','admissions','attendance','staff_core','student_core','timetable'] as const;
type PrincipalDemo={adminEmail:string;password:string;organizationId:string;schoolId:string};
type TimetableDemo={publicationId?:string;manualConflictSessionId?:string};

async function main(){
 const local=localAccessConfig();if(!existsSync(principalPath)||!existsSync(timetablePath))throw new Error('PRINCIPAL_TIMETABLE_DEMO_REQUIRED');
 const principal=JSON.parse(readFileSync(principalPath,'utf8')) as PrincipalDemo,timetable=JSON.parse(readFileSync(timetablePath,'utf8')) as TimetableDemo,access=createAccessServices(local),academics=createAcademicServices({databaseUrl:local.databaseUrl,releasedModules:released});
 try{const identity=await access.authenticate(principal.adminEmail,principal.password);if(!identity)throw new Error('SYNTHETIC_ACCOUNT_UNAVAILABLE');const overview=await academics.leadershipTimetableOverview(identity,principal.organizationId,principal.schoolId,{limit:50});if(!timetable.publicationId||overview.publication?.id!==timetable.publicationId)throw new Error('PRINCIPAL_TIMETABLE_PUBLICATION_REQUIRED');const conflict=overview.exceptions.items.find(item=>item.outcome==='BLOCKED_MANUAL_CONFLICT'&&item.existingSession?.id===timetable.manualConflictSessionId);if(!conflict)throw new Error('PRINCIPAL_TIMETABLE_CONFLICT_REQUIRED');console.log(`Verified and preserved the connected Principal timetable exception scenario. Private credentials: ${principalPath}`);}finally{await academics.disconnect();await access.disconnect();}
}
main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'PRINCIPAL_TIMETABLE_DEMO_ERROR');process.exitCode=1;});
