'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/primitives';
import {Dialog} from '@/components/ui/interactive';
import {AttendanceRequestReview,type AttendanceReviewItem} from './request-review';
/** Deep links use the same decision and recovery composition as the queue drawer. */
export function AttendanceReviewPage({item}:{item:AttendanceReviewItem}){
 const router=useRouter(),[dirty,setDirty]=useState(false),[locked,setLocked]=useState(false),[discard,setDiscard]=useState(false);
 const leave=()=>{if(dirty||locked)setDiscard(true);else router.push('/admin/attendance/requests');};
 return <section className="att-workspace att-review-page"><AttendanceRequestReview initial={item} onDirty={setDirty} onLocked={setLocked} onClose={leave} onChanged={()=>router.refresh()}/><Dialog open={discard} onClose={()=>setDiscard(false)} title={locked?'Result not confirmed':'Discard entered response?'}><p>{locked?'Stay here to retry the retained request. Leaving would lose its in-memory recovery details.':'Your unsaved response will be removed.'}</p><div className="button-row"><Button onClick={()=>setDiscard(false)}>Keep reviewing</Button>{!locked&&<Button variant="secondary" onClick={()=>router.push('/admin/attendance/requests')}>Discard and leave</Button>}</div></Dialog></section>;
}
