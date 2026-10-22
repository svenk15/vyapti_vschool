# Source index

| Concern | Packaged source | Role on `/admin/students` |
| --- | --- | --- |
| Route entry | `source/app/admin/students/page.tsx` | Resolves identity, home/navigation, authorized Student query, URL search/filter/sort state, and composes `StudentsWorkspace`. |
| Administrator layout | `source/app/admin/layout.tsx` | Loads authorized Administrator home, theme, navigation destinations, dynamic capability destinations, academic-year context, and shell. |
| Root layout/font | `source/app/layout.tsx` | Root document and font setup used by the rendered page. |
| Students directory | `source/components/students-workspace.tsx` | Page header, local tabs/action, list toolbar, table columns/actions, filtering/sorting drawers, pagination, and row action dialog. |
| Local navigation | `source/components/admin-local-navigation.tsx` | Directory/Admissions/Imports tabs and right-aligned registration action composition. |
| Navigation context | `source/components/admin-navigation-context.tsx` | Supplies authorized destinations to local navigation. |
| Administrator shell adapter | `source/components/admin-portal-frame.tsx` | Connects Administrator data to the shared portal shell. |
| Shared shell | `source/components/portal/portal-shell.tsx` | Desktop sidebar, mobile menu trigger/drawer, top context, account footer, sign-out, and content region. |
| Sidebar groups | `source/components/portal-navigation-group.tsx` | Navigation rows, active state, disclosures, icons, and group rendering. |
| Navigation policy/config | `source/lib/server/admin-navigation.ts` | Server-filtered destinations and grouping supplied to the shell. |
| List toolbar | `source/components/portal/list-toolbar.tsx` | Search attribute/input, Filters and Sort controls. |
| Filter drawer | `source/components/portal/filter-drawer.tsx` | Applied/draft status filtering UI. |
| Sort drawer | `source/components/portal/sort-drawer.tsx` | Applied/draft server-sort selection UI. |
| Semantic table | `source/components/ui/server-table.tsx` | Captioned server-result table and labelled responsive cells. |
| Forms/controls | `source/components/ui/forms.tsx` | Shared field controls used by directory interactions. |
| Page primitives | `source/components/ui/primitives.tsx` | Header, button, badge, avatar, alerts, and page stack. |
| Dialog/drawer behavior | `source/components/ui/interactive.tsx` | Shared dialog and drawer focus/closure behavior. |
| Styling | `source/app/globals.css` | Full cascade, tokens, shell/layout rules, Students toolbar/table rules, and responsive presentation. |

