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
    lesson?: {classSectionId:string;localDate:string;startsAt:Date;endsAt:Date};
  },
) {
  const now = new Date();
  const lessonPeriodKey=randomUUID();
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
            periodKey: lessonPeriodKey,
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
  const publicationCommandId=randomUUID();
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
  const published=await db.timetableRevision.create({
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
      sourceCommandId: publicationCommandId,
      calendarRevisionId,
      contentSnapshot: {schemaVersion: 1},
      version: 1,
      createdAt: now,
      createdByAccountId: input.actorAccountId,
      updatedAt: now,
    },
  });
  if(input.lesson){
    const lesson=input.lesson;
    const suffix=randomUUID().replaceAll('-','').slice(0,8).toUpperCase(),subjectId=randomUUID(),offeringId=randomUUID(),personId=randomUUID(),employeeId=randomUUID(),teacherId=randomUUID(),assignmentId=randomUUID(),slotKey=randomUUID();
    await db.subject.create({data:{id:subjectId,organizationId:input.organizationId,schoolId:input.schoolId,code:`NX${suffix}`,name:'Mathematics',active:true,version:1}});
    await db.courseOffering.create({data:{id:offeringId,organizationId:input.organizationId,schoolId:input.schoolId,yearId:input.academicYearId,sectionId:lesson.classSectionId,subjectId,code:`NX${suffix}`,active:true,version:1}});
    await db.person.create({data:{id:personId,organizationId:input.organizationId,firstName:'Mira',lastName:'Sen',version:1,createdAt:now}});
    await db.employee.create({data:{id:employeeId,organizationId:input.organizationId,schoolId:input.schoolId,personId,staffNumber:`NX${suffix}`,category:'TEACHING',employedFrom:input.startsOn,status:'ACTIVE',version:1}});
    await db.teacher.create({data:{id:teacherId,organizationId:input.organizationId,schoolId:input.schoolId,employeeId,active:true,version:1}});
    await db.teacherAssignment.create({data:{id:assignmentId,organizationId:input.organizationId,schoolId:input.schoolId,offeringId,teacherId,validFrom:input.startsOn,validTo:input.endsOn,version:1}});
    const weekday=new Date(`${lesson.localDate}T00:00:00.000Z`).getUTCDay()||7;
    await db.$transaction(async tx=>{await tx.$queryRaw`SELECT set_config('vschool.timetable_publication_command_id',${publicationCommandId},true)`;await tx.timetableSlot.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,revisionId:published.id,slotKey,academicYearId:input.academicYearId,dayPatternId:pattern.id,classSectionId:lesson.classSectionId,subjectOfferingId:offeringId,teacherAssignmentId:assignmentId,dayOfWeek:weekday,periodKey:lessonPeriodKey,position:1}});await tx.lessonOccurrence.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,academicYearId:input.academicYearId,classSectionId:lesson.classSectionId,localDate:new Date(`${lesson.localDate}T00:00:00.000Z`),periodKey:lessonPeriodKey,sourceRevisionId:published.id,sourceSlotKey:slotKey,startsAt:lesson.startsAt,endsAt:lesson.endsAt,subjectOfferingId:offeringId,effectiveTeacherAssignmentId:assignmentId,state:'PLANNED',generationRevision:1,lastOutcome:'CREATED',version:1,createdAt:now,updatedAt:now}});});
  }
}
