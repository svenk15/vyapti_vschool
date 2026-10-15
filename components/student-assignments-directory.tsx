'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState,useTransition} from 'react';
import type {LearningAssignmentPage,LearningAssignmentSearchBy,LearningAssignmentSort,LearningAssignmentOrder} from '@/shared/contracts/learning';
import {ListToolbar} from './portal/list-toolbar';
import {SortDrawer,type SortSelection} from './portal/sort-drawer';
import {Badge,Button,Card,EmptyState} from './ui/primitives';

type Query={q:string;by:LearningAssignmentSearchBy;sort:LearningAssignmentSort;order:LearningAssignmentOrder;cursor:string};
export function StudentAssignmentsDirectory({page,studentId,timezone,query}:{page:LearningAssignmentPage;studentId:string;timezone:string;query:Query}){
 const router=useRouter(),[pending,startTransition]=useTransition(),[draft,setDraft]=useState(query.q),[by,setBy]=useState<LearningAssignmentSearchBy>(query.by),[sortOpen,setSortOpen]=useState(false),date=(value:string)=>new Intl.DateTimeFormat('en-GB',{timeZone:timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
 function href(next:Partial<Query>){const value={...query,...next},params=new URLSearchParams({student:studentId});if(value.q)params.set('q',value.q);if(value.q||value.by!=='title')params.set('by',value.by);if(value.sort!=='due')params.set('sort',value.sort);if(value.order!=='asc')params.set('order',value.order);if(value.cursor)params.set('cursor',value.cursor);return `/student/assignments?${params}`;}
 function navigate(next:Partial<Query>){startTransition(()=>router.push(href({...next,cursor:''})));}
 function applySort(selection:SortSelection){const sort:LearningAssignmentSort=selection.by==='title'||selection.by==='subject'?selection.by:'due';navigate({sort,order:selection.order==='descending'?'desc':'asc'});}
 const sortLabel=query.sort==='title'?'Assignment name':query.sort==='subject'?'Subject':'Due date';
 return <>
  <ListToolbar attributes={[{value:'title',label:'Assignment name',placeholder:'Enter assignment name'},{value:'subject',label:'Subject',placeholder:'Enter subject'}]} selectedAttribute={by} draftText={draft} appliedSearch={query.q} onAttributeChange={value=>setBy(value==='subject'?'subject':'title')} onDraftTextChange={setDraft} onCommitSearch={q=>navigate({q,by})} sortSummary={`${sortLabel} · ${query.order==='desc'?'Descending':'Ascending'}`} onOpenSort={()=>setSortOpen(true)} busy={pending} inputLabel="Search assignments"/>
  {page.items.length?<Card className="student-assignment-table"><div className="table-scroll" tabIndex={0} role="region" aria-label="Published assignments"><table><caption className="sr-only">Published assignments in your current school</caption><thead><tr><th scope="col">Assignment</th><th scope="col">Due</th><th scope="col">Status</th><th scope="col" className="action-col">View</th></tr></thead><tbody>{page.items.map(row=><tr key={row.id}><th scope="row"><strong>{row.title}</strong><span>{row.offering.subject} · {row.offering.classLabel}</span></th><td data-label="Due">{date(row.dueAt)}</td><td data-label="Status"><Badge tone={new Date(row.dueAt)>new Date()?'warning':'neutral'}>{new Date(row.dueAt)>new Date()?'To do':'Published'}</Badge></td><td className="action-col"><Link href={`/student/assignments/${row.id}?student=${encodeURIComponent(studentId)}`}>Open <span aria-hidden="true">→</span></Link></td></tr>)}</tbody></table></div></Card>:<Card><EmptyState icon="document" title={query.q?'No assignments match':'No published assignments'} description={query.q?'Change your search or clear it.':'Assignments published to your exact class and Student access will appear here.'} action={query.q?<Button variant="secondary" onClick={()=>{setDraft('');navigate({q:''});}}>Clear search</Button>:undefined}/></Card>}
  <div className="student-assignment-pagination"><span className="small muted">{page.items.length} authorized result{page.items.length===1?'':'s'} on this page</span>{page.nextCursor&&<Link className="btn btn-secondary btn-small" href={href({cursor:page.nextCursor})}>Next results <span aria-hidden="true">→</span></Link>}</div>
  <SortDrawer open={sortOpen} onClose={()=>setSortOpen(false)} options={[{value:'due',label:'Due date'},{value:'title',label:'Assignment name'},{value:'subject',label:'Subject'}]} applied={{by:query.sort,order:query.order==='desc'?'descending':'ascending'}} onApply={applySort}/>
 </>;
}
