'use client';

import {useState} from 'react';
import type {TimetableDraftContext,TimetablePatternContext} from '@/shared/contracts/timetable';
import {Button,PageHeader} from '@/components/ui/primitives';
import {TimetableDraftEditor} from '@/components/timetable-draft-editor';
import {TimetablePatternEditor} from '@/components/timetable-pattern-editor';

export function TimetableWorkspace({pattern,draft,schoolName}:{pattern:TimetablePatternContext;draft:TimetableDraftContext;schoolName:string}){
 const [schoolDay,setSchoolDay]=useState(false),[reviewing,setReviewing]=useState(false);
 return <div className="timetable-workspace">
  {!reviewing&&<PageHeader eyebrow={schoolName} title="Timetable & daily changes" description="A clear plan for every class. Keep daily changes separate from the weekly timetable."/>}
  {schoolDay?<>
   <div className="timetable-view-actions"><Button variant="secondary" onClick={()=>setSchoolDay(false)}>Back to weekly draft</Button></div>
   <TimetablePatternEditor initial={pattern} schoolName={schoolName} showHeader={false}/>
  </>:<TimetableDraftEditor initial={draft} onOpenSchoolDay={()=>setSchoolDay(true)} onReviewModeChange={setReviewing}/>}
 </div>;
}
