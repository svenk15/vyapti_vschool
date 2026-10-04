import {createHash,randomBytes} from 'node:crypto';
import type {BrandingSecurity} from '../application/brands';
export class NodeBrandingSecurity implements BrandingSecurity{
 issueToken(){const token=randomBytes(24).toString('base64url');return {token,hash:this.hashToken(token)};}
 hashToken(value:string){return createHash('sha256').update(value).digest('hex');}
}
