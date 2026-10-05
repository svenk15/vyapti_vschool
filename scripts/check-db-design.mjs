import fs from "node:fs";
const catalog=JSON.parse(fs.readFileSync("docs/database/TABLE_REGISTRY.json","utf8"));
const errors=[],models=new Set(),tables=new Set();
const tenantClasses=new Set(["BRANCH","INSTITUTION","INSTITUTION_ROOT","BRANCH_DIRECTORY","GLOBAL_IDENTITY","GLOBAL_SECURITY","TENANT_PRIVATE_WITH_SANITIZED_PUBLIC_READ","DEPLOYMENT_ONLY","GLOBAL_OPERATOR"]);
const futureRule=catalog.rlsPlan?.futureMigrationRule;
if(futureRule?.closureGate!=="TEN-03"||futureRule?.checkedBy!=="pnpm check:db-design"||!Array.isArray(futureRule?.requiredRegistryFields)||!futureRule.pathARequirement||!futureRule.enforcementRequirement||!futureRule.exceptions)errors.push("Missing TEN-03 future-migration RLS rule");
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
 const rls=item.rls;
 const expectedGate=rls?.classification==="GLOBAL_OPERATOR"?"PLATFORM":"TEN-03",expectedEnforcement=rls?.classification==="GLOBAL_OPERATOR"?"APPLICATION_GUARD":rls?.classification==="DEPLOYMENT_ONLY"?(catalog.rlsPlan.enforcementImplemented?"TEN_03_EXCEPTION":"PATH_A_DEFERRED_TEN_03"):catalog.rlsPlan.enforcementImplemented?"TEN_03_ENFORCED":"PATH_A_DEFERRED_TEN_03";
 if(!rls||!futureRule?.requiredRegistryFields?.every(field=>Object.hasOwn(rls,field))||!tenantClasses.has(rls.classification)||!Array.isArray(rls.scopeColumns)||!rls.intendedPolicy||rls.owner!==item.owner||rls.closureGate!==expectedGate)errors.push(`Incomplete RLS classification/policy/owner/gate ${item.table}`);
 if(rls?.classification==="BRANCH"&&(!rls.scopeColumns.includes("organization_id")||!rls.scopeColumns.includes("school_id")))errors.push(`Branch RLS scope must include organization_id and school_id ${item.table}`);
 if(rls?.classification==="INSTITUTION"&&!rls.scopeColumns.includes("organization_id"))errors.push(`Institution RLS scope must include organization_id ${item.table}`);
 if(rls?.classification==="INSTITUTION_ROOT"&&!rls.scopeColumns.includes("id"))errors.push(`Institution root scope must include its id ${item.table}`);
 if(rls?.enforcement!==expectedEnforcement)errors.push(`Unexpected pre-TEN-03 enforcement state ${item.table}`);
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
const ruleDate=catalog.rlsPlan.futureMigrationRule.effectiveFrom;
for(const migrationDir of fs.readdirSync("prisma/migrations").filter(name=>/^\d{14}_/.test(name)&&name.slice(0,8)>=ruleDate)){
 const path=`prisma/migrations/${migrationDir}/migration.sql`;
 if(!fs.existsSync(path))continue;
 const sql=fs.readFileSync(path,"utf8"),created=[...sql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?"?(vs_[a-z0-9_]+)"?/gi)].map(match=>match[1]);
 for(const table of new Set(created)){
  const item=catalog.tables.find(row=>row.table===table),tableComment=sql.match(new RegExp(`COMMENT\\s+ON\\s+TABLE\\s+(?:public\\.)?"?${table}"?\\s+IS\\s+'([^']*)'`,"i"))?.[1]??"";
  if(!item)errors.push(`New tenant table ${table} in ${migrationDir} is missing TABLE_REGISTRY.json contract`);
  if(item&&["GLOBAL_OPERATOR","DEPLOYMENT_ONLY"].includes(item.rls?.classification))continue;
  if(catalog.rlsPlan.enforcementImplemented){
   if(!new RegExp(`ALTER\\s+TABLE\\s+(?:public\\.)?"?${table}"?\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`,"i").test(sql)||!new RegExp(`ALTER\\s+TABLE\\s+(?:public\\.)?"?${table}"?\\s+FORCE\\s+ROW\\s+LEVEL\\s+SECURITY`,"i").test(sql)||!new RegExp(`CREATE\\s+POLICY\\s+[^;]+\\s+ON\\s+(?:public\\.)?"?${table}"?`,"i").test(sql))errors.push(`Enforced tenant table migration must ENABLE/FORCE RLS and create its policy ${table} (${migrationDir})`);
  }else if(!tableComment.includes("TEN-ADR-006 Path A")||!tableComment.includes(`${item?.rls?.classification??""} class`)||!tableComment.includes(`owner ${item?.owner??""}`)||!tableComment.includes(`scope ${item?.rls?.scopeColumns?.join(",")??""}`)||!tableComment.includes("closureGate TEN-03"))errors.push(`Path A tenant table migration comment must record class, owner, scope and TEN-03 closure ${table} (${migrationDir})`);
 }
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`Database design checks passed: ${catalog.tables.length} registered table contracts; physical names, owner prefixes, LLD schemas and Prisma mappings agree.`);
