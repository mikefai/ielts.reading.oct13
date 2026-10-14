const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const lengths = [];
for (const file of ['guided-data.js', 'mock-data.js']) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
  const set = context.window.examSet;
  assert.equal(set.passages.length, 3, `${file}: passage count`);
  const questions = set.passages.flatMap(p => p.groups.flatMap(g => g.questions));
  assert.equal(questions.length, 40, `${file}: question count`);
  assert.deepEqual(Array.from(questions, q => q.n), Array.from({ length: 40 }, (_, i) => i + 1), `${file}: numbering`);
  let totalWords = 0;

  for (const passage of set.passages) {
    assert.ok(passage.paragraphs.length >= 6, `${file}: paragraph count`);
    const words = [passage.lead, ...passage.paragraphs].join(' ').match(/\b[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*\b/gu) || [];
    totalWords += words.length;
    for (const group of passage.groups) {
      if (group.type === 'headings') assert.ok(group.options.length > group.questions.length, `${file}: extra headings`);
      for (const q of group.questions) {
        assert.ok(q.prompt && q.answer && q.why && q.evidence, `${file}: complete question ${q.n}`);
        const evidenceIndex = q.evidence.charCodeAt(0) - 65;
        assert.ok(passage.paragraphs[evidenceIndex], `${file}: evidence paragraph ${q.n}`);
        if (group.type === 'mc') {
          assert.equal(q.options.length, 4, `${file}: four choices for ${q.n}`);
          assert.ok(q.options.some(([value]) => value === q.answer), `${file}: MC key ${q.n}`);
        }
        if (group.type === 'headings') assert.ok(group.options.some(([value]) => value === q.answer), `${file}: heading key ${q.n}`);
        if (group.type === 'matching') assert.ok(passage.paragraphs[q.answer.charCodeAt(0) - 65], `${file}: matching key ${q.n}`);
        if (group.type === 'completion') assert.ok(passage.paragraphs[evidenceIndex].toLowerCase().includes(q.answer.toLowerCase()), `${file}: text key ${q.n}`);
      }
    }
  }
  lengths.push([file, totalWords]);
  console.log(`${file}: 3 passages, 40 questions, ${totalWords} passage words, all keys valid`);
}
for (const [file, totalWords] of lengths) assert.ok(totalWords >= 2150 && totalWords <= 2750, `${file}: ${totalWords} passage words outside official paper range`);
