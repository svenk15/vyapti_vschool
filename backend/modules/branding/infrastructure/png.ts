import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import type {BrandAssetSanitizer,SanitizedBrandImage} from '../application/brands';
import {BrandingError} from '../domain/brand';
const table=(()=>{const out=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;out[n]=c>>>0;}return out;})();
function crc32(bytes:Uint8Array){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(type:string,data:Uint8Array){const out=new Uint8Array(data.length+12),v=new DataView(out.buffer);v.setUint32(0,data.length);for(let i=0;i<4;i++)out[4+i]=type.charCodeAt(i);out.set(data,8);v.setUint32(data.length+8,crc32(out.subarray(4,data.length+8)));return out;}
const signature=Uint8Array.from([137,80,78,71,13,10,26,10]);
export class NodePngSanitizer implements BrandAssetSanitizer{
 sanitize(input:Uint8Array):SanitizedBrandImage{try{
  if(!(input instanceof Uint8Array)||input.length<45||input.length>2*1024*1024||signature.some((b,i)=>input[i]!==b))throw new Error();
  const view=new DataView(input.buffer,input.byteOffset,input.byteLength),idats:Uint8Array[]=[];let offset=8,width=0,height=0,ihdr:Uint8Array|undefined,seenIdat=false,endedIdat=false,ended=false;
  while(offset<input.length){if(offset+12>input.length)throw new Error();const length=view.getUint32(offset);if(length>input.length-offset-12)throw new Error();const type=String.fromCharCode(...input.subarray(offset+4,offset+8)),data=input.subarray(offset+8,offset+8+length),expected=view.getUint32(offset+8+length);if(crc32(input.subarray(offset+4,offset+8+length))!==expected)throw new Error();
   if(!ihdr&&type!=='IHDR'||ended)throw new Error();if(type==='IHDR'){if(ihdr||offset!==8||length!==13)throw new Error();ihdr=data.slice();width=view.getUint32(offset+8);height=view.getUint32(offset+12);if(width<1||height<1||width>2048||height>2048||width*height>4_194_304||data[8]!==8||![2,6].includes(data[9])||data[10]!==0||data[11]!==0||data[12]!==0)throw new Error();}
   else if(type==='IDAT'){if(endedIdat)throw new Error();seenIdat=true;idats.push(data.slice());}
   else if(type==='IEND'){if(length!==0||!seenIdat||offset+12!==input.length)throw new Error();ended=true;}
   else {if(seenIdat)endedIdat=true;if(type[0]===type[0].toUpperCase())throw new Error();}
   if(type!=='IDAT'&&seenIdat)endedIdat=true;offset+=length+12;
  }
  if(!ended||!ihdr)throw new Error();const compressedLength=idats.reduce((n,x)=>n+x.length,0);if(compressedLength===0)throw new Error();const compressed=new Uint8Array(compressedLength);let p=0;for(const b of idats){compressed.set(b,p);p+=b.length;}
  const channels=ihdr[9]===6?4:3,row=width*channels+1,inflated=inflateSync(compressed,{maxOutputLength:row*height+1,info:true}) as unknown as {buffer:Uint8Array;engine:{bytesWritten:number}},raw=inflated.buffer;if(raw.length!==row*height||inflated.engine.bytesWritten!==compressed.length)throw new Error();for(let y=0;y<height;y++)if(raw[y*row]>4)throw new Error();
  const header=new Uint8Array(13);new DataView(header.buffer).setUint32(0,width);new DataView(header.buffer).setUint32(4,height);header.set(ihdr.subarray(8),8);const clean=[signature,chunk('IHDR',header),chunk('IDAT',compressed),chunk('IEND',new Uint8Array())],bytes=new Uint8Array(clean.reduce((n,x)=>n+x.length,0));p=0;for(const b of clean){bytes.set(b,p);p+=b.length;}return {bytes,sha256:createHash('sha256').update(bytes).digest('hex'),width,height};
  }catch{throw new BrandingError('VALIDATION');}}
}
