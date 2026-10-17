import type {LeadershipBranchComparisonRow} from '../../../../shared/contracts/reporting';

export type ComparisonSource=Readonly<{
 branchId:string;branchName:string;timezone:string;schoolDate:string;definitionVersion:string;duePolicy:string;sourceAsOf:string;
 counts:Readonly<{due:number;received:number;awaiting:number}>;
}>;

const ratio=(numerator:number,denominator:number)=>({numerator,denominator,value:denominator===0?null:numerator/denominator});

export function buildBranchComparison(branches:readonly Readonly<{id:string;name:string;timezone:string}>[],sources:readonly ComparisonSource[]){
 const preliminary=branches.map(branch=>{
  const rows=sources.filter(source=>source.branchId===branch.id).sort((left,right)=>left.schoolDate.localeCompare(right.schoolDate));
  const dates=[...new Set(rows.map(row=>row.schoolDate))],definitions=[...new Set(rows.map(row=>`${row.definitionVersion}|${row.duePolicy}`))],timezones=[...new Set(rows.map(row=>row.timezone))];
  const due=rows.reduce((sum,row)=>sum+row.counts.due,0),received=rows.reduce((sum,row)=>sum+row.counts.received,0),awaiting=rows.reduce((sum,row)=>sum+row.counts.awaiting,0),cutoffs=rows.map(row=>row.sourceAsOf).sort();
  return {branchId:branch.id,branchName:branch.name,timezone:timezones.length===1?timezones[0]!:branch.timezone,dates,definitionVersion:definitions.length===1?rows[0]!.definitionVersion:null,duePolicy:definitions.length===1?rows[0]!.duePolicy:null,sourceCutoffFrom:cutoffs[0]??null,sourceCutoffTo:cutoffs.at(-1)??null,counts:{due,received,awaiting},rate:ratio(received,due),signature:dates.join(','),sourceValid:rows.length>0&&definitions.length===1&&timezones.length===1};
 });
 const valid=preliminary.filter(row=>row.sourceValid),dateSignatures=[...new Set(valid.map(row=>row.signature))],definitionSignatures=[...new Set(valid.map(row=>`${row.definitionVersion}|${row.duePolicy}`))],datesCompatible=dateSignatures.length<=1,definitionsCompatible=definitionSignatures.length<=1;
 const rows:LeadershipBranchComparisonRow[]=preliminary.map(row=>{
  const reason=!row.dates.length?'NO_SNAPSHOTS':!row.sourceValid||!definitionsCompatible?'SOURCE_DEFINITION_DIFFERS':!datesCompatible?'DATE_COVERAGE_DIFFERS':null;
  return {...row,status:reason===null?'COMPARABLE':'NOT_COMPARABLE',reason,signature:undefined,sourceValid:undefined} as LeadershipBranchComparisonRow;
 });
 const included=rows.filter(row=>row.status==='COMPARABLE'),numerator=included.reduce((sum,row)=>sum+row.counts.received,0),denominator=included.reduce((sum,row)=>sum+row.counts.due,0);
 return {rows,combined:{includedBranchCount:included.length,...ratio(numerator,denominator)}};
}
