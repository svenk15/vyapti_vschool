import type {ModuleId} from '../../shared/contracts/modules';

export function memoizeModuleCapability(check:(moduleId:ModuleId,permission:string)=>Promise<boolean>){
 const checks=new Map<string,Promise<boolean>>();
 return (moduleId:ModuleId,permission:string)=>{
  const key=`${moduleId}\0${permission}`;
  let result=checks.get(key);
  if(!result){result=check(moduleId,permission);checks.set(key,result);}
  return result;
 };
}
