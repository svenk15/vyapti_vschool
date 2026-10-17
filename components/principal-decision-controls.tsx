'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import type {DecisionQueue} from '@/shared/contracts/decisions';
import {ListToolbar} from '@/components/portal/list-toolbar';
import {FilterDrawer,type FilterSelection} from '@/components/portal/filter-drawer';
import {SortDrawer,type SortSelection} from '@/components/portal/sort-drawer';

export function PrincipalDecisionControls({queue}:{queue:DecisionQueue}){
 const router=useRouter(),[pending,startTransition]=useTransition(),[draft,setDraft]=useState(queue.query.reference??''),[filterOpen,setFilterOpen]=useState(false),[sortOpen,setSortOpen]=useState(false),filterCount=Number(Boolean(queue.query.type))+Number(Boolean(queue.query.state))+Number(Boolean(queue.query.due));
 const navigate=(next:Partial<DecisionQueue['query']>)=>{const query={...queue.query,...next},params=new URLSearchParams();if(query.reference)params.set('reference',query.reference);if(query.type)params.set('type',query.type);if(query.state)params.set('state',query.state);if(query.due)params.set('due',query.due);if(query.sort!=='due')params.set('sort',query.sort);if(query.order!=='asc')params.set('order',query.order);startTransition(()=>router.push(`/leadership/decisions${params.size?`?${params}`:''}`));};
 const applyFilters=(selection:FilterSelection)=>navigate({type:(selection.type?.[0] as DecisionQueue['query']['type'])||null,state:(selection.state?.[0] as 'READY')||null,due:(selection.due?.[0] as DecisionQueue['query']['due'])||null});
 const applySort=(selection:SortSelection)=>navigate({sort:selection.by==='submitted'?'submitted':'due',order:selection.order==='descending'?'desc':'asc'});
 return <>
  <ListToolbar attributes={[{value:'reference',label:'Request reference',placeholder:'Enter exact COORD reference'}]} selectedAttribute="reference" draftText={draft} appliedSearch={queue.query.reference??''} onAttributeChange={()=>{}} onDraftTextChange={setDraft} onCommitSearch={reference=>navigate({reference:reference||null})} filterCount={filterCount} onOpenFilters={()=>setFilterOpen(true)} sortSummary={`${queue.query.sort==='due'?'Due time':'Submitted time'} · ${queue.query.order==='asc'?'Ascending':'Descending'}`} onOpenSort={()=>setSortOpen(true)} busy={pending} inputLabel="Search exact request reference" maximumLength={80}/>
  <FilterDrawer key={`${queue.query.type}-${queue.query.state}-${queue.query.due}`} open={filterOpen} onClose={()=>setFilterOpen(false)} attributes={[{id:'type',label:'Decision type',mode:'single',options:queue.filters.types},{id:'state',label:'State',mode:'single',options:queue.filters.states},{id:'due',label:'Due period',mode:'single',options:queue.filters.duePeriods}]} applied={{type:queue.query.type?[queue.query.type]:[],state:queue.query.state?[queue.query.state]:[],due:queue.query.due?[queue.query.due]:[]}} onApply={applyFilters} title="Filters" description="Limit only the decisions exposed by the current owner adapters."/>
  <SortDrawer key={`${queue.query.sort}-${queue.query.order}`} open={sortOpen} onClose={()=>setSortOpen(false)} options={[{value:'due',label:'Due time'},{value:'submitted',label:'Submitted time'}]} applied={{by:queue.query.sort,order:queue.query.order==='asc'?'ascending':'descending'}} onApply={applySort}/>
 </>;
}
