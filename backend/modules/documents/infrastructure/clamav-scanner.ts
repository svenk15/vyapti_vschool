import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp,readdir,rm,stat,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import type {MalwareScanPort,ScanEvidence} from '../contracts/index';
const run=promisify(execFile);

export class ClamAvScanner implements MalwareScanPort{
 constructor(private readonly executable:string|null,private readonly databaseDirectory:string|null=null,private readonly maxDefinitionsAgeMs=24*60*60*1000,private readonly now:()=>Date=()=>new Date()){}
 private async definitions(){
  if(!this.databaseDirectory)return {ok:true as const,args:[] as string[]};
  try{const names=(await readdir(this.databaseDirectory)).filter(name=>/^(daily|main|bytecode)\.(cld|cvd)$/.test(name));if(!names.some(name=>name.startsWith('daily.')))return {ok:false as const,errorCode:'SIGNATURES_UNAVAILABLE'};const details=await Promise.all(names.map(async name=>({name,modified:(await stat(join(this.databaseDirectory!,name))).mtimeMs}))),daily=Math.max(...details.filter(item=>item.name.startsWith('daily.')).map(item=>item.modified));if(!Number.isFinite(daily)||this.now().getTime()-daily>this.maxDefinitionsAgeMs)return {ok:false as const,errorCode:'SIGNATURES_STALE'};return {ok:true as const,args:[`--database=${this.databaseDirectory}`]};}catch{return {ok:false as const,errorCode:'SIGNATURES_UNAVAILABLE'};}
 }
 async scan(input:{storageKey:string;sha256:string;bytes:Uint8Array}):Promise<ScanEvidence>{
  if(!this.executable)return {verdict:'UNAVAILABLE',engine:'clamav',engineVersion:'unavailable',definitionsVersion:null,errorCode:'SCAN_UNAVAILABLE'};
  const definitions=await this.definitions();if(!definitions.ok)return {verdict:'UNAVAILABLE',engine:'clamav',engineVersion:'configured',definitionsVersion:null,errorCode:definitions.errorCode};
  const dir=await mkdtemp(join(tmpdir(),'vschool-doc-scan-')),file=join(dir,'object');
  try{await writeFile(file,input.bytes,{mode:0o600});const version=await run(this.executable,[...definitions.args,'--version'],{timeout:10_000,maxBuffer:1024*1024}),parts=version.stdout.trim().split('/'),engineVersion=(parts[0]??'ClamAV unknown').slice(0,80),definitionsVersion=(parts[1]??null)?.slice(0,80)??null;try{const result=await run(this.executable,[...definitions.args,'--no-summary',file],{timeout:60_000,maxBuffer:1024*1024}),line=result.stdout.trim();return {verdict:line.endsWith(': OK')?'CLEAN':'ERROR',engine:'clamav',engineVersion,definitionsVersion,errorCode:line.endsWith(': OK')?null:'UNEXPECTED_OUTPUT'};}catch(error){const candidate=error as {code?:number};if(candidate.code===1)return {verdict:'BLOCKED',engine:'clamav',engineVersion,definitionsVersion,errorCode:'MALWARE_DETECTED'};return {verdict:'UNAVAILABLE',engine:'clamav',engineVersion,definitionsVersion,errorCode:'SCAN_UNAVAILABLE'};}}finally{await rm(dir,{recursive:true,force:true});}
 }
}
