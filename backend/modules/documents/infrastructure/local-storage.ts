import {mkdir,open,readFile,rename,writeFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {ObjectStoragePort,StoredDocumentObject} from '../contracts/index';
import {detectMediaType} from '../domain/documents';
import {sha256} from './hashing';

export class LocalPrivateObjectStorage implements ObjectStoragePort{
 private readonly root:string;
 constructor(root:string,private readonly enabled:boolean){this.root=resolve(root);if(!enabled)throw new Error('Local Documents storage requires the guarded development or test database');}
 private path(key:string){if(!/^[0-9a-f-]{36}$/.test(key))throw new Error('Invalid private object reference');return join(this.root,key);}
 async putQuarantined(storageKey:string,bytes:Uint8Array){const target=this.path(storageKey),temporary=`${target}.${randomUUID()}.tmp`;await mkdir(dirname(target),{recursive:true,mode:0o700});try{await writeFile(temporary,bytes,{mode:0o600,flag:'wx'});await rename(temporary,target);}catch(error){try{const existing=await readFile(target);if(!Buffer.from(existing).equals(Buffer.from(bytes)))throw error;}catch{throw error;}}}
 async inspect(storageKey:string):Promise<StoredDocumentObject>{const bytes=new Uint8Array(await readFile(this.path(storageKey)));return {storageKey,bytes,size:bytes.byteLength,sha256:sha256(bytes),detectedMediaType:detectMediaType(bytes)};}
 async openPrivate(storageKey:string){const handle=await open(this.path(storageKey),'r');try{return new Uint8Array(await handle.readFile());}finally{await handle.close();}}
}
