import {ResetPasswordForm} from "@/components/password-reset";
import {AuthLayout} from '@/components/auth-layout';
export const dynamic="force-dynamic";
export default function ResetPasswordPage(){return <AuthLayout eyebrow="Account recovery" title="Choose a new password" description="Save a new password. Other signed-in sessions will end; your school access remains unchanged."><ResetPasswordForm/></AuthLayout>;}
