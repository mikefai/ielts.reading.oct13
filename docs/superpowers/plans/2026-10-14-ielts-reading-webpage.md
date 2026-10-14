# IELTS Academic Reading Strategy Webpage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, responsive, locally runnable lesson that teaches and lets learners practise four IELTS Academic Reading question types.

**Architecture:** `index.html` contains the complete lesson, semantic structure, and accessible challenge forms. `styles.css` owns the visual system and responsive behavior; `script.js` adds answer checking and optional progress/navigation enhancement without hiding essential lesson content.

**Tech Stack:** HTML5, CSS, vanilla JavaScript; no build tool or external assets.

**Spec:** `docs/superpowers/specs/2026-10-14-ielts-reading-webpage.md`

## Global Constraints

- One standalone page must open locally without a build tool, account, backend, or network dependency.
- IELTS Academic Reading has **three sections, 40 questions, and 60 minutes total**; link to `https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading` without implying IELTS endorsement.
- Keep foundation guidance on skimming, scanning, keywords, and flexible pacing; all four question types and their core three-step methods; a final strategy checklist.
- Each module needs a one-sentence golden rule, a worked example or interactive challenge, and a student action or review item.
- Completion answers must obey the stated word limit and use exact passage words when requested. Headings must capture the main idea; multiple choice needs passage evidence for the particular question.
- Provide semantic landmarks/headings, keyboard operation, visible focus, accessible contrast, reduced-motion support, and a narrow-mobile layout.
- Include a descriptive title and meta description; use only local CSS and JavaScript.

## Review Focus

- No answer selected: checking a challenge requests a selection without revealing success or throwing an error (Task 3).
- Wrong answer selected: feedback explains the passage evidence and lets the learner retry (Task 3).
- Keyboard-only use: every challenge and lesson jump works in tab order with visible focus (Tasks 2–3).
- Narrow screen at 320px: evidence matrix remains readable without clipping the viewport (Task 2).
- JavaScript unavailable: the full lesson, examples, takeaways, and official source remain readable (Tasks 1 and 3).

---

### Task 1: Complete lesson and accessible structure

**Files:**
- Create: `index.html`

**Interfaces:**
- Produces: `#main-content`, `#foundation`, `#true-false-not-given`, `#matching-headings`, `#completion`, `#multiple-choice`, `#review`; four `<form class="challenge" data-answer="...">` elements, each with radio inputs named `answer`, a submit button, and a feedback element with `aria-live="polite"` for Task 3.

- [x] **Step 1: Define a content/browser acceptance check.** Opening `index.html` with JavaScript disabled must show a title, description metadata, hero promise, the exact test facts, foundation toolbox, four numbered modules in the order above, final checklist, and the official source link. Each module must visibly contain a golden rule, a three-step method, a passage-based example, and an actionable takeaway.
- [x] **Step 2: Create `index.html`.** Use `header`, `nav`, `main`, `section`, and `footer`, one H1, ordered heading levels, a skip link, local CSS/JS references, and plain text or CSS decoration only. Include: (1) a T/F/NG three-column evidence matrix for support, contradiction, and absent information; (2) Matching Headings where a heading covers a paragraph's main idea; (3) completion with an explicit `NO MORE THAN TWO WORDS FROM THE PASSAGE` instruction and an answer copied exactly from its passage; (4) multiple choice whose correct option answers the stated question from passage evidence. Use flexible time budgeting and advice to move on when stuck; omit rigid per-passage/per-question time limits.
- [x] **Step 3: Verify content in a local browser with JavaScript disabled.** Check all anchors resolve, examples and takeaways remain readable, the matrix has correct column headers, and no asset request needs the network. Expected: the full lesson is usable without the challenges' checking behavior.

### Task 2: Responsive academic visual design

**Files:**
- Create: `styles.css`
- Modify: `index.html` only for class hooks needed by the design.

**Interfaces:**
- Consumes: Task 1 landmarks, section IDs, matrix, and challenge form hooks.
- Produces: responsive layout and interaction states without requiring JavaScript.

- [x] **Step 1: Define visual checks.** At 1440px, 375px, and 320px, the hero, toolbox, modules, forms, and checklist must fit without horizontal page overflow. At 320px, the evidence matrix may scroll within its own labeled container. Keyboard focus must be obvious; reduced-motion preference must suppress nonessential transitions/animation.
- [x] **Step 2: Create `styles.css`.** Establish warm off-white canvas, deep ink/navy type, teal accents, restrained coral highlights, editorial typographic hierarchy using local/system fonts, generous spacing, and crisp cards. Style desktop and narrow-mobile layouts, matrix overflow, buttons, feedback states, skip link, focus indicators, and `prefers-reduced-motion` behavior. Keep normal text and interactive controls at accessible contrast.
- [x] **Step 3: Inspect in the browser at the specified widths and with reduced motion enabled.** Expected: no viewport clipping, readable matrix, clear hierarchy, and visible focus when tabbing from the skip link through each form.

### Task 3: Answer checks and end-to-end browser verification

**Files:**
- Create: `script.js`
- Modify: `index.html` only to add answer/explanation data or progress hooks needed by the script.

**Interfaces:**
- Consumes: each `form.challenge` with `data-answer`, a radio group named `answer`, and an `aria-live="polite"` feedback element; optional progress hooks in `index.html`.
- Produces: `initChallenges(): void` on `DOMContentLoaded`; each form handles `submit` and updates only its own feedback. Correct answer keys and evidence explanations come from the form's HTML data/content rather than a duplicated JavaScript question bank.

- [ ] **Step 1: Record challenge checks before implementation.** For each of the four forms, submit the correct and an incorrect option by mouse and by keyboard; check that only that form's feedback changes. Submit with nothing selected; check for a selection prompt. For T/F/NG, exercise support, contradiction, and absent-information distinctions across its matrix/example and challenge. Expected before this task: checks do not provide feedback.
- [x] **Step 2: Implement `initChallenges(): void` in `script.js`.** Prevent form navigation, read the checked radio safely, compare with the form's `data-answer`, and write concise evidence-based feedback into its live region. Keep retry possible and do not erase selections or reveal an answer on an empty submission. If adding progress, count only challenges answered correctly and expose the count as text.
- [x] **Step 3: Run the checks from Step 1 in a local browser.** Expected: correct/incorrect/unanswered cases behave as specified, Enter/Space operate the forms, feedback is announced through the live region, lesson anchor links work, and no console errors appear.
- [x] **Step 4: Repeat a full-page smoke review at 1440px, 375px, and 320px, then disable JavaScript.** Expected: all four modules and final checklist remain available; the page makes no external asset requests; the official IELTS link is the sole optional outbound reference.
