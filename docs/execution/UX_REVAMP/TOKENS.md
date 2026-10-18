# Presentation tokens

These named presets are the approved presentation inputs. Components consume semantic variables; they must not hardcode preset colours. If measured contrast fails, adjust the smallest affected token within its hue family and record the old/new values and ratios.

## Theme catalogue

Token order is canvas, surface, surface-subtle, text, text-muted, border, primary, primary-hover, primary-pressed, on-primary, selection-bg, selection-text, sidebar-bg, sidebar-text, sidebar-muted, sidebar-hover, sidebar-active, sidebar-active-text, focus-ring.

| Token | Forest | Amethyst | Porcelain | Linen |
|---|---|---|---|---|
| `--vs-canvas` | `#F6F8F5` | `#FAF8FC` | `#F7F9FC` | `#FAF9F6` |
| `--vs-surface` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| `--vs-surface-subtle` | `#EEF3EF` | `#F2EDF6` | `#EFF3F8` | `#F2EEE7` |
| `--vs-text` | `#1F3028` | `#2B2333` | `#19283F` | `#302C27` |
| `--vs-text-muted` | `#56665D` | `#6B6075` | `#596A80` | `#6C6358` |
| `--vs-border` | `#DCE5DF` | `#E5DFEB` | `#DCE4EF` | `#E4DFD6` |
| `--vs-primary` | `#246B53` | `#7045A2` | `#284FAC` | `#795237` |
| `--vs-primary-hover` | `#1D5945` | `#5E378C` | `#214292` | `#66442E` |
| `--vs-primary-pressed` | `#174837` | `#4E2C77` | `#1B3577` | `#533723` |
| `--vs-on-primary` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| `--vs-selection-bg` | `#E4F0E9` | `#EEE5F6` | `#E5EDFB` | `#EFE4D7` |
| `--vs-selection-text` | `#194D3B` | `#57317B` | `#21458F` | `#654229` |
| `--vs-sidebar-bg` | `#183D33` | `#30223E` | `#EFF3F9` | `#EDE9E2` |
| `--vs-sidebar-text` | `#EDF5F0` | `#F1EBF6` | `#24354D` | `#332D26` |
| `--vs-sidebar-muted` | `#B9CFC3` | `#C8B9D5` | `#5B6C83` | `#6D6256` |
| `--vs-sidebar-hover` | `#214B3F` | `#3D2B4E` | `#E4EBF5` | `#E5DED3` |
| `--vs-sidebar-active` | `#2B584A` | `#503860` | `#D9E5F8` | `#DED1BF` |
| `--vs-sidebar-active-text` | `#FFFFFF` | `#FFFFFF` | `#1B408A` | `#4F3623` |
| `--vs-focus-ring` | `#246B53` | `#7045A2` | `#284FAC` | `#795237` |

## Shared semantic status

| Status | Background | Text | Border |
|---|---|---|---|
| Success | `#EAF5EE` | `#24613C` | `#CFE5D5` |
| Warning | `#FFF4DE` | `#805000` | `#EED7A5` |
| Danger | `#FCECEE` | `#A52B3B` | `#F0CBD0` |
| Info | `#EDF3FC` | `#28558C` | `#D2DFF2` |
| Neutral | `#F0F2F4` | `#4B5563` | `#DEE2E7` |

Raised surface is `#FFFFFF`; dialog backdrop is `rgba(16,24,20,0.40)`. Divider follows theme border. Placeholder and disabled text follow theme muted text. Disabled backgrounds follow theme subtle surface and retain explicit semantic/accessible disabled state.

## Typography

Self-hosted Inter is the target. Required fallback: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Final exact captures wait for the asset; fallback captures are labelled as such. Metrics, dates, times, and numeric table columns use tabular numerals.

| Use | Size / line height | Weight | Other |
|---|---|---|---|
| Page title | 28 / 36 px | 600 | `-0.02em`; mobile 24 / 32 px |
| Section title | 18 / 26 px | 600 | — |
| Card title | 16 / 24 px | 600 | — |
| Body | 14 / 22 px | 400 | — |
| Form label | 14 / 20 px | 500 | — |
| Navigation | 14 / 20 px | 500 / 600 active | — |
| Supporting | 12 / 18 px | 400 | — |
| Group label | 11 / 16 px | 600 | `0.08em`, uppercase only here |
| Metric | 30 / 36 px | 600 | tabular |
| Button | 14 / 20 px | 600 | — |
| Badge | 12 / 18 px | 500 | — |

Mobile editable input text is at least 16px.

## Geometry and spacing

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.
- Sidebar 240px; topbar 64px; desktop padding 32px; max content 1440px centred.
- Header/section/dashboard gaps 24px. Card padding 24px; compact 16px. Field gap 16px; form section gap 24px.
- Breakpoints: ≥1200 full sidebar/32px; 1024–1199 full sidebar/24px; 768–1023 drawer/24px; <768 drawer/16px.
- Radii: card 12px, input/button 8px, badge 6px, dialog 16px, popover 10px.
- One-pixel borders; floating shadow `0 8px 24px rgba(20,30,25,0.12)`. Cards primarily use borders.
- Buttons: 40px default, 44px coarse/mobile, 16px horizontal padding, 8px icon gap. Inputs/selects at least 44px.
- Focus: 2px ring with 2px offset. Icon-only targets: 44×44px.
- Table header/body minimum 40/56px; cells 12px vertical/16px horizontal; one-action column 112px.
- Staged content max 760px plus optional 320px support panel, 24px gap.
- Theme choice preview: 16px padding, 96px preview height, 12px radius, 44px minimum hit area, 16px grid gap.

No fixed-height cards for screenshot matching, document-level horizontal overflow, gradients, glow, glass, or decorative textures.
