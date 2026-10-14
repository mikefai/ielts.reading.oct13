# IELTS Academic Reading practice

A static, original study site for advanced IELTS Academic Reading preparation. It contains a strategy lesson, a guided full practice, and a separate timed mock exam.

## Open the site

Open `index.html` in a browser, or serve the folder with any static web server. The two exam pages are `practice.html` and `mock.html`. No build step, account, or external package is required.

## What students get

- **Guided practice:** three passages and 40 questions, with optional hints, individual answer checks, a final score, and explanations linked to the relevant paragraph.
- **Mock exam:** three different passages and 40 questions, a 60-minute timer, automatic submission at the limit, and feedback after submission.
- **Progress:** answers and the mock start time are saved in the current browser so a page reload does not erase an attempt. “Start again” clears that attempt.

Both papers use original passages and are unofficial. A raw score is useful for practice, but this site cannot award an official IELTS band score.

## Content checks

Run `node tests/exams.test.cjs` to check the passage and question counts, numbering, answer keys, evidence links, and total passage lengths. The site was also checked in a browser at desktop, tablet, and narrow phone widths, including answer submission, scoring, saved state, and timer expiry.
