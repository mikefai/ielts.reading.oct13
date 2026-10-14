# IELTS Academic Reading strategy webpage spec

## Goal

Turn the user-supplied lesson on IELTS Academic Reading into a polished, responsive, self-contained course webpage for intermediate to advanced learners. The page should teach students what to do during the test and let them practise each technique immediately.

## Source material and editorial requirements

The source lesson includes a foundation section on skimming, scanning, keywords, and pacing; modules for True / False / Not Given, Matching Headings, Sentence and Summary Completion, and Multiple Choice; and a final strategy checklist. Keep all four question types and the core three-step methods while tightening explanations, adding realistic examples, and using clear command language. Each module needs a one-sentence golden rule, a worked example or interactive challenge, and a student action or review item. The T/F/NG section needs a three-column evidence matrix that distinguishes support, contradiction, and absent information.

Correct factual problems in the supplied draft:

- IELTS Academic Reading has **three sections, 40 questions, and 60 minutes total**, per https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading .
- Do not prescribe five minutes of skimming for every passage or a rigid one-minute limit for each question. Present a flexible passage budget and advise moving on when stuck.
- For sentence/summary completion, follow the specific task's word limit and instructions. When instructions say to use words from the passage, copy the answer words exactly; questions may paraphrase the context, but the answer must respect the source wording. Do not invent a synonym such as "affected" if the passage says "impacted".
- For Matching Headings, choose the heading covering the paragraph's main idea, not simply the broadest heading.
- For Multiple Choice, the correct choice must answer the particular question and agree with the passage; grammar alone is not evidence.

## Experience and visual direction

- One standalone page that can be opened locally without a build tool, account, backend, or network dependency. Use semantic HTML, a local stylesheet, and a small local script.
- Premium academic course feel: warm off-white canvas, deep ink/navy text, teal accent, restrained coral highlights, editorial typography, generous whitespace, and crisp cards. Avoid an emoji-heavy look.
- Clear hero with the promise, test facts, and a primary jump into the lesson. Include a compact strategy toolbox and four distinct numbered modules.
- Responsive layout for desktop and narrow mobile screens. Use accessible contrast, keyboard operability, visible focus, reduced-motion support, and meaningful headings/landmarks.
- Interactive elements should teach: short self-check challenges with a reveal/check action, and optional section navigation/progress. Avoid simulated controls that do nothing.
- Include a quick review checklist and source link to the official IELTS test format. Do not imply the page is officially endorsed by IELTS.
- Search metadata: descriptive title and meta description; no misleading SEO claims.

## Acceptance

Opening `index.html` should show a usable full lesson at common desktop and mobile widths. Each of the four modules should have an evidence-based mini example and an actionable takeaway. Interactive challenges should be operable by mouse and keyboard and should expose feedback to assistive technology. No external assets or dependencies should be needed.
