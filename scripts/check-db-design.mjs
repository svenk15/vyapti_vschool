import fs from "node:fs";
const catalog=JSON.parse(fs.readFileSync("docs/database/TABLE_REGISTRY.json","utf8"));
const errors=[],models=new Set(),tables=new Set();
for(const item of catalog.tables){
 if(models.has(item.model))errors.push(`Duplicate logical model ${item.model}`);
 if(tables.has(item.table))errors.push(`Duplicate physical table ${item.table}`);
 models.add(item.model);tables.add(item.table);
 if(!/^vs_[a-z]+_[a-z][a-z0-9_]*$/.test(item.table)||Buffer.byteLength(item.table)>63)errors.push(`Invalid physical name ${item.table}`);
 if(!item.table.startsWith(`vs_${item.owner}_`))errors.push(`Owner prefix mismatch ${item.table}`);
 if(!["PLANNED","MIGRATED"].includes(item.status))errors.push(`Invalid migration status ${item.table}`);
 const design=fs.readFileSync(item.design,"utf8");
 const line=design.split("\n").find(l=>l.startsWith(`| \`${item.table}\` (`));
 if(!line)errors.push(`LLD missing physical schema ${item.table}`);
 else{
  const cells=line.split("|").slice(1,-1).map(c=>c.trim());
  if(cells[1]!==item.fields||cells.at(-1)!==item.constraints)errors.push(`Catalog/LLD schema drift ${item.table}`);
  if(/\b[a-z]+[A-Z][a-zA-Z]*\b/.test(cells[1]))errors.push(`Non-snake-case physical column ${item.table}`);
 }
 if(!item.fields||!item.responsibility||!item.constraints)errors.push(`Incomplete table contract ${item.table}`);
 const moduleLld=`docs/modules/${item.owner}/DESIGN.md`;
 if(!fs.existsSync(moduleLld))errors.push(`Missing owner LLD ${item.owner}`);
 if(!fs.readFileSync("docs/DATABASE_DESIGN.md","utf8").includes(`\`${item.table}\``))errors.push(`Database index missing ${item.table}`);
}
const prisma=fs.readFileSync("prisma/schema.prisma","utf8");
const enums=new Set([...prisma.matchAll(/enum\s+(\w+)/g)].map(m=>m[1]));
const scalars=new Set(["String","Boolean","Int","BigInt","Float","Decimal","DateTime","Json","Bytes",...enums]);
for(const match of prisma.matchAll(/model\s+(\w+)\s*\{([\s\S]*?)\n\}/g)){
 const [,model,body]=match,item=catalog.tables.find(t=>t.model===model);
 const physical=body.match(/@@map\("([^"]+)"\)/)?.[1];
 if(!item||item.status!=="MIGRATED"||physical!==item.table)errors.push(`Unregistered/unmapped migrated model ${model}`);
 for(const line of body.split("\n")){
  const field=line.trim().match(/^(\w+)\s+(\w+)[?\[\]]*/);
  if(!field||!scalars.has(field[2]))continue;
  const mapping=line.match(/@map\("([^"]+)"\)/)?.[1];
  const expected=field[1].replace(/([a-z0-9])([A-Z])/g,"$1_$2").toLowerCase();
  if((mapping??field[1])!==expected)errors.push(`Column mapping missing/incorrect ${model}.${field[1]}`);
 }
}
for(const item of catalog.tables.filter(t=>t.status==="MIGRATED"))if(!new RegExp(`model\\s+${item.model}\\s*\\{`).test(prisma))errors.push(`Migrated catalog model missing ${item.model}`);
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`Database design checks passed: ${catalog.tables.length} registered table contracts; physical names, owner prefixes, LLD schemas and Prisma mappings agree.`);
