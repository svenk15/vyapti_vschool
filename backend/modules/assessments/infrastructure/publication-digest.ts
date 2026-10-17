import {createHash} from 'node:crypto';

export const reportDigest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
