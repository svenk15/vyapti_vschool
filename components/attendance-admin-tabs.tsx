'use client';
import type {ReactNode} from 'react';
import {AdminLocalNavigation} from './admin-local-navigation';
import {useAdminNavigationDestinations} from './admin-navigation-context';
type AttendanceView='sessions'|'corrections'|'explanations'|'requests'|'reports';
export function AttendanceAdminTabs({active,action}:{active?:AttendanceView;action?:ReactNode}){const destinations=useAdminNavigationDestinations(),has=(href:string)=>destinations.some(d=>d.href===href),items=[...(has('/admin/attendance/sessions?view=monitor')?[{label:'Registers',href:'/admin/attendance/sessions?view=monitor'}]:[]),...(has('/admin/attendance/explanations')||has('/admin/attendance/correction-requests')?[{label:'Requests',href:'/admin/attendance/requests'}]:[]),...(has('/admin/reports/attendance')?[{label:'Reports',href:'/admin/reports/attendance'}]:[])];return <AdminLocalNavigation label="Attendance destinations" items={items} action={action} current={active==='sessions'?'/admin/attendance/sessions?view=monitor':active==='reports'?'/admin/reports/attendance':'/admin/attendance/requests'}/>;}
