'use client';

import {useRef, useState} from 'react';
import {Alert, Button, Card, PageHeader, SectionHeader} from '@/components/ui/primitives';
import {SelectField, TextField} from '@/components/ui/forms';
import type {SaveTimetablePattern, TimetablePatternContext, TimetablePeriodKind} from '@/shared/contracts/timetable';

type Row = {periodKey:string;label:string;kind:TimetablePeriodKind;startLocal:string;endLocal:string;position:number};
const fresh = ():Row => ({periodKey:crypto.randomUUID(),label:'',kind:'LESSON',startLocal:'09:00',endLocal:'09:40',position:1});

export function TimetablePatternEditor({initial,schoolName}:{initial:TimetablePatternContext;schoolName:string}) {
  const [context,setContext]=useState(initial);
  const [yearId,setYearId]=useState(initial.pattern?.academicYearId??initial.years[0]?.id??'');
  const [name,setName]=useState(initial.pattern?.name??'Weekly timetable');
  const [days,setDays]=useState<number[]>(initial.pattern?[...initial.pattern.teachingDays]:[1,2,3,4,5]);
  const [rows,setRows]=useState<Row[]>(initial.pattern?.periods.map(({periodKey,label,kind,startLocal,endLocal,position})=>({periodKey,label,kind,startLocal,endLocal,position}))??[fresh()]);
  const [busy,setBusy]=useState(false);
  const [retrying,setRetrying]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  const attempt=useRef<SaveTimetablePattern|null>(null);
  const normalize=(values:Row[])=>values.map((row,index)=>({...row,position:index+1}));

  async function load(id:string) {
    setBusy(true); setError('');
    try {
      const response=await fetch(`/api/v1/timetable/day-patterns/current?academicYearId=${encodeURIComponent(id)}`,{cache:'no-store'});
      const value=await response.json();
      if(!response.ok) throw new Error(value.message);
      setContext(value); setName(value.pattern?.name??'Weekly timetable');
      setDays(value.pattern?[...value.pattern.teachingDays]:[1,2,3,4,5]);
      setRows(value.pattern?.periods.map(({periodKey,label,kind,startLocal,endLocal,position}:Row)=>({periodKey,label,kind,startLocal,endLocal,position}))??[fresh()]);
      attempt.current=null; setRetrying(false);
    } catch(cause) {
      setError(cause instanceof Error?cause.message:'Unable to load the selected year.');
    } finally {setBusy(false);}
  }

  async function save() {
    const payload=attempt.current??{academicYearId:yearId,expectedVersion:context.pattern?.version??0,name,teachingDays:days,periods:normalize(rows),key:crypto.randomUUID(),reason:'Save timetable day pattern'};
    setBusy(true); setError(''); setMessage('');
    try {
      const response=await fetch('/api/v1/timetable/day-patterns/current',{method:'PUT',headers:{'Content-Type':'application/json','Idempotency-Key':payload.key},body:JSON.stringify(payload)});
      const value=await response.json();
      if(!response.ok) throw Object.assign(new Error(value.message),{status:response.status});
      attempt.current=null; setRetrying(false); setContext({...context,pattern:value}); setRows(normalize(rows));
      setMessage(value.replayed?'The original save was confirmed.':`Draft version ${value.version} saved.`);
    } catch(cause) {
      const failure=cause as {status?:number;message?:string};
      if(!failure.status||failure.status>=500) {attempt.current=payload;setRetrying(true);setError('The outcome is unknown. Retry the exact retained save.');}
      else {attempt.current=null;setRetrying(false);setError(failure.message??'The draft could not be saved.');}
    } finally {setBusy(false);}
  }

  return <div className="timetable-pattern-editor">
    <PageHeader eyebrow={schoolName} title="Timetable & daily changes" description="Set the teaching week and the ordered periods used when building this branch’s timetable."/>
    {error&&<Alert tone="danger" title="Draft not saved">{error}</Alert>}
    {message&&<Alert tone="success" title="Draft saved">{message}</Alert>}
    <Card className="padded timetable-pattern-card">
      <SectionHeader title="School day" description={`Times use the branch timezone (${context.timezone}). Periods may touch but cannot overlap.`}/>
      <div className="timetable-pattern-settings">
        <SelectField label="Academic year" value={yearId} disabled={busy} onChange={event=>{setYearId(event.target.value);void load(event.target.value);}}>
          {context.years.map(year=><option key={year.id} value={year.id}>{year.code} · {year.name}</option>)}
        </SelectField>
        <TextField label="Pattern name" required maxLength={80} value={name} onChange={event=>setName(event.target.value)}/>
      </div>
      <fieldset className="weekday-fieldset timetable-weekdays"><legend>Teaching days</legend>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((label,index)=><label key={label}><input type="checkbox" checked={days.includes(index+1)} onChange={event=>setDays(event.target.checked?[...days,index+1].sort():days.filter(day=>day!==index+1))}/>{label}</label>)}
      </fieldset>
      <div className="timetable-period-heading"><div><h3>Periods & breaks</h3><p>At least one lesson is required. Breaks remain visible in the daily structure.</p></div>
        <Button variant="secondary" disabled={rows.length>=32||busy} onClick={()=>setRows([...normalize(rows),{...fresh(),position:rows.length+1}])}>Add period</Button>
      </div>
      <div className="timetable-period-list">{rows.map((row,index)=><div className="timetable-period-row" key={row.periodKey}>
        <TextField label={`Period ${index+1} label`} required maxLength={60} value={row.label} onChange={event=>setRows(rows.map((value,position)=>position===index?{...value,label:event.target.value}:value))}/>
        <SelectField label="Kind" value={row.kind} onChange={event=>setRows(rows.map((value,position)=>position===index?{...value,kind:event.target.value as TimetablePeriodKind}:value))}><option value="LESSON">Lesson</option><option value="BREAK">Break</option></SelectField>
        <TextField label="Starts" type="time" required value={row.startLocal} onChange={event=>setRows(rows.map((value,position)=>position===index?{...value,startLocal:event.target.value}:value))}/>
        <TextField label="Ends" type="time" required value={row.endLocal} onChange={event=>setRows(rows.map((value,position)=>position===index?{...value,endLocal:event.target.value}:value))}/>
        <Button variant="ghost" disabled={rows.length===1||busy} onClick={()=>setRows(normalize(rows.filter((_,position)=>position!==index)))}>Remove</Button>
      </div>)}</div>
      <div className="form-actions timetable-pattern-actions"><p>Publication and session generation are separate later steps.</p><Button loading={busy} disabled={busy||!yearId||!name.trim()||!days.length} onClick={()=>void save()}>{retrying?'Retry same save':'Save draft'}</Button></div>
    </Card>
  </div>;
}
