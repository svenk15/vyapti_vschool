import {afterEach,expect,it} from "vitest";
import {mkdtemp,readFile,stat,rm,readdir} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {DevelopmentMailSink} from "../../backend/modules/access/infrastructure/development-mail-sink";

let directory="";afterEach(async()=>{if(directory)await rm(directory,{recursive:true,force:true});directory="";});
it("writes only to the private local sink and keeps tokens in URL fragments",async()=>{
 directory=await mkdtemp(join(tmpdir(),"vschool-mail-"));const sink=new DevelopmentMailSink("http://127.0.0.1:3410",directory,true),token="synthetic-one-time-token";
 await expect(sink.sendPasswordReset({to:"demo@example.test",token,expiresAt:"2026-01-01T00:30:00.000Z"})).resolves.toEqual({ok:true});
 const files=await readdir(directory);expect(files).toHaveLength(1);const path=join(directory,files[0]),message=await readFile(path,"utf8"),link=JSON.parse(message).link as string;
 expect(new URL(link).hash).toBe(`#${token}`);expect(new URL(link).search).toBe("");expect(message).toContain(token);expect((await stat(path)).mode&0o777).toBe(0o600);
});
it("shows a visible deterministic failure without writing a mail",async()=>{
 directory=await mkdtemp(join(tmpdir(),"vschool-mail-"));const sink=new DevelopmentMailSink("http://127.0.0.1:3410",directory,true);
 await expect(sink.sendStaffInvite({to:"teacher@mail-fail.vschool.example",token:"synthetic",expiresAt:"2026-01-04T00:00:00.000Z",organizationId:"org",schoolId:"school"})).resolves.toMatchObject({ok:false,reason:"Mail provider rejected the message"});
 await expect(readdir(directory)).resolves.toEqual([]);
});
