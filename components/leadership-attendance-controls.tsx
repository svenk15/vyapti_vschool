'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import type {LeadershipRegisterCoverage} from '@/shared/contracts/attendance';
import {FilterDrawer,type FilterSelection} from '@/components/portal/filter-drawer';
import {SortDrawer,type SortSelection} from '@/components/portal/sort-drawer';
import {Button} from '@/components/ui/primitives';

function Icon({name}:{name:'filter'|'sort'}){return <svg className="toolbar-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{name==='filter'?<><path d="M4 6h16M7 12h10M10 18h4"/></>:<><path d="M8 4v16M5 7l3-3 3 3M16 20V4m-3 13 3 3 3-3"/></>}</svg>;}

export function LeadershipAttendanceControls({date,query,filters}:{date:string;query:LeadershipRegisterCoverage['query'];filters:LeadershipRegisterCoverage['filters']}){
 const router=useRouter(),[pending,startTransition]=useTransition(),[filterOpen,setFilterOpen]=useState(false),[sortOpen,setSortOpen]=useState(false),filterCount=Number(Boolean(query.classId))+Number(Boolean(query.status))+Number(Boolean(query.teacherId));
 const navigate=(next:Partial<LeadershipRegisterCoverage['query']>)=>{const value={...query,...next},params=new URLSearchParams({date});if(value.classId)params.set('class',value.classId);if(value.status)params.set('status',value.status);if(value.teacherId)params.set('teacher',value.teacherId);if(value.sort!=='due')params.set('sort',value.sort);if(value.order!=='asc')params.set('order',value.order);startTransition(()=>router.push(`/leadership/attendance?${params}`));};
 const applyFilters=(selection:FilterSelection)=>navigate({classId:selection.class?.[0]||null,status:(selection.status?.[0] as LeadershipRegisterCoverage['query']['status'])||null,teacherId:selection.teacher?.[0]||null});
 const applySort=(selection:SortSelection)=>navigate({sort:selection.by==='class'?'class':'due',order:selection.order==='descending'?'desc':'asc'});
 const classLabel=filters.classes.find(item=>item.id===query.classId)?.label,teacherLabel=filters.teachers.find(item=>item.id===query.teacherId)?.label,statusLabel=query.status==='SCHEDULED'?'Not opened':query.status==='OPEN'?'Open · awaiting':null;
 return <>
  <div className="list-toolbar" aria-label="Awaiting register controls">
   <p className="muted" style={{flex:'1 1 auto',margin:0}} aria-live="polite">{[classLabel,statusLabel,teacherLabel].filter(Boolean).join(' · ')||'All due, unsubmitted registers'} · {query.sort==='class'?'Class':'Due time'} {query.order==='asc'?'ascending':'descending'}</p>
   <div className="list-toolbar-actions">
    <Button variant="secondary" onClick={()=>setFilterOpen(true)} disabled={pending}><Icon name="filter"/>Filters{filterCount?` (${filterCount})`:''}</Button>
    <Button variant="secondary" onClick={()=>setSortOpen(true)} disabled={pending}><Icon name="sort"/>Sort</Button>
    {filterCount?<Button variant="ghost" onClick={()=>navigate({classId:null,status:null,teacherId:null})} disabled={pending}>Clear filters</Button>:null}
   </div>
  </div>
  <FilterDrawer key={`${query.classId}-${query.status}-${query.teacherId}`} open={filterOpen} onClose={()=>setFilterOpen(false)} attributes={[{id:'class',label:'Class',mode:'single',options:filters.classes.map(item=>({value:item.id,label:item.label}))},{id:'status',label:'Session status',mode:'single',options:[{value:'SCHEDULED',label:'Not opened'},{value:'OPEN',label:'Open · awaiting'}]},{id:'teacher',label:'Responsible teacher',mode:'single',options:filters.teachers.map(item=>({value:item.id,label:item.label}))}]} applied={{class:query.classId?[query.classId]:[],status:query.status?[query.status]:[],teacher:query.teacherId?[query.teacherId]:[]}} onApply={applyFilters} title="Filters" description="Limit due registers within the current authorized branch."/>
  <SortDrawer key={`${query.sort}-${query.order}`} open={sortOpen} onClose={()=>setSortOpen(false)} options={[{value:'due',label:'Due time'},{value:'class',label:'Class'}]} applied={{by:query.sort,order:query.order==='asc'?'ascending':'descending'}} onApply={applySort}/>
 </>;
}
