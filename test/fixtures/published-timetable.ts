import {randomUUID} from 'node:crypto';
import type {PrismaClient} from '../../generated/prisma/client';

export async function publishSixDayTimetable(
  db: PrismaClient,
  input: {
    organizationId: string;
    schoolId: string;
    academicYearId: string;
    startsOn: Date;
    endsOn: Date;
    actorAccountId: string;
  },
) {
  const now = new Date();
  const pattern = await db.academicDayPattern.create({
    data: {
      id: randomUUID(),
      organizationId: input.organizationId,
      schoolId: input.schoolId,
      academicYearId: input.academicYearId,
      name: 'Six-day browser pattern',
      teachingDays: [1, 2, 3, 4, 5, 6],
      state: 'PUBLISHED',
      version: 1,
      createdAt: now,
      createdByAccountId: input.actorAccountId,
      updatedAt: now,
      periods: {
        create: [
          {
            id: randomUUID(),
            periodKey: randomUUID(),
            label: 'Morning lesson',
            kind: 'LESSON',
            startLocal: new Date('1970-01-01T09:00:00.000Z'),
            endLocal: new Date('1970-01-01T09:40:00.000Z'),
            position: 1,
          },
          {
            id: randomUUID(),
            periodKey: randomUUID(),
            label: 'Morning break',
            kind: 'BREAK',
            startLocal: new Date('1970-01-01T09:40:00.000Z'),
            endLocal: new Date('1970-01-01T10:00:00.000Z'),
            position: 2,
          },
        ],
      },
    },
  });
  const calendarId = randomUUID();
  const calendarRevisionId = randomUUID();
  const draftId = randomUUID();
  await db.schoolCalendar.create({
    data: {
      id: calendarId,
      organizationId: input.organizationId,
      schoolId: input.schoolId,
      yearId: input.academicYearId,
      version: 1,
    },
  });
  await db.calendarRevision.create({
    data: {
      id: calendarRevisionId,
      organizationId: input.organizationId,
      schoolId: input.schoolId,
      calendarId,
      number: 1,
      teachingWeekdays: [1, 2, 3, 4, 5, 6],
      publishedAt: now,
      publishedBy: input.actorAccountId,
    },
  });
  await db.schoolCalendar.update({
    where: {id: calendarId},
    data: {currentRevisionId: calendarRevisionId},
  });
  await db.timetableRevision.create({
    data: {
      id: draftId,
      organizationId: input.organizationId,
      schoolId: input.schoolId,
      academicYearId: input.academicYearId,
      dayPatternId: pattern.id,
      revisionNo: 1,
      state: 'DRAFT',
      effectiveFrom: input.startsOn,
      version: 1,
      createdAt: now,
      createdByAccountId: input.actorAccountId,
      updatedAt: now,
    },
  });
  await db.timetableRevision.create({
    data: {
      id: randomUUID(),
      organizationId: input.organizationId,
      schoolId: input.schoolId,
      academicYearId: input.academicYearId,
      dayPatternId: pattern.id,
      revisionNo: 2,
      state: 'PUBLISHED',
      effectiveFrom: input.startsOn,
      effectiveUntil: null,
      validatedUntil: input.endsOn,
      publishedAt: now,
      publishedByAccountId: input.actorAccountId,
      basedOnRevisionId: draftId,
      basedOnDraftVersion: 1,
      sourceCommandId: randomUUID(),
      calendarRevisionId,
      contentSnapshot: {schemaVersion: 1},
      version: 1,
      createdAt: now,
      createdByAccountId: input.actorAccountId,
      updatedAt: now,
    },
  });
}
