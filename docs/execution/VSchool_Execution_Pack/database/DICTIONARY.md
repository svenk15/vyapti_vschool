# Database dictionary — observed baseline

51 mapped Prisma models; full stored-column types/nullability/default attributes, relations and keys per table. These describe current source, not production verification.

| Table | Model | Owner | Stored columns | Details |
|---|---|---|---|---|
| `vs_platform_setup_check` | SetupCheck | platform | 2 | [Schema](tables/vs_platform_setup_check.md) |
| `vs_access_organization` | Organization | access | 7 | [Schema](tables/vs_access_organization.md) |
| `vs_access_school` | School | access | 9 | [Schema](tables/vs_access_school.md) |
| `vs_access_user_account` | UserAccount | access | 10 | [Schema](tables/vs_access_user_account.md) |
| `vs_access_account_person_binding` | AccountPersonBinding | access | 6 | [Schema](tables/vs_access_account_person_binding.md) |
| `vs_people_person` | Person | people | 7 | [Schema](tables/vs_people_person.md) |
| `vs_people_employee` | Employee | people | 9 | [Schema](tables/vs_people_employee.md) |
| `vs_academics_teacher` | Teacher | academics | 6 | [Schema](tables/vs_academics_teacher.md) |
| `vs_students_student` | Student | students | 8 | [Schema](tables/vs_students_student.md) |
| `vs_access_school_membership` | SchoolMembership | access | 6 | [Schema](tables/vs_access_school_membership.md) |
| `vs_access_role_grant` | RoleGrant | access | 5 | [Schema](tables/vs_access_role_grant.md) |
| `vs_access_auth_security_event` | AuthSecurityEvent | access | 9 | [Schema](tables/vs_access_auth_security_event.md) |
| `vs_access_invite` | AccessInvite | access | 17 | [Schema](tables/vs_access_invite.md) |
| `vs_access_password_reset_token` | PasswordResetToken | access | 13 | [Schema](tables/vs_access_password_reset_token.md) |
| `vs_platform_audit_entry` | AuditEntry | platform | 13 | [Schema](tables/vs_platform_audit_entry.md) |
| `vs_reporting_export_run` | ExportRun | reporting | 10 | [Schema](tables/vs_reporting_export_run.md) |
| `vs_platform_operator_audit` | OperatorAuditEntry | platform | 7 | [Schema](tables/vs_platform_operator_audit.md) |
| `vs_platform_outbox_event` | OutboxEvent | platform | 14 | [Schema](tables/vs_platform_outbox_event.md) |
| `vs_platform_command_receipt` | CommandReceipt | platform | 9 | [Schema](tables/vs_platform_command_receipt.md) |
| `vs_access_campus` | Campus | access | 7 | [Schema](tables/vs_access_campus.md) |
| `vs_access_account_activation` | AccountActivation | access | 11 | [Schema](tables/vs_access_account_activation.md) |
| `vs_access_account_activation_membership` | AccountActivationMembership | access | 7 | [Schema](tables/vs_access_account_activation_membership.md) |
| `vs_access_institution_grant` | InstitutionGrant | access | 8 | [Schema](tables/vs_access_institution_grant.md) |
| `vs_tenancy_configuration_change` | ConfigurationChange | tenancy | 10 | [Schema](tables/vs_tenancy_configuration_change.md) |
| `vs_tenancy_tenant_command_receipt` | TenantCommandReceipt | tenancy | 8 | [Schema](tables/vs_tenancy_tenant_command_receipt.md) |
| `vs_tenancy_tenant_outbox` | TenantOutbox | tenancy | 9 | [Schema](tables/vs_tenancy_tenant_outbox.md) |
| `vs_tenancy_organization_entitlement` | OrganizationEntitlement | tenancy | 9 | [Schema](tables/vs_tenancy_organization_entitlement.md) |
| `vs_tenancy_branch_activation` | BranchActivation | tenancy | 7 | [Schema](tables/vs_tenancy_branch_activation.md) |
| `vs_branding_brand_profile` | BrandProfile | branding | 8 | [Schema](tables/vs_branding_brand_profile.md) |
| `vs_branding_brand_revision` | BrandRevision | branding | 15 | [Schema](tables/vs_branding_brand_revision.md) |
| `vs_branding_brand_asset` | BrandAsset | branding | 11 | [Schema](tables/vs_branding_brand_asset.md) |
| `vs_branding_verified_brand_host` | VerifiedBrandHost | branding | 8 | [Schema](tables/vs_branding_verified_brand_host.md) |
| `vs_academics_academic_year` | AcademicYear | academics | 9 | [Schema](tables/vs_academics_academic_year.md) |
| `vs_academics_academic_term` | AcademicTerm | academics | 8 | [Schema](tables/vs_academics_academic_term.md) |
| `vs_academics_grade_level` | GradeLevel | academics | 8 | [Schema](tables/vs_academics_grade_level.md) |
| `vs_academics_subject` | Subject | academics | 7 | [Schema](tables/vs_academics_subject.md) |
| `vs_academics_section` | Section | academics | 10 | [Schema](tables/vs_academics_section.md) |
| `vs_academics_course_offering` | CourseOffering | academics | 9 | [Schema](tables/vs_academics_course_offering.md) |
| `vs_academics_teacher_assignment` | TeacherAssignment | academics | 8 | [Schema](tables/vs_academics_teacher_assignment.md) |
| `vs_students_enrollment` | Enrollment | students | 8 | [Schema](tables/vs_students_enrollment.md) |
| `vs_students_section_placement` | SectionPlacement | students | 9 | [Schema](tables/vs_students_section_placement.md) |
| `vs_imports_import_job` | ImportJob | imports | 17 | [Schema](tables/vs_imports_import_job.md) |
| `vs_imports_import_row` | ImportRow | imports | 14 | [Schema](tables/vs_imports_import_row.md) |
| `vs_imports_source_student_map` | SourceStudentMap | imports | 7 | [Schema](tables/vs_imports_source_student_map.md) |
| `vs_academics_school_calendar` | SchoolCalendar | academics | 6 | [Schema](tables/vs_academics_school_calendar.md) |
| `vs_academics_calendar_revision` | CalendarRevision | academics | 8 | [Schema](tables/vs_academics_calendar_revision.md) |
| `vs_academics_calendar_exception` | CalendarException | academics | 8 | [Schema](tables/vs_academics_calendar_exception.md) |
| `vs_attendance_session` | AttendanceSession | attendance | 16 | [Schema](tables/vs_attendance_session.md) |
| `vs_attendance_session_roster_entry` | SessionRosterEntry | attendance | 9 | [Schema](tables/vs_attendance_session_roster_entry.md) |
| `vs_attendance_record` | AttendanceRecord | attendance | 8 | [Schema](tables/vs_attendance_record.md) |
| `vs_attendance_revision` | AttendanceRevision | attendance | 10 | [Schema](tables/vs_attendance_revision.md) |
