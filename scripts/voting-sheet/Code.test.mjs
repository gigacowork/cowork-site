import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const rows = [['Время', 'ID браузера', 'Вопрос', 'Ответ']];
const stored = new Map();
const triggers = [];
let sheetCalls = 0;
let nextId = 1;
let failDeleteOnce = false;

const sheet = {
  getLastRow() { sheetCalls += 1; return rows.length; },
  getMaxColumns() { sheetCalls += 1; return 26; },
  setFrozenRows() { sheetCalls += 1; },
  appendRow(row) { sheetCalls += 1; rows.push(row); },
  getRange(startRow, startColumn, height = 1, width = 1) {
    sheetCalls += 1;
    return {
      getValues() {
        sheetCalls += 1;
        return Array.from({ length: height }, (_, rowIndex) =>
          Array.from({ length: width }, (_, columnIndex) =>
            rows[startRow - 1 + rowIndex]?.[startColumn - 1 + columnIndex] ?? ''));
      },
      setValues(values) {
        sheetCalls += 1;
        values.forEach((row, rowIndex) => {
          const target = startRow - 1 + rowIndex;
          rows[target] ??= [];
          row.forEach((value, columnIndex) => { rows[target][startColumn - 1 + columnIndex] = value; });
        });
      },
      getValue() { sheetCalls += 1; return rows[startRow - 1]?.[startColumn - 1] ?? ''; },
      setValue(value) { sheetCalls += 1; rows[startRow - 1][startColumn - 1] = value; },
    };
  },
};

const properties = {
  setProperty(key, value) { stored.set(key, value); return this; },
  getProperties() { return Object.fromEntries(stored); },
  getKeys() { return [...stored.keys()]; },
  deleteProperty(key) {
    if (failDeleteOnce) { failDeleteOnce = false; throw new Error('Simulated crash after sheet write'); }
    stored.delete(key);
    return this;
  },
};

const context = {
  console,
  Set,
  PropertiesService: { getScriptProperties: () => properties },
  SpreadsheetApp: {
    openById: () => ({ getSheetByName: () => sheet }),
    flush: () => {},
  },
  ScriptApp: {
    getProjectTriggers: () => triggers,
    newTrigger: (handler) => ({ timeBased: () => ({ everyMinutes: () => ({ create: () => triggers.push({ getHandlerFunction: () => handler }) }) }) }),
  },
  LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
  Utilities: { getUuid: () => `00000000-0000-4000-8000-${String(nextId++).padStart(12, '0')}` },
  ContentService: {
    MimeType: { JSON: 'json', JAVASCRIPT: 'javascript' },
    createTextOutput: (text) => ({ text, setMimeType() { return this; } }),
  },
};

runInNewContext(readFileSync(new URL('./Code.gs', import.meta.url), 'utf8'), context, { filename: 'Code.gs' });
context.setupVotingSheet();
context.setupVotingSheet();
assert.equal(triggers.length, 1, 'setup creates one recurring trigger');
assert.equal(rows[0][4], 'Ключ голоса', 'setup upgrades the existing sheet');

function addVote(index, questionId = 'question-1') {
  const voterId = `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`;
  const answer = index % 2 ? 'no' : 'yes';
  const response = JSON.parse(context.doPost({ parameter: { voterId, questionId, answer } }).text);
  assert.equal(response.ok, true);
}

function results() {
  const response = context.doGet({ parameter: { action: 'results', callback: 'testCallback' } }).text;
  return JSON.parse(response.slice('testCallback('.length, -2));
}

sheetCalls = 0;
for (let i = 1; i <= 300; i += 1) addVote(i);
assert.equal(sheetCalls, 0, 'incoming votes never touch the spreadsheet');
assert.equal(stored.size, 300, 'all votes are queued');
assert.equal(results().total, 300, 'stage results include queued votes');

failDeleteOnce = true;
assert.throws(() => context.flushVotingQueue(), /Simulated crash/);
assert.equal(rows.length, 301, 'the first batch was written before the simulated crash');
assert.equal(results().total, 300, 'a queued copy of a written vote is not counted twice');

context.flushVotingQueue();
assert.equal(rows.length, 301, 'retry does not append duplicates');
assert.equal(stored.size, 0, 'retry clears the queue');
assert.equal(results().total, 300, 'results remain stable after flushing');

addVote(301, 'question-2');
context.clearVotingQueue();
assert.equal(stored.size, 0, 'reset clears pending votes');
assert.equal(results().total, 300, 'reset does not delete saved votes');
console.log('Voting queue tests passed');
