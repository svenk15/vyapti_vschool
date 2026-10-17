import {redirect} from 'next/navigation';
import {Alert,Breadcrumbs,PageHeader,PageStack} from '@/components/ui/primitives';
import {CommunicationReminderFlow} from '@/components/communication-reminder-flow';
import {getIdentity} from '@/lib/server/auth';
import {communicationGateway} from '@/lib/server/communication';

export const dynamic='force-dynamic';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]:value;
export default async function CommunicationReminderPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const noticeId=(await params).id,versionId=first((await searchParams).version),preview=versionId?await communicationGateway.previewAcknowledgementReminder(identity,noticeId,versionId).catch(()=>null):null;return <main id="main-content" className="container page-space"><PageStack className="communication-reminder-page"><Breadcrumbs items={[{label:'Notice coverage',href:'/leadership/communication'},{label:'Acknowledgement reminder'}]}/><PageHeader eyebrow="Communication oversight" title="Send portal reminder" description="Recheck the exact publication and current eligible unacknowledged audience before creating a durable in-app reminder."/>{preview?<CommunicationReminderFlow preview={preview}/>:<Alert tone="danger" title="Reminder unavailable">The publication, current authority or reminder designation could not be verified. Return to notice coverage and refresh.</Alert>}</PageStack></main>}
