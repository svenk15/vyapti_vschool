# Observed existing tables

Schema snapshot only; inspect live migrations before changes. No new tables required for Wave A.

| Prisma model | Physical table |
|---|---|
| SetupCheck | `vs_platform_setup_check` |
| Organization | `vs_access_organization` |
| School | `vs_access_school` |
| UserAccount | `vs_access_user_account` |
| AccountPersonBinding | `vs_access_account_person_binding` |
| Person | `vs_people_person` |
| Employee | `vs_people_employee` |
| Teacher | `vs_academics_teacher` |
| Student | `vs_students_student` |
| SchoolMembership | `vs_access_school_membership` |
| RoleGrant | `vs_access_role_grant` |
| AuthSecurityEvent | `vs_access_auth_security_event` |
| AccessInvite | `vs_access_invite` |
| PasswordResetToken | `vs_access_password_reset_token` |
| AuditEntry | `vs_platform_audit_entry` |
| ExportRun | `vs_reporting_export_run` |
| OperatorAuditEntry | `vs_platform_operator_audit` |
| OutboxEvent | `vs_platform_outbox_event` |
| CommandReceipt | `vs_platform_command_receipt` |
| Campus | `vs_access_campus` |
| AccountActivation | `vs_access_account_activation` |
| AccountActivationMembership | `vs_access_account_activation_membership` |
| InstitutionGrant | `vs_access_institution_grant` |
| ConfigurationChange | `vs_tenancy_configuration_change` |
| TenantCommandReceipt | `vs_tenancy_tenant_command_receipt` |
| TenantOutbox | `vs_tenancy_tenant_outbox` |
| OrganizationEntitlement | `vs_tenancy_organization_entitlement` |
| BranchActivation | `vs_tenancy_branch_activation` |
| BrandProfile | `vs_branding_brand_profile` |
| BrandRevision | `vs_branding_brand_revision` |
| BrandAsset | `vs_branding_brand_asset` |
| VerifiedBrandHost | `vs_branding_verified_brand_host` |
| AcademicYear | `vs_academics_academic_year` |
| AcademicTerm | `vs_academics_academic_term` |
| GradeLevel | `vs_academics_grade_level` |
| Subject | `vs_academics_subject` |
| Section | `vs_academics_section` |
| CourseOffering | `vs_academics_course_offering` |
| TeacherAssignment | `vs_academics_teacher_assignment` |
| Enrollment | `vs_students_enrollment` |
| SectionPlacement | `vs_students_section_placement` |
| ImportJob | `vs_imports_import_job` |
| ImportRow | `vs_imports_import_row` |
| SourceStudentMap | `vs_imports_source_student_map` |
| SchoolCalendar | `vs_academics_school_calendar` |
| CalendarRevision | `vs_academics_calendar_revision` |
| CalendarException | `vs_academics_calendar_exception` |
| AttendanceSession | `vs_attendance_session` |
| SessionRosterEntry | `vs_attendance_session_roster_entry` |
| AttendanceRecord | `vs_attendance_record` |
| AttendanceRevision | `vs_attendance_revision` |
