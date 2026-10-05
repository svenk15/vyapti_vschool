import {ForgotPasswordForm} from "@/components/password-reset";
import {AuthLayout} from '@/components/auth-layout';
export const dynamic="force-dynamic";
export default function ForgotPasswordPage(){return <AuthLayout eyebrow="Account recovery" title="Reset your password" description="Enter the email address you use to sign in. If it matches an account, we’ll send a private reset link."><ForgotPasswordForm/></AuthLayout>;}
