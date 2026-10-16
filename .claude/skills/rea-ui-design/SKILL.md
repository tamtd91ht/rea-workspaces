---
name: rea-ui-design
description: Run the design stage of a workspace project — read the requirements and existing design constraints, generate design-system recommendations with UI UX Pro Max into the project's design/ folder, review them with the user, and record accepted decisions before handing off to engineering. Use when a project has a user-facing interface to design or redesign.
argument-hint: "<project-id> [what to design]"
---

# Design stage (UI UX Pro Max)

Coordinates the installed `ui-ux-pro-max` skill; it does not replace it. Do not
use this for backend-only, infrastructure-only or investigation-only work —
set the stage to "not applicable" instead.

## 0. Project

Project from `$ARGUMENTS` (ask if missing; `node scripts/check.mjs projects`).
`node scripts/active-project.mjs set <id>`. The project must include the
design module (`design/` exists). If not, ask before adding
`design/design-brief.md` and `design/design-system.md` from `templates/`.

## 1. Requirements and constraints

Read `README.md`, `design/design-brief.md`, `plans/decisions.md` and — for
combined projects — the findings that motivate the design (F-###). Establish:
users and primary tasks, journeys, platform and stack, accessibility target,
and any **existing design system or component library**. Ask concise
questions for gaps. Never replace an existing design system without the
user's explicit approval; when one exists, use UI UX Pro Max only for gaps
(UX guidelines, states, accessibility) and record that choice as a decision.

## 2. Generate recommendations

Use the installed script (verified flags; Python 3 standard library, offline):

```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "<product type + domain + keywords>" \
  --design-system -f markdown -p "<Project Name>" \
  --persist --output-dir projects/<id>/design
# page-specific overrides:
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system \
  -p "<Project Name>" --persist --page "<page>" --output-dir projects/<id>/design
# focused lookups:
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux|style|color|typography|chart|icons
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
```

Always pass `--output-dir projects/<id>/design` with `--persist` (the default
is the current directory, i.e. the workspace root). Optional dials:
`--density`, `--motion`, `--variance` (1–10).

Do **not** run the `design` skill's logo/icon/CIP generators (Gemini API,
needs `GEMINI_API_KEY`, sends prompts to Google) or `ui-styling`'s
`shadcn_add.py` (runs `npx shadcn`, network) without explicit user approval.

## 3. Review with the user

Present the proposal compactly: style, palette (with contrast pairs), type
pairing, spacing/density, layout pattern, key components, motion, states.
Flag anything that conflicts with constraints. The user accepts, adjusts or
rejects each area.

## 4. Record

- `design/design-system.md`: accepted decisions with their source, rejected
  alternatives and why, accessibility and state requirements, page overrides.
- `plans/decisions.md`: a `D-###` for each significant choice.
- `project.yaml`: `status: design`, `updated: <today>`.

## 5. Hand off

Hand off to `/rea-engineering <id>` with the accepted design as input.
Recommendations are not verification: the test plan must still check
contrast, keyboard/focus, responsive layout, and loading/empty/error/success
states in the implemented UI.
