'use client';
import {useRouter,useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/primitives';
import {AttendanceDatePicker} from './date-picker';
import {AttendanceIcon} from './ui';
import {shiftDay} from './presentation';
export function AttendanceDayControl({date,today}:{date:string;today:string}){const router=useRouter(),params=useSearchParams();function go(value:string){const p=new URLSearchParams(params);p.set('view','monitor');p.set('date',value);p.delete('page');router.push('/admin/attendance/sessions?'+p);}return <div className="att-day-control"><Button variant="ghost" size="icon" aria-label="Previous date" onClick={()=>go(shiftDay(date,-1))}><AttendanceIcon name="left"/></Button><AttendanceDatePicker from={date} to={date} today={today} onApply={go}/><Button variant="ghost" size="icon" aria-label="Next date" onClick={()=>go(shiftDay(date,1))}><AttendanceIcon name="right"/></Button><Button variant="ghost" size="small" onClick={()=>go(today)}>Today</Button></div>;}
