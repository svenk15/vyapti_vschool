import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import type {MalwareScanPort,ScanEvidence} from '../contracts/index';
const run=promisify(execFile);

export class ClamAvScanner implements MalwareScanPort{
 constructor(private readonly executable:string|null){}
 async scan(input:{storageKey:string;sha256:string;bytes:Uint8Array}):Promise<ScanEvidence>{
  if(!this.executable)return {verdict:'UNAVAILABLE',engine:'clamav',engineVersion:'unavailable',definitionsVersion:null,errorCode:'SCAN_UNAVAILABLE'};
  const dir=await mkdtemp(join(tmpdir(),'vschool-doc-scan-')),file=join(dir,'object');
  try{await writeFile(file,input.bytes,{mode:0o600});try{const result=await run(this.executable,['--no-summary',file],{timeout:60_000,maxBuffer:1024*1024}),line=result.stdout.trim(),version=await run(this.executable,['--version'],{timeout:10_000,maxBuffer:1024*1024});return {verdict:line.endsWith(': OK')?'CLEAN':'ERROR',engine:'clamav',engineVersion:version.stdout.trim().slice(0,80)||'unknown',definitionsVersion:null,errorCode:line.endsWith(': OK')?null:'UNEXPECTED_OUTPUT'};}catch(error){const candidate=error as {code?:number;stdout?:string;stderr?:string};if(candidate.code===1)return {verdict:'BLOCKED',engine:'clamav',engineVersion:'configured',definitionsVersion:null,errorCode:'MALWARE_DETECTED'};return {verdict:'UNAVAILABLE',engine:'clamav',engineVersion:'configured',definitionsVersion:null,errorCode:'SCAN_UNAVAILABLE'};}}finally{await rm(dir,{recursive:true,force:true});}
 }
}
