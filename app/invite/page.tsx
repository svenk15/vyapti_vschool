import {StaffInviteAcceptanceForm} from "@/components/password-reset";
import {AuthLayout} from '@/components/auth-layout';
export const dynamic="force-dynamic";
export default function StaffInvitePage(){return <AuthLayout eyebrow="Staff invitation" title="Accept your school invitation" description="Confirm this invitation to activate the access assigned by your school."><StaffInviteAcceptanceForm/></AuthLayout>;}
