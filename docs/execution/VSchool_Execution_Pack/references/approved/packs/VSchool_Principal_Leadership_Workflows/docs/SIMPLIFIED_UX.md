# Simplified leadership UX

This document defines the user experience for the leadership workspace. The accompanying HTML is a guided review experience, not a deployed school application. The existing module, authorization and delivery contracts still apply.

## Five familiar groups

| Group | User question | Typical activities |
|---|---|---|
| My day | What needs my attention? | Today’s priorities, assigned follow-ups, decisions waiting for me |
| Attendance & pupil support | Who needs a follow-up? | Missing class attendance, pupil absence, permitted support referrals |
| Teaching & staff | Are classes ready to learn? | Cover arrangements, class progress, feedback and assessments |
| Families & notices | Who needs a response? | Parent concerns, school notices and communication follow-up |
| Reviews & reports | How is the school doing? | Weekly summaries and permitted reports; separately enabled specialist summaries |

A group is a way to find work, not a new backend module or a bundle that a school must buy. Render only activities released, enabled for the branch and permitted for the signed-in person. My day can link to work whose main home is another group. Do not create a second authoritative record when displaying it there.

## Navigation and progressive disclosure

1. Open My day in the implemented product, with current school/branch and clear priorities. Give a calm activity overview when the user wants to explore.
2. Keep five top-level groups at most; hide empty groups. My account, help and sign out remain utility actions, with sign out separate from user information.
3. Inside a group, use action-led labels: Find missing attendance, Arrange a cover teacher, Respond to a parent concern.
4. Open one journey at a time. Show current location, purpose, the person acting now, and one primary next action.
5. Show completion or a clear waiting state with an owner. An item assigned to somebody else is not completed.
6. Put uncommon explanations in contextual help. Keep workflow IDs, delivery phases, API/table names and technical reference links out of school-facing screens.

The review reader shows five groups and eight example activities. Design notes retains the 46-workflow implementation reference. It remembers walkthrough position in memory during one visit; it does not promise persisted work or draft recovery after reload.

## Every task answers five questions

| Question | UI requirement |
|---|---|
| Where am I? | Clear page title and school/branch context; honest breadcrumb hierarchy |
| Why am I here? | One short explanation tied to a real situation |
| What do I do now? | A specific action, with only the information needed for it |
| Who acts next? | Named person or responsible team, due time where relevant and handoff status |
| When is it finished? | An explicit completion condition and the remaining work, if any |

Use step indicators only for genuine sequential work. Routine detail pages, quick edits and read-only lists should not become unnecessary wizards. The reader’s stepper is for explaining cross-person journeys; the implemented principal must never see an enabled teacher-only command simply because it is the next step in the story.

## Plain-language labels and states

| Avoid on routine school screens | Prefer |
|---|---|
| Register submission coverage | Classes with attendance submitted |
| Evidence ready | Waiting for review |
| Verify resolution | Check and complete |
| Source unavailable | We could not load the latest attendance. Try again. |
| Permission denied | You no longer have access to this action. Contact your school administrator. |
| Mutation outcome unknown | We are checking whether your change was saved. |
| Cross-tenant context | School and branch |
| Submit / Execute / Process everywhere | Assign follow-up / Approve notice / Save changes, as appropriate |

Domain state names stay unchanged internally. Map states to plain words without changing their meaning: To do, In progress, Waiting for review, Completed, Cancelled. Overdue is shown beside the real state with the due time; it is not a replacement state. Completion is limited to the task’s finish condition, not a promise that a pupil’s attendance or learning concern is permanently solved.

## Actions, forms and handoffs

- Give one high-emphasis action per step. Put Back on the left and the main action on the right. Keep secondary actions outside that pair.
- Do not preselect an assignee, audience, payment consequence or approval on behalf of the user unless an approved workflow explicitly supplies it and shows it for review.
- Show labels above inputs, identify required fields in words, and put understandable errors beside the relevant field. Preserve entered content after a recoverable error.
- Ask for confirmation where the consequence merits review, such as publishing a notice, changing an assignment or closing a follow-up. Do not add confirmation dialogs to simple navigation.
- When work moves to another person, show who owns it and what the current user can do while waiting. Keep private or unauthorized details out of the handoff.
- If saving is uncertain, offer Check status; do not encourage repeated submissions. If data changed during review, explain what changed before allowing a new decision.
- Module unavailable, no records yet, no matches, no access and failed loading are distinct states with appropriate next steps. An empty attendance list must not imply all pupils are present.
- Keep secondary information behind meaningful labels such as Why is this needed? or If something goes wrong. Essential errors and required actions stay visible.

## Shared visual and accessibility rules

Use the existing calm green theme, semantic tokens, consistent stroke icons, typography and spacing. Every icon accompanies a text label; no icon-only guesses for routine actions. Keep desktop controls compact and mobile targets at least 44px where practical. Long school, class and person names wrap instead of colliding.

Use semantic headings, labels and controls; visible keyboard focus; stable focus after navigation; accessible status announcements; text with color indicators. At narrow widths, stack content and keep the main action reachable. Test native zoom and screen readers in the implemented product before making accessibility-conformance claims.

## Implementation slices

| Slice | Deliverable | Demo acceptance |
|---|---|---|
| UX-L1 | Shared group navigation and action labels | A user finds missing attendance without searching technical categories |
| UX-L2 | My day with source-linked priorities | User can explain the issue, current owner and next action from one item |
| UX-L3 | Attendance list, detail, assign and waiting states | User assigns once, sees who acts next and recovers an uncertain save |
| UX-L4 | Review and completion | User checks the teacher submission and distinguishes completed work from outstanding work |
| UX-L5 | Consistent layouts and error recovery across enabled activities | Keyboard/mobile paths work, entered data survives recoverable errors and forbidden actions remain blocked |

Reconcile these proposed slices with the existing execution index; do not duplicate or override task dependencies. Keep source-owner LLD and current-state evidence connected. No new production implementation is claimed here.

## Non-technical usability review — still to perform

Ask a school administrator or principal who has not read the design to: find a missing class attendance submission; identify the responsible teacher; assign a follow-up; explain who acts next; find the result and explain why it can be completed. Then ask them to locate a parent concern and a cover request. Observe wrong turns and requests for help. Product acceptance requires demonstrated understanding; automated layout checks alone cannot establish it.

## Detailed workflow placement

Each workflow has one primary group below. My day may surface authorized work from any group. Technical ownership remains in the original DESIGN documents.

| Reference | Workflow | Primary group |
|---|---|---|
| LEA-01 | Enter the correct leadership workspace | My day |
| LEA-02 | Switch branches without losing context | My day |
| LEA-03 | Work under a temporary leadership delegation | My day |
| LEA-04 | Handle access changes during a leadership action | My day |
| LEA-05 | Review my school today | My day |
| LEA-06 | Recognize stale, incomplete or unavailable information | My day |
| LEA-07 | Run the weekly leadership review | My day |
| LEA-08 | Inspect register submission coverage | Attendance & pupil support |
| LEA-09 | Create an accountable missing-register follow-up | Attendance & pupil support |
| LEA-10 | Follow up multiple missing registers safely | Attendance & pupil support |
| LEA-11 | Verify, close or reopen a follow-up | Attendance & pupil support |
| LEA-12 | Review factual pupil attendance patterns | Attendance & pupil support |
| LEA-13 | Review an absence explanation | Attendance & pupil support |
| LEA-14 | Review an attendance correction request | Attendance & pupil support |
| LEA-15 | Resolve an incorrect or duplicate scheduled session | Attendance & pupil support |
| LEA-16 | Review timetable conflicts and uncovered classes | Teaching & staff |
| LEA-17 | Review assignment completion with the right denominator | Teaching & staff |
| LEA-18 | Review feedback awaiting return | Teaching & staff |
| LEA-19 | Coordinate an evidence-based learning concern | Teaching & staff |
| LEA-20 | Check assessment and report readiness | Teaching & staff |
| LEA-21 | Perform an explicitly delegated moderation decision | Teaching & staff |
| LEA-22 | Authorize or hand off report publication | Teaching & staff |
| LEA-23 | Review staffing availability without private reasons | Teaching & staff |
| LEA-24 | Approve temporary cover when delegated | Teaching & staff |
| LEA-25 | Decide an assigned staff request | Teaching & staff |
| LEA-26 | Hand over open work when leadership changes | My day |
| LEA-27 | Work from a purpose-scoped decision inbox | My day |
| LEA-28 | Request information before deciding | My day |
| LEA-29 | Approve, reject or return an assigned item | My day |
| LEA-30 | Recuse and route a conflict of interest | My day |
| LEA-31 | Recover an uncertain or outdated decision | My day |
| LEA-32 | Prepare a targeted school notice | Families & notices |
| LEA-33 | Approve or return a proposed communication | Families & notices |
| LEA-34 | Follow up delivery or acknowledgement gaps | Families & notices |
| LEA-35 | Handle an escalated family concern or complaint | Families & notices |
| LEA-36 | Run a family or staff meeting with follow-up actions | Families & notices |
| LEA-37 | Refer a concern to an authorized specialist | Attendance & pupil support |
| LEA-38 | Follow the school’s urgent safety escalation procedure | Attendance & pupil support |
| LEA-39 | Drill into a metric and export permitted evidence | Reviews & reports |
| LEA-40 | Compare branches responsibly | Reviews & reports |
| LEA-41 | Prepare a leadership review brief | Reviews & reports |
| LEA-42 | Review decision and follow-up history | Reviews & reports |
| LEA-43 | Review financial exceptions under a separate grant | Reviews & reports |
| LEA-44 | Coordinate a school service interruption | Reviews & reports |
| LEA-45 | Review a source-linked leadership draft | Reviews & reports |
| LEA-46 | Manage sessions, preferences and school support | My day |
