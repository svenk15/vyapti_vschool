'use client';

import {useEffect, useRef, useState} from 'react';
import {Alert, Button, Card, PageHeader, SectionHeader, Stepper} from './ui/primitives';
import {SelectField, TextArea, TextField} from './ui/forms';

type Section = {id: string; name: string; gradeName: string};

export function NoticePublishFlow({sections, schoolName}: {sections: readonly Section[]; schoolName: string}) {
  const [step, setStep] = useState(0);
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [requiresAck, setRequiresAck] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{noticeId: string; recipientCount: number} | null>(null);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const publishKey = useRef<string | null>(null);

  useEffect(() => { heading.current?.focus(); }, []);

  const invalidatePublishIntent = () => { publishKey.current = null; };
  const move = (next: number) => {
    setError('');
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const publish = async () => {
    setBusy(true);
    setError('');
    publishKey.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/v1/communication/notices', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({sectionId, title, body, requiresAcknowledgement: requiresAck, key: publishKey.current}),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'Notice could not be published.');
      setResult(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Notice could not be published.');
    } finally {
      setBusy(false);
    }
  };

  if (result) return <div className="notice-compose-page">
    <PageHeader title="Notice published" description={`${schoolName} · Portal delivery is available now.`}/>
    <Card className="padded">
      <Alert tone="success" title="Published to the approved audience">{result.recipientCount} eligible parent account{result.recipientCount === 1 ? '' : 's'} can now read this notice. Email was not requested or inferred.</Alert>
      <a className="btn btn-primary btn-normal" href={`/admin/communication?notice=${result.noticeId}`}>Review communication</a>
    </Card>
  </div>;

  const selected = sections.find(item => item.id === sectionId);
  return <div className="notice-compose-page">
    <PageHeader title="Create notice" description={`${schoolName} · School communication`}/>
    <Stepper steps={['Message', 'Recipients', 'Review']} current={step}/>
    <div className="branch-edit-grid">
      <Card className="padded branch-edit-card">
        <h2 ref={heading} tabIndex={-1}>{step === 0 ? 'Write the notice' : step === 1 ? 'Choose the recipients' : 'Review before publishing'}</h2>
        {error && <Alert tone="danger" title="Notice not published" onDismiss={() => setError('')}>{error}</Alert>}
        {step === 0 && <div className="settings-form">
          <TextField label="Subject" required maxLength={120} value={title} onChange={event => {setTitle(event.target.value); invalidatePublishIntent();}}/>
          <TextArea label="Message" required maxLength={5000} value={body} onChange={event => {setBody(event.target.value); invalidatePublishIntent();}}/>
          <p className="small muted">Use a clear action and date. Keep private student or family details out of a group notice.</p>
          <label className="check-row"><input type="checkbox" checked={requiresAck} onChange={event => {setRequiresAck(event.target.checked); invalidatePublishIntent();}}/><span>Ask recipients to acknowledge</span></label>
          <p className="small muted">Acknowledgement confirms receipt of this version. It is not consent or permission.</p>
          <div className="workflow-actions"><a className="btn btn-secondary btn-normal" href="/admin/communication">Cancel</a><Button disabled={!title.trim() || !body.trim()} onClick={() => move(1)}>Continue <span aria-hidden="true">→</span></Button></div>
        </div>}
        {step === 1 && <div className="settings-form">
          <SelectField label="Class" value={sectionId} onChange={event => {setSectionId(event.target.value); invalidatePublishIntent();}}>{sections.map(item => <option key={item.id} value={item.id}>{item.gradeName} · {item.name}</option>)}</SelectField>
          <p className="small muted">Only accepted parent accounts with the separate school-notice purpose and a current child placement in this class are eligible.</p>
          <div className="workflow-actions"><Button variant="secondary" onClick={() => move(0)}>Back</Button><Button disabled={!sectionId} onClick={() => move(2)}>Continue <span aria-hidden="true">→</span></Button></div>
        </div>}
        {step === 2 && <div className="settings-form">
          <dl className="record-facts"><div><dt>Subject</dt><dd>{title}</dd></div><div><dt>Recipients</dt><dd>{selected ? `${selected.gradeName} · ${selected.name}` : 'Unavailable'}</dd></div><div><dt>Acknowledgement</dt><dd>{requiresAck ? 'Requested' : 'Not requested'}</dd></div></dl>
          <section className="notice-message-preview" aria-label="Notice message"><h3>Message</h3><p>{body}</p></section>
          <Alert title="Final confirmation">Publication creates immutable version 1 and a frozen account manifest. Current child access is rechecked whenever a parent opens or acknowledges it.</Alert>
          <div className="workflow-actions"><Button variant="secondary" onClick={() => move(1)}>Back</Button><Button loading={busy} onClick={publish}>Publish notice</Button></div>
        </div>}
      </Card>
      <aside className="branch-edit-aside">
        <Card className="padded"><SectionHeader title="A useful notice is clear"/><p>Say what is happening, who it is for and what they need to do.</p><div className="section-divider"/><h3>Only the right recipients</h3><p className="small muted">Approved school-notice permissions and current branch access determine who can read it.</p></Card>
        <Card className="padded"><h3>Delivery in this slice</h3><p className="small muted">Portal publication is authoritative. No email is sent and no delivery or reading status is inferred.</p></Card>
      </aside>
    </div>
  </div>;
}
