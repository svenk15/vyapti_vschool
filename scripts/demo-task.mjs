// Retain a task-specific local build while later work proceeds. No deployment.
import { config } from 'dotenv';
import { execFileSync,spawn } from 'node:child_process';
import { cpSync,existsSync,mkdirSync,readFileSync,writeFileSync } from 'node:fs';
import { join,resolve,basename } from 'node:path';
config({path:'.env.local',quiet:true});config({quiet:true});
const [task,portValue,requestedCommit,releasedModulesValue]=process.argv.slice(2),port=Number(portValue),releasedModules=(releasedModulesValue??'').split(',').filter(Boolean).sort();
if(!/^[A-Z]{2,3}-\d{2}$/.test(task??'')||!Number.isInteger(port)||port<3403||port>3499)throw new Error('Choose a task ID and local demo port 3403–3499');
if(releasedModules.length&&(!['ACA-01','ACA-02'].includes(task)||releasedModules.join(',')!=='academic_core'))throw new Error('Only local academic demos may enable their academic_core release');
const database=new URL(process.env.DATABASE_URL??'');if(!['127.0.0.1','localhost','[::1]'].includes(database.hostname)||database.pathname!=='/vyapti_vschool')throw new Error('Dedicated local development database required');
if(requestedCommit&&!/^[0-9a-f]{40}$/.test(requestedCommit))throw new Error("Use a full tested commit SHA");
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),commit=requestedCommit??head,path=resolve('artifacts/demos',task,commit),url=`http://127.0.0.1:${port}`;
if(!existsSync(join(path,'demo.json'))){
 if(commit!==head)throw new Error("An older commit needs an existing immutable snapshot");
 if(!existsSync('.next/standalone/server.js'))throw new Error('Build first');
 mkdirSync(path,{recursive:true,mode:0o700});
 cpSync('.next/standalone',path,{recursive:true,verbatimSymlinks:true,filter:source=>!basename(source).startsWith('.env')});
 cpSync('.next/static',join(path,'.next/static'),{recursive:true});if(existsSync('public'))cpSync('public',join(path,'public'),{recursive:true});
 writeFileSync(join(path,'demo.json'),JSON.stringify({task,testedCommit:commit,url,buildId:readFileSync('.next/BUILD_ID','utf8').trim(),releasedModules},null,2)+'\n');
}
const metadata=JSON.parse(readFileSync(join(path,'demo.json'),'utf8'));if(metadata.task!==task||metadata.testedCommit!==commit||metadata.url!==url||(metadata.releasedModules??[]).join(',')!==releasedModules.join(','))throw new Error('Snapshot configuration mismatch');
console.log(JSON.stringify(metadata));
const child=spawn(process.execPath,[join(path,'server.js')],{env:{...process.env,PORT:String(port),HOSTNAME:'127.0.0.1',NEXTAUTH_URL:url,VSCHOOL_RELEASED_MODULES:releasedModules.join(',')},stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>{process.exitCode=code??0;});
