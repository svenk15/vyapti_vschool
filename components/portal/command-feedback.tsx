'use client';
import type {CommandFeedbackState} from '@/shared/contracts/portal';
import {Alert,Button} from '@/components/ui/primitives';

export function CommandFeedback({state,onCheckStatus,onRetrySame}:{state:CommandFeedbackState;onCheckStatus?:()=>void;onRetrySame?:()=>void}){
 if(state.kind==='idle')return null;
 if(state.kind==='submitting')return <Alert title="Saving change">Keep this page open while the request is confirmed.</Alert>;
 if(state.kind==='confirmed')return <Alert tone="success" title="Change confirmed">The server confirmed this request{state.receiptId?` in receipt ${state.receiptId}`:''}.</Alert>;
 if(state.kind==='unknown')return <Alert tone="warning" title="The outcome is not known"><p>The request may have committed. Keep this request key and check its status before trying again.</p><p className="command-key"><span>Request key</span> <code>{state.commandKey}</code></p><div className="button-row">{onCheckStatus&&<Button variant="secondary" onClick={onCheckStatus}>Check status</Button>}{onRetrySame&&<Button onClick={onRetrySame}>Retry same request</Button>}</div></Alert>;
 if(state.kind==='invalid')return <Alert tone="danger" title="Check the highlighted information"><ul className="feedback-fields">{Object.entries(state.fields).map(([field,message])=><li key={field}><strong>{field}</strong>: {message}</li>)}</ul></Alert>;
 return <Alert tone={state.kind==='denied'?'danger':'warning'} title={state.kind==='denied'?'Permission changed':'Review the latest record'}>{state.message}</Alert>;
}
