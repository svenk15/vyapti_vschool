import {AttendanceAdminTabs} from '@/components/attendance-admin-tabs';
import {Badge, BrandSurface, ButtonLink, Card, EmptyState, PageHeader, PageStack} from '@/components/ui/primitives';
import {ServerTable} from '@/components/ui/server-table';
import {attendanceExplanationsGateway} from '@/lib/server/attendance-explanations';
import {getIdentity} from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const categoryLabel = (category: string) => category
  .toLowerCase()
  .split('_')
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(' ');

export default async function ExplanationQueue() {
  const items = await attendanceExplanationsGateway.listReviewer(await getIdentity());
  return (
    <BrandSurface>
      <main id="main-content" className="container page-space">
        <PageStack className="attendance-queue-page">
          <PageHeader
            title="Attendance"
            description="Review Parent explanations separately from corrections to the submitted register."
            actions={<ButtonLink href="/admin/attendance/sessions" variant="primary">Schedule session</ButtonLink>}
          />
          <AttendanceAdminTabs active="explanations" />
          <Card className="directory-card attendance-queue-card">
            <div className="directory-heading">
              <div>
                <h2>Absence explanations</h2>
                <p className="muted small">Only explanations with current guardian purpose and branch authority are shown.</p>
              </div>
              <Badge tone={items.length ? 'warning' : 'neutral'}>{items.length}</Badge>
            </div>
            {items.length === 0 ? (
              <EmptyState title="No explanations awaiting review" description="New eligible Parent submissions will appear here." icon="calendar" />
            ) : (
              <ServerTable
                caption="Absence explanations awaiting review"
                rows={items}
                rowKey={(item) => item.id}
                className="attendance-queue-table"
                columns={[
                  {key: 'student', label: 'Student', rowHeader: true, render: (item) => item.studentName},
                  {key: 'date', label: 'Date', render: (item) => item.schoolDate},
                  {key: 'class', label: 'Class and subject', render: (item) => <span>{item.sectionName}<small className="sub">{item.subjectName}</small></span>},
                  {key: 'category', label: 'Category', render: (item) => categoryLabel(item.category)},
                  {key: 'action', label: 'Action', render: (item) => <ButtonLink variant="ghost" href={`/admin/attendance/explanations/${item.id}`}>Review explanation</ButtonLink>},
                ]}
              />
            )}
          </Card>
        </PageStack>
      </main>
    </BrandSurface>
  );
}
