'use client';

import {useEffect, useRef, useState} from 'react';
import type {NoticeDetail} from '@/shared/contracts/communication';
import Link from 'next/link';
import {Alert, Button, Card} from './ui/primitives';

export function FamilyNotice({notice, studentId, backHref}: {notice: NoticeDetail; studentId: string; backHref: string}) {
  const [readAt, setReadAt] = useState(notice.readAt);
  const [ack, setAck] = useState(notice.acknowledgedAt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const readSent = useRef(false);
  const acknowledgementKey = useRef(crypto.randomUUID());

  useEffect(() => {
    if (notice.status === 'WITHDRAWN' || readAt || readSent.current) return;
    readSent.current = true;
    void fetch(`/api/v1/family/notices/${notice.noticeId}/read`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({studentId, versionId: notice.versionId})})
      .then(async response => { const payload = await response.json(); if (response.ok) setReadAt(payload.readAt); })
      .catch(() => {});
  }, [notice.noticeId, notice.status, notice.versionId, readAt, studentId]);

  const acknowledge = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/family/notices/${notice.noticeId}/acknowledge`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({studentId, versionId: notice.versionId, key: acknowledgementKey.current})});
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'Acknowledgement could not be saved.');
      setAck(payload.acknowledgedAt);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Acknowledgement could not be saved.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="family-notice-detail">
    {error && <Alert tone="danger" title="Acknowledgement not saved" onDismiss={() => setError('')}>{error}</Alert>}
    <Card className="padded notice-reading-card">
      {notice.latestReminderAt && !ack && notice.status === 'PUBLISHED' && <Alert tone="info" title="Acknowledgement reminder">The school sent a portal reminder on {new Date(notice.latestReminderAt).toLocaleString()}. This is reminder {notice.reminderCount} for this notice version.</Alert>}
      {notice.status === 'WITHDRAWN'
        ? <Alert tone="warning" title="This notice was withdrawn">Protected notice content is no longer available. Contact the school if you need clarification.</Alert>
        : <p className="notice-reading-body">{notice.body}</p>}
      {notice.status === 'PUBLISHED' && notice.attachments.length > 0 && <section className="notice-downloads" aria-labelledby="notice-downloads-title">
        <h2 id="notice-downloads-title">Attachments</h2>
        <ul>{notice.attachments.map(item => <li key={item.versionId}><span aria-hidden="true">📎</span><span>{item.filename}</span><a className="btn btn-secondary btn-normal" href={`/api/v1/documents/versions/${item.versionId}?grant=${item.grantId}`}>Download</a></li>)}</ul>
        <p className="small muted">Each download rechecks your current access and the file&apos;s current safety state.</p>
      </section>}
      <div className="section-divider"/>
      {notice.status === 'WITHDRAWN' ? <p className="muted">Acknowledgement is no longer available.</p> : notice.requiresAcknowledgement ? (ack
        ? <Alert tone="success" title="Acknowledged">Your explicit response to version {notice.version} was recorded on {new Date(ack).toLocaleString()}.</Alert>
        : <div className="notice-ack-action"><Button loading={busy} onClick={acknowledge}><span aria-hidden="true">✓</span> Acknowledge notice</Button><p className="small muted">This records receipt, not consent or agreement to a separate activity.</p></div>)
        : <p className="muted">No acknowledgement is requested.</p>}
      <Link className="btn btn-secondary btn-normal notice-back" href={backHref}>← Back to messages</Link>
      <span className="sr-only" aria-live="polite">{readAt ? 'Notice read recorded.' : 'Recording notice read.'}</span>
    </Card>
  </div>;
}
