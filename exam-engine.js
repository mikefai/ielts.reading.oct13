(function () {
  'use strict';

  const set = window.examSet;
  const mode = document.body.dataset.examMode;
  if (!set || !['guided', 'mock'].includes(mode)) return;

  const allQuestions = set.passages.flatMap(p => p.groups.flatMap(g => g.questions));
  if (set.passages.length !== 3 || allQuestions.length !== 40 || allQuestions.some((q, i) => q.n !== i + 1)) {
    throw new Error('Exam data must contain three passages and questions 1–40 in order.');
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const storageKey = `field-notes-${set.id}`;
  const tabs = $('#passage-tabs');
  const panel = $('#exam-panel');
  const results = $('#exam-results');
  const progress = $('#progress-text');
  const startButton = $('#start-exam');
  const timeLeft = $('#time-left');
  let activePassage = 0;
  let startedAt = null;
  let submitted = false;
  let timerId = null;

  function choicesFor(group, question, passage) {
    if (group.type === 'tfng') return [['TRUE', 'TRUE'], ['FALSE', 'FALSE'], ['NOT GIVEN', 'NOT GIVEN']];
    if (group.type === 'ynng') return [['YES', 'YES'], ['NO', 'NO'], ['NOT GIVEN', 'NOT GIVEN']];
    if (group.type === 'mc') return question.options;
    if (group.type === 'headings') return group.options;
    if (group.type === 'matching') return passage.paragraphs.map((_, i) => [String.fromCharCode(65 + i), String.fromCharCode(65 + i)]);
    return [];
  }

  function hintFor(question, group) {
    if (group.type === 'headings') return `Read paragraph ${question.evidence} as a whole. Summarise its main purpose before comparing headings.`;
    if (group.type === 'matching') return `Scan for the distinctive detail, then read paragraph ${question.evidence} carefully.`;
    if (group.type === 'completion') return `Locate the paraphrased idea in paragraph ${question.evidence}. Copy only the word or words that fit the gap and the limit.`;
    if (group.type === 'mc') return `Find the relevant claim in paragraph ${question.evidence}. Test every option against the whole sentence, not one matching word.`;
    return `Locate the relevant discussion in paragraph ${question.evidence}. Decide whether the claim is supported, contradicted or absent.`;
  }

  function renderQuestion(question, group, passageIndex, passage) {
    const label = `<span class="exam-q-number">${question.n.toString().padStart(2, '0')}</span>${escapeHtml(question.prompt)}`;
    let control = '';
    if (['tfng', 'ynng', 'mc'].includes(group.type)) {
      control = `<fieldset class="exam-choice-field"><legend>${label}</legend><div class="exam-options">${choicesFor(group, question, passage).map(([value, text]) => `<label><input type="radio" name="q${question.n}" value="${escapeHtml(value)}"><span>${escapeHtml(text)}</span></label>`).join('')}</div></fieldset>`;
    } else if (group.type === 'completion') {
      control = `<label class="exam-prompt" for="q${question.n}">${label}</label><input class="exam-text" id="q${question.n}" name="q${question.n}" type="text" autocomplete="off" spellcheck="false" placeholder="Type the passage word(s)">`;
    } else {
      control = `<label class="exam-prompt" for="q${question.n}">${label}</label><select class="exam-select" id="q${question.n}" name="q${question.n}"><option value="">Choose an answer</option>${choicesFor(group, question, passage).map(([value, text]) => `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`).join('')}</select>`;
    }
    const hint = mode === 'guided' ? `<button type="button" class="hint-button" data-hint="${question.n}" aria-expanded="false">Show a hint</button><p class="hint-text" id="hint-${question.n}" hidden>${escapeHtml(hintFor(question, group))}</p><button type="button" class="check-button" data-check="${question.n}">Check this answer</button>` : '';
    return `<div class="exam-question" data-question="${question.n}" data-answer="${escapeHtml(question.answer)}">${control}<div class="question-tools">${hint}<span class="question-status" aria-live="polite"></span></div><div class="answer-review" hidden><strong>Answer: ${escapeHtml(question.answer)}</strong><p>${escapeHtml(question.why)}</p><a href="#passage-${passageIndex + 1}-${question.evidence.toLowerCase()}">See passage ${passageIndex + 1}, paragraph ${question.evidence} ↗</a></div></div>`;
  }

  function renderGroup(group, passageIndex, passage) {
    const bank = group.type === 'headings' ? `<div class="heading-bank" aria-label="List of headings">${group.options.map(([value, label]) => `<p><b>${escapeHtml(value)}</b> ${escapeHtml(label)}</p>`).join('')}</div>` : '';
    return `<section class="question-group"><div class="group-heading"><span>${escapeHtml(group.type.toUpperCase())}</span><h3>${escapeHtml(group.title)}</h3><p>${escapeHtml(group.instructions)}</p></div>${bank}${group.questions.map(q => renderQuestion(q, group, passageIndex, passage)).join('')}</section>`;
  }

  function renderPassage(passage, index) {
    const range = passage.groups.flatMap(g => g.questions);
    const paragraphs = passage.paragraphs.map((text, i) => {
      const letter = String.fromCharCode(65 + i);
      const body = text.replace(/^[A-Z]\.\s*/, '');
      return `<section class="passage-paragraph" id="passage-${index + 1}-${letter.toLowerCase()}"><h3><span>${letter}</span> Paragraph ${letter}</h3><p>${escapeHtml(body)}</p></section>`;
    }).join('');
    return `<section class="exam-passage-panel" data-passage="${index}" ${index ? 'hidden' : ''}><div class="exam-two-column"><article class="reading-paper" aria-labelledby="passage-title-${index + 1}"><div class="paper-overline"><span>READING PASSAGE ${index + 1}</span><span>QUESTIONS ${range[0].n}–${range.at(-1).n}</span></div><h2 id="passage-title-${index + 1}">${escapeHtml(passage.title)}</h2><p class="paper-intro">${escapeHtml(passage.deck)}</p><p class="passage-lead">${escapeHtml(passage.lead)}</p>${paragraphs}</article><div class="answer-column"><div class="answer-intro"><p class="eyebrow"><span class="eyebrow-rule"></span> Answer sheet / Passage ${index + 1}</p><h2>Questions ${range[0].n}–${range.at(-1).n}</h2><p>Use the passage as your only evidence. ${mode === 'guided' ? 'Hints and individual checks are available whenever you need them.' : 'Answers and explanations appear after you submit the full paper.'}</p></div>${passage.groups.map(group => renderGroup(group, index, passage)).join('')}<div class="passage-actions">${index < 2 ? `<button type="button" class="button button-primary next-passage" data-next="${index + 1}">Continue to passage ${index + 2} →</button>` : `<button type="button" class="button button-primary submit-exam">Submit all 40 answers →</button>`}</div></div></div></section>`;
  }

  tabs.innerHTML = set.passages.map((passage, index) => `<button type="button" class="passage-tab" data-tab="${index}" ${index === 0 ? 'aria-current="page"' : ''}>Passage ${index + 1}<span>${index === 0 ? 'Questions 1–13' : index === 1 ? 'Questions 14–26' : 'Questions 27–40'}</span></button>`).join('');
  panel.innerHTML = set.passages.map(renderPassage).join('');

  function allAnswers() {
    const answers = {};
    allQuestions.forEach(question => {
      const box = $(`[data-question="${question.n}"]`, panel);
      answers[question.n] = $('input[type="radio"]:checked', box)?.value || $('input[type="text"], select', box)?.value || '';
    });
    return answers;
  }

  function saveState() {
    try { localStorage.setItem(storageKey, JSON.stringify({ answers: allAnswers(), startedAt, submitted, activePassage })); } catch (_) { /* Private browsing can block storage. */ }
  }

  function restoreState() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch (_) { return; }
    if (!saved || typeof saved !== 'object') return;
    allQuestions.forEach(question => {
      const value = saved.answers?.[question.n];
      if (!value) return;
      const box = $(`[data-question="${question.n}"]`, panel);
      const radio = $$('input[type="radio"]', box).find(input => input.value === value);
      if (radio) radio.checked = true;
      else {
        const field = $('input[type="text"], select', box);
        if (field) field.value = value;
      }
    });
    activePassage = Number.isInteger(saved.activePassage) && saved.activePassage >= 0 && saved.activePassage < 3 ? saved.activePassage : 0;
    startedAt = Number.isFinite(saved.startedAt) ? saved.startedAt : null;
    submitted = saved.submitted === true;
  }

  function switchPassage(index, scroll = true) {
    activePassage = index;
    $$('.exam-passage-panel', panel).forEach((section, i) => { section.hidden = i !== index; });
    $$('.passage-tab', tabs).forEach((tab, i) => {
      if (i === index) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
    saveState();
    if (scroll) tabs.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  function normalized(value) { return String(value).trim().replace(/\s+/g, ' ').toLocaleLowerCase('en'); }

  function updateProgress() {
    const count = Object.values(allAnswers()).filter(value => normalized(value)).length;
    progress.textContent = `${count} of 40 answered`;
  }

  function markQuestion(question, reveal, answers = allAnswers()) {
    const box = $(`[data-question="${question.n}"]`, panel);
    const answer = normalized(answers[question.n]);
    const correct = answer === normalized(question.answer);
    const status = $('.question-status', box);
    box.classList.remove('is-correct', 'is-wrong', 'is-unanswered');
    if (!answer) {
      box.classList.add('is-unanswered');
      status.textContent = reveal ? 'Unanswered — use the explanation below.' : 'Choose or type an answer before checking.';
    } else {
      box.classList.add(correct ? 'is-correct' : 'is-wrong');
      status.textContent = correct ? 'Correct — evidence found.' : 'Review the passage evidence.';
    }
    if (reveal || answer) $('.answer-review', box).hidden = false;
    return correct;
  }

  function finishExam(auto = false, restoring = false) {
    if (mode === 'mock' && !startedAt) return;
    submitted = true;
    if (timerId) { clearInterval(timerId); timerId = null; }
    const answers = allAnswers();
    let score = 0;
    const sectionScores = [];
    set.passages.forEach(passage => {
      const questions = passage.groups.flatMap(group => group.questions);
      const sectionScore = questions.reduce((count, question) => count + Number(markQuestion(question, true, answers)), 0);
      score += sectionScore;
      sectionScores.push(`${sectionScore}/${questions.length}`);
    });
    $('#score-text').textContent = `${score}/40 correct · passage scores ${sectionScores.join(' · ')}. ${score >= 35 ? 'You reached the 35/40 practice target.' : `${35 - score} more correct answers would reach the 35/40 practice target.`} This original set does not award an IELTS band.`;
    $('#section-scores').innerHTML = sectionScores.map((text, i) => `<span>Passage ${i + 1}: <strong>${text}</strong></span>`).join('');
    results.hidden = false;
    if (mode === 'mock') {
      $$('input, select', panel).forEach(control => { control.disabled = true; });
      if (startButton) startButton.hidden = true;
      if (timeLeft && auto) timeLeft.textContent = '00:00';
    }
    saveState();
    if (!restoring) {
      results.focus();
      results.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  function updateTimer() {
    if (!startedAt || submitted) return;
    const remaining = Math.max(0, 3600 - Math.floor((Date.now() - startedAt) / 1000));
    timeLeft.textContent = `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`;
    if (remaining === 0) finishExam(true);
  }

  function startMock(restoring = false) {
    if (!startedAt) startedAt = Date.now();
    $('#start-message').hidden = true;
    tabs.hidden = false;
    panel.hidden = false;
    startButton.hidden = true;
    saveState();
    updateTimer();
    if (!submitted && timerId === null) timerId = setInterval(updateTimer, 1000);
    if (!restoring) tabs.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  tabs.addEventListener('click', event => {
    const tab = event.target.closest('[data-tab]');
    if (tab) switchPassage(Number(tab.dataset.tab));
  });
  panel.addEventListener('click', event => {
    const next = event.target.closest('[data-next]');
    if (next) switchPassage(Number(next.dataset.next));
    const hint = event.target.closest('[data-hint]');
    if (hint) {
      const text = $(`#hint-${hint.dataset.hint}`, panel);
      text.hidden = !text.hidden;
      hint.setAttribute('aria-expanded', String(!text.hidden));
      hint.textContent = text.hidden ? 'Show a hint' : 'Hide hint';
    }
    const check = event.target.closest('[data-check]');
    if (check) markQuestion(allQuestions[Number(check.dataset.check) - 1], false);
    if (event.target.closest('.submit-exam')) finishExam();
  });
  panel.addEventListener('input', event => {
    const box = event.target.closest('.exam-question');
    if (!box) return;
    if (mode === 'guided') {
      box.classList.remove('is-correct', 'is-wrong', 'is-unanswered');
      $('.question-status', box).textContent = '';
      $('.answer-review', box).hidden = true;
      if (submitted) { submitted = false; results.hidden = true; }
    }
    updateProgress();
    saveState();
  });
  panel.addEventListener('change', event => {
    if (event.target.closest('.exam-question')) { updateProgress(); saveState(); }
  });
  $('#reset-exam').addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); } catch (_) { /* Ignore blocked storage. */ }
    location.reload();
  });
  if (startButton) startButton.addEventListener('click', () => startMock());

  restoreState();
  if (mode === 'mock' && startedAt) startMock(true);
  if (mode === 'guided') { tabs.hidden = false; panel.hidden = false; }
  switchPassage(activePassage, false);
  updateProgress();
  if (submitted && results.hidden) finishExam(false, true);
})();
