'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import type {NoticeAttachment, NoticeProposalCommandResult, NoticeProposalDetail} from '@/shared/contracts/communication';
import type {DocumentPromotionResult, DocumentUploadResult} from '@/shared/contracts/documents';
import {Alert, Badge, Button, Card, PageHeader, SectionHeader, Stepper} from '@/components/ui/primitives';
import {SelectField, TextArea, TextField} from '@/components/ui/forms';

type Section = {id: string; name: string; gradeName: string};
type AttachmentState = 'IDLE' | 'SCANNING' | 'READY' | 'BLOCKED' | 'UNAVAILABLE' | 'INVALID';

async function responseBody<T>(response: Response, fallback: string): Promise<T> {
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? fallback);
  return body as T;
}

async function sha256(file: File) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function NoticeProposalAuthorFlow({sections, schoolName, initial}: {sections: readonly Section[]; schoolName: string; initial?: NoticeProposalDetail}) {
  const [stage, setStage] = useState(initial?.status === 'APPROVED' ? 2 : 0);
  const [saved, setSaved] = useState(initial);
  const [sectionId, setSectionId] = useState(initial?.revision.sectionId ?? sections[0]?.id ?? '');
  const [title, setTitle] = useState(initial?.revision.title ?? '');
  const [body, setBody] = useState(initial?.revision.body ?? '');
  const [requiresAck, setRequiresAck] = useState(initial?.revision.requiresAcknowledgement ?? true);
  const [attachments, setAttachments] = useState<readonly NoticeAttachment[]>(initial?.revision.attachments ?? []);
  const [attachmentState, setAttachmentState] = useState<AttachmentState>('IDLE');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const intent = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = sections.find(row => row.id === sectionId);
  const editable = !saved || saved.status === 'DRAFT' || saved.status === 'RETURNED';
  const valid = Boolean(selected && title.trim() && body.trim());

  useEffect(() => { heading.current?.focus(); }, [stage]);
  const move = (next: number) => { setStage(next); setError(''); };

  function localDetail(result: NoticeProposalCommandResult, nextAttachments: readonly NoticeAttachment[]): NoticeProposalDetail {
    return {...saved, ...result, updatedAt: new Date().toISOString(), title, audienceLabel: selected ? `${selected.gradeName} · ${selected.name}` : 'Class', revision: {revisionId: result.revisionId, number: result.revisionNumber, sectionId, audienceLabel: selected ? `${selected.gradeName} · ${selected.name}` : 'Class', title, body, requiresAcknowledgement: requiresAck, attachments: nextAttachments, channel: 'PORTAL', scheduleKind: 'IMMEDIATE', approvalDigest: 'server-confirmed', createdAt: new Date().toISOString()}, decision: saved?.decision ?? null, availableActions: ['EDIT', 'SUBMIT']} as NoticeProposalDetail;
  }

  async function save(continueFlow = false, nextAttachments: readonly NoticeAttachment[] = attachments) {
    setBusy(true); setError(''); intent.current ??= crypto.randomUUID();
    try {
      const result = await responseBody<NoticeProposalCommandResult>(await fetch(saved ? `/api/v1/communication/proposals/${saved.proposalId}` : '/api/v1/communication/proposals', {method: saved ? 'PUT' : 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({expectedVersion: saved?.version ?? 0, sectionId, title, body, requiresAcknowledgement: requiresAck, attachments: nextAttachments.map(({versionId, grantId}) => ({versionId, grantId})), key: intent.current})}), 'The notice proposal could not be changed.');
      intent.current = null; setAttachments(nextAttachments); setSaved(localDetail(result, nextAttachments)); setMessage('Draft saved. Nothing was published or sent.'); if (continueFlow) move(1); return result;
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The draft could not be saved.'); return null; }
    finally { setBusy(false); }
  }

  async function uploadAttachment(file: File | undefined) {
    if (!file || !saved) return;
    setBusy(true); setError(''); setMessage(''); setAttachmentState('SCANNING');
    try {
      const data = new FormData();
      data.set('file', file); data.set('filename', file.name); data.set('mediaType', file.type); data.set('sha256', await sha256(file)); data.set('key', crypto.randomUUID());
      data.set('ownerModule', 'communication'); data.set('ownerResourceType', 'NoticeProposal'); data.set('ownerResourceId', saved.proposalId); data.set('purpose', 'NOTICE_ATTACHMENT');
      const upload = await responseBody<DocumentUploadResult>(await fetch('/api/v1/documents/uploads', {method: 'POST', body: data}), 'The attachment could not be scanned.');
      if (upload.state !== 'READY') {
        setAttachmentState(upload.state === 'BLOCKED' ? 'BLOCKED' : upload.state === 'INVALID' ? 'INVALID' : 'UNAVAILABLE');
        setError(upload.state === 'BLOCKED' ? 'The scanner rejected this attachment. It was not linked.' : upload.state === 'INVALID' ? 'The file content did not match its declared type, size or digest.' : 'Safety scanning is unavailable. The attachment remains quarantined and cannot be linked.');
        return;
      }
      const promoted = await responseBody<DocumentPromotionResult>(await fetch(`/api/v1/documents/uploads/${upload.uploadId}/promote`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({classification: 'NOTICE_ATTACHMENT', key: crypto.randomUUID()})}), 'The scanned attachment could not be linked.');
      const next = [...attachments, {versionId: promoted.versionId, grantId: promoted.grantId, filename: file.name}];
      intent.current = null;
      const linked = await save(false, next);
      if (linked) { setAttachmentState('READY'); setMessage(`${file.name} passed the configured scanner and is linked to revision ${linked.revisionNumber}.`); }
    } catch (cause) { setAttachmentState('UNAVAILABLE'); setError(cause instanceof Error ? cause.message : 'The attachment could not be processed.'); }
    finally { setBusy(false); }
  }

  async function removeAttachment(versionId: string) {
    intent.current = null;
    const result = await save(false, attachments.filter(item => item.versionId !== versionId));
    if (result) setMessage(`Attachment removed from revision ${result.revisionNumber}. The previous review digest no longer applies.`);
  }

  async function submit() {
    if (!saved) return; setBusy(true); setError('');
    try { const result = await responseBody<NoticeProposalCommandResult>(await fetch(`/api/v1/communication/proposals/${saved.proposalId}/submit`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({expectedVersion: saved.version, revisionId: saved.revisionId, key: crypto.randomUUID()})}), 'The proposal could not be submitted.'); setSaved({...saved, ...result, availableActions: []}); setMessage('Submitted to the independently configured reviewer. Nothing was published or sent.'); move(2); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'The proposal could not be submitted.'); }
    finally { setBusy(false); }
  }

  async function publish() {
    if (!saved) return; setBusy(true); setError('');
    try { const result = await responseBody<NoticeProposalCommandResult>(await fetch(`/api/v1/communication/proposals/${saved.proposalId}/publish`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({expectedVersion: saved.version, revisionId: saved.revisionId, key: crypto.randomUUID()})}), 'The approved proposal could not be published.'); setSaved({...saved, ...result, availableActions: []}); setMessage(`Published to ${result.recipientCount ?? 0} currently eligible portal account${result.recipientCount === 1 ? '' : 's'}.`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'The approved proposal could not be published.'); }
    finally { setBusy(false); }
  }

  if (saved && !editable && saved.status !== 'APPROVED') return <div className="notice-compose-page"><PageHeader title={saved.status === 'PUBLISHED' ? 'Notice published' : saved.status === 'IN_REVIEW' ? 'Notice awaiting review' : saved.status === 'REJECTED' ? 'Notice rejected' : 'Notice proposal'} description={`${schoolName} · Revision ${saved.revisionNumber}`}/><Card className="padded"><Badge tone={saved.status === 'PUBLISHED' ? 'success' : saved.status === 'REJECTED' ? 'danger' : 'warning'}>{saved.status.replace('_', ' ')}</Badge><h2>{saved.title}</h2><p>{saved.audienceLabel} · {attachments.length} secure attachment{attachments.length === 1 ? '' : 's'} · Portal only</p>{message && <Alert tone="success" title="Proposal updated">{message}</Alert>}<Link className="btn btn-secondary btn-normal" href="/admin/communication">Return to Communication</Link></Card></div>;

  return <div className="notice-compose-page"><PageHeader title={saved ? 'Continue notice proposal' : 'Prepare a notice proposal'} description={`${schoolName} · Portal publication with private scanned attachments`}/><Stepper steps={['Message & audience', 'Review', 'Submit or publish']} current={stage}/><div className="branch-edit-grid"><Card className="padded branch-edit-card"><h2 ref={heading} tabIndex={-1}>{stage === 0 ? 'Notice details' : stage === 1 ? 'Review exact revision' : saved?.status === 'APPROVED' ? 'Publish approved revision' : 'Submit for independent review'}</h2>{error && <Alert tone="danger" title="Proposal not changed" onDismiss={() => setError('')}>{error}</Alert>}{message && <Alert tone="success" title="Proposal status" onDismiss={() => setMessage('')}>{message}</Alert>}{saved?.status === 'RETURNED' && saved.decision && <Alert tone="warning" title="Returned for changes">{saved.decision.reason}</Alert>}
    {stage === 0 && <div className="settings-form"><SelectField label="Class audience" value={sectionId} onChange={event => { setSectionId(event.target.value); intent.current = null; }}>{sections.map(row => <option key={row.id} value={row.id}>{row.gradeName} · {row.name}</option>)}</SelectField><TextField label="Subject" required maxLength={120} value={title} onChange={event => { setTitle(event.target.value); intent.current = null; }}/><TextArea label="Message" required maxLength={10000} value={body} onChange={event => { setBody(event.target.value); intent.current = null; }}/><label className="check-row"><input type="checkbox" checked={requiresAck} onChange={event => { setRequiresAck(event.target.checked); intent.current = null; }}/><span>Ask recipients to acknowledge this exact version</span></label>
      <section className="notice-attachment-panel"><SectionHeader title="Secure attachments" description="PDF, JPEG or PNG · up to 2 MiB · maximum 5"/>{!saved && <Alert title="Save the notice first">Save this draft to establish its protected owner before adding an attachment.</Alert>}{attachments.length > 0 && <ul className="notice-attachment-list">{attachments.map(item => <li key={item.versionId}><span aria-hidden="true">📎</span><span><strong>{item.filename}</strong><small>Scanned, immutable version</small></span><Button variant="secondary" disabled={busy} onClick={() => void removeAttachment(item.versionId)}>Remove</Button></li>)}</ul>}{saved && attachments.length < 5 && <label className={`notice-upload-control${busy ? ' is-disabled' : ''}`}><span>{attachmentState === 'SCANNING' ? 'Scanning exact file bytes…' : 'Choose and scan attachment'}</span><input type="file" accept="application/pdf,image/jpeg,image/png" disabled={busy} onChange={event => { void uploadAttachment(event.target.files?.[0]); event.currentTarget.value = ''; }}/></label>}{attachmentState === 'BLOCKED' && <p className="small status-danger">Rejected files remain unavailable and cannot be published.</p>}{attachmentState === 'UNAVAILABLE' && <p className="small muted">The file remains quarantined while scanning is unavailable.</p>}</section>
      <div className="workflow-actions"><Link className="btn btn-secondary btn-normal" href="/admin/communication">Cancel</Link><Button variant="secondary" loading={busy} disabled={!valid} onClick={() => void save(false)}>Save draft</Button><Button loading={busy} disabled={!valid} onClick={() => void save(true)}>Save and continue <span aria-hidden="true">→</span></Button></div></div>}
    {stage === 1 && <><dl className="record-facts"><div><dt>Subject</dt><dd>{title}</dd></div><div><dt>Audience rule</dt><dd>{selected ? `${selected.gradeName} · ${selected.name}` : 'Unavailable'}</dd></div><div><dt>Channel</dt><dd>Portal only</dd></div><div><dt>Schedule</dt><dd>Immediate after authorized publication</dd></div><div><dt>Attachments</dt><dd>{attachments.length ? attachments.map(item => item.filename).join(', ') : 'None'}</dd></div><div><dt>Acknowledgement</dt><dd>{requiresAck ? 'Requested' : 'Not requested'}</dd></div></dl><section className="notice-message-preview"><h3>Message</h3><p>{body}</p></section><Alert title="Exact revision">Any later content, audience or attachment edit creates a new immutable revision and requires another review.</Alert><div className="workflow-actions"><Button variant="secondary" onClick={() => move(0)}>Back</Button><Button onClick={() => move(2)}>Continue <span aria-hidden="true">→</span></Button></div></>}
    {stage === 2 && saved?.status === 'APPROVED' ? <><Alert tone="success" title="Independent review approved">Publication rechecks your PUBLISH designation, this exact attachment digest and the current eligible portal audience. Approval itself sent nothing.</Alert><div className="workflow-actions"><Button variant="secondary" onClick={() => move(1)}>Back</Button><Button loading={busy} onClick={() => void publish()}>Publish approved revision</Button></div></> : stage === 2 && <><Alert title="Final submission">Submit revision {saved?.revisionNumber}. The server assigns the independently configured reviewer; this action publishes nothing.</Alert><div className="workflow-actions"><Button variant="secondary" onClick={() => move(1)}>Back</Button><Button loading={busy} disabled={!saved} onClick={() => void submit()}>Submit for review</Button></div></>}
    </Card><aside className="branch-edit-aside"><Card className="padded"><SectionHeader title="Separated authority"/><p>The author prepares and submits. The assigned reviewer approves an exact digest. A separately designated publisher performs the final portal publication.</p></Card><Card className="padded"><h3>Private files</h3><p className="small muted">Attachments remain private, fail closed unless the configured scanner returns CLEAN for the exact bytes, and are reauthorized on every download.</p></Card></aside></div></div>;
}
