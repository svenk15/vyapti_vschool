import {attendanceCorrectionRequestsGateway as gateway} from '@/lib/server/attendance-correction-requests';
import {AttendanceAdminTabs} from '@/components/attendance-admin-tabs';
import {getIdentity} from '@/lib/server/auth';
import {ServerTable} from '@/components/ui/server-table';
import {Badge, BrandSurface, ButtonLink, Card, EmptyState, PageHeader, PageStack, SectionHeader} from '@/components/ui/primitives';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const items = await gateway.listReview(await getIdentity());
  return (
    <BrandSurface>
      <main id="main-content" className="container page-space">
        <PageStack className="attendance-queue-page">
          <PageHeader
            eyebrow="Attendance"
            title="Correction requests"
            description="Review exact submitted records assigned through your Attendance reviewer grant."
            actions={<ButtonLink href="/admin/attendance/sessions?view=monitor" variant="secondary">Attendance sessions</ButtonLink>}
          />
          <AttendanceAdminTabs active="corrections" />
          <Card className="directory-card attendance-queue-card">
            <div className="directory-heading">
              <SectionHeader title="Assigned requests" description="A changed source revision requires a fresh request before any correction can be applied." />
              <Badge tone={items.length ? 'warning' : 'neutral'}>{items.length}</Badge>
            </div>
            {items.length === 0 ? (
              <EmptyState title="No assigned correction requests" description="Principal-routed requests will appear here." icon="calendar" />
            ) : (
              <ServerTable
                caption="Assigned attendance correction requests"
                rows={items}
                rowKey={(item) => item.id}
                className="attendance-queue-table"
                columns={[
                  {key: 'student', label: 'Student', rowHeader: true, render: (item) => item.studentName},
                  {key: 'date', label: 'Date', render: (item) => item.schoolDate},
                  {key: 'change', label: 'Requested change', render: (item) => `${item.originalStatus} → ${item.proposedStatus}`},
                  {key: 'status', label: 'Status', render: (item) => <Badge tone={item.currentRevision === item.sourceRevision ? 'warning' : 'danger'}>{item.currentRevision === item.sourceRevision ? 'Ready' : 'Changed'}</Badge>},
                  {key: 'action', label: 'Action', render: (item) => <ButtonLink href={`/admin/attendance/correction-requests/${item.id}`} variant="ghost">Review request</ButtonLink>},
                ]}
              />
            )}
          </Card>
        </PageStack>
      </main>
    </BrandSurface>
  );
}
