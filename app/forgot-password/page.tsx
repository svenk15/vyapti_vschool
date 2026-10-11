import {ForgotPasswordForm} from "@/components/password-reset";
import {AuthLayout} from '@/components/auth-layout';
export const dynamic="force-dynamic";
export default function ForgotPasswordPage(){return <AuthLayout eyebrow="Account recovery" title="Activate or recover an account" description="Choose the help you need. Public responses never reveal whether an account exists."><ForgotPasswordForm/></AuthLayout>;}
