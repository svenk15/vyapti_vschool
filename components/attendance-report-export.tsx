'use client';
import {useState} from 'react';
import {Alert,Button} from '@/components/ui/primitives';

type Filters=Readonly<{fromDate:string;toDate:string;yearId:string|null;sectionId:string|null;subjectId:string|null}>;

export function AttendanceReportExport({filters}:{filters:Filters}){
 const [pending,setPending]=useState(false),[error,setError]=useState<string>();
 async function download(){
  setPending(true);setError(undefined);
  const query=new URLSearchParams({fromDate:filters.fromDate,toDate:filters.toDate});
  if(filters.yearId)query.set('yearId',filters.yearId);if(filters.sectionId)query.set('sectionId',filters.sectionId);if(filters.subjectId)query.set('subjectId',filters.subjectId);
  try{
   const response=await fetch(`/api/v1/reports/attendance.csv?${query}`,{credentials:'same-origin',cache:'no-store'});
   if(!response.ok){const body=await response.json().catch(()=>null) as {message?:string}|null;throw new Error(body?.message??'The attendance export could not be prepared.');}
   const disposition=response.headers.get('content-disposition')??'',filename=/filename="([^"]+)"/.exec(disposition)?.[1]??`attendance-report-${filters.fromDate}-${filters.toDate}.csv`,url=URL.createObjectURL(await response.blob()),anchor=document.createElement('a');
   anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
  }catch(cause){setError(cause instanceof Error?cause.message:'The attendance export could not be prepared.');}
  finally{setPending(false);}
 }
 return <div className="report-export-action"><Button variant="secondary" onClick={download} loading={pending}>Download submitted CSV</Button>{error&&<Alert tone="danger" title="Export unavailable">{error} Your selected filters have been kept.</Alert>}</div>;
}
