'use client';

import {useState} from 'react';
import type {TimetableDraftContext,TimetablePatternContext} from '@/shared/contracts/timetable';
import {Button,PageHeader} from '@/components/ui/primitives';
import {TimetableDraftEditor} from '@/components/timetable-draft-editor';
import {TimetablePatternEditor} from '@/components/timetable-pattern-editor';

export function TimetableWorkspace({pattern,draft,schoolName}:{pattern:TimetablePatternContext;draft:TimetableDraftContext;schoolName:string}){
 const [schoolDay,setSchoolDay]=useState(false);
 return <div className="timetable-workspace">
  {schoolDay?<>
   <PageHeader title="School day & effective date" description="Set teaching days, periods and breaks for this branch." actions={<Button variant="secondary" onClick={()=>setSchoolDay(false)}>Back to timetable</Button>}/>
   <TimetablePatternEditor initial={pattern} schoolName={schoolName} showHeader={false}/>
  </>:<TimetableDraftEditor initial={draft} schoolName={schoolName} onOpenSchoolDay={()=>setSchoolDay(true)}/>}
 </div>;
}
