import { AccountActivation } from "@/components/account-activation";
import {AuthLayout} from '@/components/auth-layout';
export default function ActivationPage(){return <AuthLayout eyebrow="Account activation" title="Activate your account" description="Use the private activation link provided for your school."><AccountActivation/></AuthLayout>;}
