import { AccessLogin } from "@/components/access-login";
import {AuthLayout} from '@/components/auth-layout';
export default function SignInPage(){return <AuthLayout eyebrow="School workspace" title="Sign in to your school" description="Use the account provided by your school."><AccessLogin/></AuthLayout>;}
