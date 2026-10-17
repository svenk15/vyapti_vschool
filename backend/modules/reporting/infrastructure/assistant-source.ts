import type {Identity} from '../../../../shared/contracts/access';
import type {AssistantSource} from '../../../../shared/contracts/assistant';
import type {AssistantSourcePort} from '../../assistant/contracts/source';
import type {LeadershipSnapshotFacade} from '../application/leadership-snapshot';

export class ReportingSnapshotAssistantSource implements AssistantSourcePort {
 constructor(private readonly snapshots:LeadershipSnapshotFacade){}
 private map(value:Awaited<ReturnType<LeadershipSnapshotFacade['getSnapshot']>>):AssistantSource{return {id:value.id,label:`Attendance register coverage · ${value.schoolDate}`,reportType:'attendance-register-coverage.v1',definitionVersion:value.definitionVersion,sourceVersion:value.version,sourceAsOf:value.sourceAsOf,schoolDate:value.schoolDate,counts:{due:value.payload.counts.due,received:value.payload.counts.received,awaiting:value.payload.counts.awaiting}};}
 async list(actor:Identity,organizationId:string,schoolId:string){const rows=await this.snapshots.listSnapshots(actor,organizationId,schoolId),resolved=await Promise.all(rows.filter(row=>!row.removedAt).slice(0,20).map(row=>this.snapshots.getSnapshot(actor,organizationId,schoolId,row.id).then(value=>this.map(value)).catch(()=>null)));return resolved.filter((value):value is AssistantSource=>value!==null);}
 async get(actor:Identity,organizationId:string,schoolId:string,id:string){return this.map(await this.snapshots.getSnapshot(actor,organizationId,schoolId,id));}
}
