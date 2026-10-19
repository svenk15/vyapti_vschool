import type {AttendanceSessionRecord} from '@/shared/contracts/attendance';
import {Badge,Button,ButtonLink,Card,EmptyState,SectionHeader} from '@/components/ui/primitives';
import {SelectField,TextField} from '@/components/ui/forms';
import {ServerTable} from '@/components/ui/server-table';

type SectionOption=Readonly<{id:string;label:string}>;
const tone=(status:AttendanceSessionRecord['status'])=>status==='SUBMITTED'?'success':status==='CANCELLED'?'neutral':status==='OPEN'?'warning':'info';

export function AttendanceAdminList({sessions,date,sectionId,sections,timezone}:{sessions:readonly AttendanceSessionRecord[];date:string;sectionId:string;sections:readonly SectionOption[];timezone:string}){return <Card id="sessions-today" className="attendance-session-directory directory-card"><SectionHeader title="Attendance sessions" description="Open a scheduled, active, submitted or canceled register in the selected scope." actions={<Badge>{sessions.length} session{sessions.length===1?'':'s'}</Badge>}/><form action="/admin/attendance/sessions" method="get" className="compact-toolbar attendance-monitor-toolbar"><input type="hidden" name="view" value="monitor"/><TextField label="School date" name="date" type="date" required defaultValue={date}/><SelectField label="Class" name="section" defaultValue={sectionId}><option value="">All classes</option>{sections.map(section=><option key={section.id} value={section.id}>{section.label}</option>)}</SelectField><Button type="submit">Apply filters</Button></form>{sessions.length===0?<EmptyState icon="calendar" title={`No sessions on ${date}`} description="No authorized class sessions match this date and class scope."/>:<ServerTable caption={`Attendance sessions on ${date}`} rows={sessions} rowKey={session=>session.id} className="attendance-directory-table" columns={[
 {key:'time',label:'Time',render:session=><div className="attendance-session-time"><strong>{new Date(session.startsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:timezone})}</strong><span className="small muted">to {new Date(session.endsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:timezone})}</span></div>},
 {key:'subject',label:'Subject',rowHeader:true,render:session=><strong>{session.offering.subjectName}</strong>},
 {key:'class',label:'Class',render:session=>session.offering.sectionName},
 {key:'status',label:'Status',render:session=><Badge tone={tone(session.status)}>{session.status}</Badge>},
 {key:'action',label:'Actions',render:session=><ButtonLink href={`/admin/attendance/sessions/${session.id}`} variant="ghost">{session.status==='CANCELLED'?'View cancellation':session.status==='SUBMITTED'?'Review or correct':'Review or cancel'}</ButtonLink>}
 ]}/>}</Card>}
