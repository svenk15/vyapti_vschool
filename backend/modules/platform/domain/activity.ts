import {AccessError} from '../../access/contracts/index';
import {activityCategories,type ActivityCategory,type ActivityChange} from '../../../../shared/contracts/activity';

export type ActivityQuery=Readonly<{category:ActivityCategory;from:string;to:string;cursor:string|null;limit:number}>;
type Descriptor=Readonly<{category:ActivityCategory;action:string;resourceType:string}>;
const commands:Readonly<Record<string,Descriptor>>={
 UpdateSchool:{category:'SCHOOL_SETTINGS',action:'School information updated',resourceType:'School'},
 CreateCampus:{category:'SCHOOL_SETTINGS',action:'Campus created',resourceType:'Campus'},
 PublishBrand:{category:'SCHOOL_SETTINGS',action:'Sign-in branding published',resourceType:'Brand profile'},
 RollbackBrand:{category:'SCHOOL_SETTINGS',action:'Sign-in branding rolled back',resourceType:'Brand profile'},
 CreateMembership:{category:'STAFF_ACCESS',action:'Staff access created',resourceType:'School membership'},
 UpdateMembership:{category:'STAFF_ACCESS',action:'Staff access changed',resourceType:'School membership'},
 StudentRegistered:{category:'STUDENT_CHANGE',action:'Student registered',resourceType:'Student'},
 ImportedStudentRegistered:{category:'STUDENT_CHANGE',action:'Imported student registered',resourceType:'Student'},
 StudentPersonNameCorrected:{category:'STUDENT_CHANGE',action:'Student name corrected',resourceType:'Student'},
 StudentEnrolled:{category:'STUDENT_CHANGE',action:'Student enrolled',resourceType:'Enrollment'},
 StudentPlacementTransferred:{category:'STUDENT_CHANGE',action:'Student section changed',resourceType:'Enrollment'},
 StudentArchived:{category:'STUDENT_CHANGE',action:'Student archived',resourceType:'Student'},
 AttendanceSessionCorrected:{category:'ATTENDANCE_CORRECTION',action:'Submitted attendance corrected',resourceType:'Attendance session'},
};
const day=/^\d{4}-\d{2}-\d{2}$/;
function date(value:unknown){if(typeof value!=='string'||!day.test(value)){throw new AccessError('VALIDATION');}const parsed=new Date(`${value}T00:00:00.000Z`);if(Number.isNaN(parsed.valueOf())||parsed.toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return parsed;}
export function activityQuery(input:{category?:unknown;from?:unknown;to?:unknown;cursor?:unknown;limit?:unknown},today:string):ActivityQuery{
 const fallbackTo=date(today),fallbackFrom=new Date(fallbackTo);fallbackFrom.setUTCDate(fallbackFrom.getUTCDate()-29);
 const category=input.category===undefined?'STUDENT_CHANGE':input.category;if(typeof category!=='string'||!activityCategories.includes(category as ActivityCategory))throw new AccessError('VALIDATION');
 const from=input.from===undefined?fallbackFrom.toISOString().slice(0,10):input.from,to=input.to===undefined?today:input.to,fromDate=date(from),toDate=date(to);
 const span=(toDate.valueOf()-fromDate.valueOf())/86400000+1;if(span<1||span>93)throw new AccessError('VALIDATION');
 const cursor=input.cursor===undefined||input.cursor===null||input.cursor===''?null:input.cursor;if(cursor!==null&&(typeof cursor!=='string'||cursor.length>2048))throw new AccessError('INVALID_CURSOR');
 const number=input.limit===undefined?50:Number(input.limit);if(!Number.isSafeInteger(number)||number<1||number>100)throw new AccessError('VALIDATION');
 return {category:category as ActivityCategory,from:from as string,to:to as string,cursor:cursor as string|null,limit:number};
}
export function activityDescriptor(command:string){return commands[command]??null;}
export function commandsForCategory(category:ActivityCategory){return Object.entries(commands).filter(([,value])=>value.category===category).map(([command])=>command);}
export function allActivityCommands(){return Object.keys(commands);}
function safeStatus(value:unknown):string|null{return typeof value==='string'&&/^[A-Z][A-Z0-9_]{0,31}$/.test(value)?value:null;}
function safeVersion(value:unknown):string|null{return Number.isSafeInteger(value)&&Number(value)>0?String(value):null;}
export function safeActivityChanges(before:unknown,after:unknown):readonly ActivityChange[]{
 const left=before&&typeof before==='object'&&!Array.isArray(before)?before as Record<string,unknown>:{},right=after&&typeof after==='object'&&!Array.isArray(after)?after as Record<string,unknown>:{};
 const result:ActivityChange[]=[];const statusBefore=safeStatus(left.status),statusAfter=safeStatus(right.status);if(statusBefore!==null||statusAfter!==null)result.push({label:'Status',before:statusBefore,after:statusAfter});
 const versionBefore=safeVersion(left.version),versionAfter=safeVersion(right.version);if(versionBefore!==null||versionAfter!==null)result.push({label:'Version',before:versionBefore,after:versionAfter});return result;
}
