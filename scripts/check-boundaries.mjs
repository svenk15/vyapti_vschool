import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const failures=[];
function walk(dir){
 if(!fs.existsSync(dir))return;
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!/\.tsx?$/.test(file))continue;
  const code=fs.readFileSync(file,"utf8"),ast=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true);
  const backend=file.startsWith("backend/"),shared=file.startsWith("shared/contracts/");
  const core=/^backend\/modules\/[^/]+\/(domain|application|contracts)\//.test(file);
  const owner=file.match(/^backend\/modules\/([^/]+)\//)?.[1];
  const browser=file.startsWith("components/")||file==="lib/demo-schools.ts"||/^\s*["']use client["']/.test(code);
  function visit(node){
   let spec;
   if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))spec=node.moduleSpecifier.text;
   if(ts.isCallExpression(node)&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0])&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||node.expression.getText(ast)==="require"))spec=node.arguments[0].text;
   if(spec){
    const local=spec.startsWith(".")||spec.startsWith("@/");
    const resolved=spec.startsWith(".")?path.normalize(path.join(path.dirname(file),spec)):spec.replace(/^@\//,"");
    if(backend&&(/^(next(?:\/|$)|react(?:\/|$)|react-dom(?:\/|$)|server-only$|@nestjs\/)/.test(spec)||local&&/^(app|components|lib)\//.test(resolved)))failures.push(`${file}: portable backend imports host/UI ${spec}`);
    if((core||shared)&&(!local||!/^backend\/modules\/.+\/(domain|application|contracts)\//.test(resolved)&&!resolved.startsWith("shared/contracts/")))failures.push(`${file}: forbidden core/contract import ${spec}`);
    if(/\/domain\//.test(file)&&/\/(application|infrastructure)\//.test(resolved))failures.push(`${file}: domain depends outward`);
    const target=resolved.match(/^backend\/modules\/([^/]+)\/(.*)/);
    if(backend&&target&&target[1]!==owner&&owner&&!target[2].startsWith("contracts/"))failures.push(`${file}: cross-module import must use contracts`);
    if(shared&&resolved.startsWith("backend/"))failures.push(`${file}: shared contract depends on backend`);
    if(browser&&(resolved.startsWith("backend/")||resolved.startsWith("lib/server/")||resolved.startsWith("generated/")||/^(?:@prisma\/|pg$)/.test(spec)))failures.push(`${file}: browser imports backend; use shared contracts`);
   }
   if((core||shared)&&ts.isPropertyAccessExpression(node)&&["process.env","window","document"].includes(node.getText(ast)))failures.push(`${file}: core/contract reads host globals`);
   ts.forEachChild(node,visit);
  }
  visit(ast);
 }
}
for(const dir of ["backend","shared/contracts","app","components","lib"])walk(dir);
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Backend extraction boundaries passed: portable backend, inward core dependencies and browser-safe shared contracts.");
