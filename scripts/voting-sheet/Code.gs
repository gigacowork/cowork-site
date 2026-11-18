// Вставьте этот файл целиком в «Расширения → Apps Script» указанной таблицы.
const VOTING_SPREADSHEET_ID = '1dy35NRxTSYDKEDIgACOt3cJnRHPx7jtMTkaLzHTIzTs';
const VOTING_SHEET_NAME = 'Голоса';
const VOTING_QUESTION_IDS = ['question-1', 'question-2', 'question-3', 'question-4'];
const VOTING_HEADERS = ['Время', 'ID браузера', 'Вопрос', 'Ответ', 'Ключ голоса'];
const VOTING_QUEUE_PREFIX = 'cowork-vote-v1:';
const VOTING_BATCH_SIZE = 500;

function setupVotingSheet() {
  getOrCreateVotingSheet_();
  const hasTrigger = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === 'flushVotingQueue';
  });
  if (!hasTrigger) ScriptApp.newTrigger('flushVotingQueue').timeBased().everyMinutes(1).create();
}

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const callback = String(params.callback || '');
  if (!/^[A-Za-z_$][\w$]{0,99}$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback');
  }

  try {
    if (params.action !== 'results' && params.action !== 'snapshot') {
      throw new Error('Invalid action');
    }
    if (params.action === 'snapshot' && !isValidVoterId_(params.voterId)) {
      throw new Error('Invalid voter ID');
    }

    const data = readVotingData_(params.action === 'snapshot' ? params.voterId : null);
    const response = params.action === 'snapshot' ? data : data.results;
    return jsonp_(callback, response);
  } catch (error) {
    console.error(error);
    return jsonp_(callback, { error: 'Voting service unavailable' });
  }
}

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {};
  if (!isValidVoterId_(params.voterId) ||
      VOTING_QUESTION_IDS.indexOf(params.questionId) === -1 ||
      (params.answer !== 'yes' && params.answer !== 'no')) {
    return json_({ ok: false, error: 'Invalid vote' });
  }

  try {
    const key = VOTING_QUEUE_PREFIX + Utilities.getUuid();
    PropertiesService.getScriptProperties().setProperty(key, JSON.stringify({
      voterId: params.voterId,
      questionId: params.questionId,
      answer: params.answer,
      submittedAt: new Date().toISOString(),
    }));
    return json_({ ok: true, queued: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: 'Queue failed' });
  }
}

function flushVotingQueue() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const queued = readQueuedVotes_().sort(function (a, b) {
      return a.submittedAt.localeCompare(b.submittedAt);
    }).slice(0, VOTING_BATCH_SIZE);
    if (!queued.length) return;

    const sheet = getOrCreateVotingSheet_();
    const lastRow = sheet.getLastRow();
    const savedKeys = new Set(lastRow > 1
      ? sheet.getRange(2, 5, lastRow - 1, 1).getValues().map(function (row) { return row[0]; })
      : []);
    const newRows = queued.filter(function (vote) { return !savedKeys.has(vote.key); })
      .map(function (vote) {
        return [new Date(vote.submittedAt), vote.voterId, vote.questionId, vote.answer, vote.key];
      });
    if (newRows.length) {
      sheet.getRange(lastRow + 1, 1, newRows.length, VOTING_HEADERS.length).setValues(newRows);
      SpreadsheetApp.flush();
    }

    const properties = PropertiesService.getScriptProperties();
    queued.forEach(function (vote) { properties.deleteProperty(vote.key); });
  } finally {
    lock.releaseLock();
  }
}

// Запускайте при сбросе таблицы, чтобы ожидающие голоса не появились после очистки.
function clearVotingQueue() {
  const properties = PropertiesService.getScriptProperties();
  properties.getKeys().filter(function (key) { return key.indexOf(VOTING_QUEUE_PREFIX) === 0; })
    .forEach(function (key) { properties.deleteProperty(key); });
}

function readVotingData_(voterId) {
  const questions = {};
  VOTING_QUESTION_IDS.forEach(function (id) {
    questions[id] = { yes: 0, no: 0 };
  });

  const ownAnswers = {};
  let updatedAt = null;
  let total = 0;
  const savedKeys = new Set();
  function countVote(questionId, answer, browserId, date) {
    if (!questions[questionId] || (answer !== 'yes' && answer !== 'no')) return;
    questions[questionId][answer] += 1;
    total += 1;
    if (voterId && browserId === voterId) ownAnswers[questionId] = answer;
    if (date && (!updatedAt || date > updatedAt)) updatedAt = date;
  }
  const sheet = SpreadsheetApp.openById(VOTING_SPREADSHEET_ID).getSheetByName(VOTING_SHEET_NAME);
  if (sheet && sheet.getLastRow() > 1) {
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, VOTING_HEADERS.length).getValues();
    rows.forEach(function (row) {
      if (row[4]) savedKeys.add(row[4]);
      const date = row[0] instanceof Date && !isNaN(row[0].getTime()) ? row[0].toISOString() : null;
      countVote(row[2], row[3], row[1], date);
    });
  }
  readQueuedVotes_().forEach(function (vote) {
    if (!savedKeys.has(vote.key)) countVote(vote.questionId, vote.answer, vote.voterId, vote.submittedAt);
  });
  return { ownAnswers: ownAnswers, results: { total: total, questions: questions, updatedAt: updatedAt } };
}

function readQueuedVotes_() {
  const values = PropertiesService.getScriptProperties().getProperties();
  return Object.keys(values).filter(function (key) { return key.indexOf(VOTING_QUEUE_PREFIX) === 0; })
    .map(function (key) {
      try {
        const vote = JSON.parse(values[key]);
        if (!isValidVoterId_(key.slice(VOTING_QUEUE_PREFIX.length)) ||
            !isValidVoterId_(vote.voterId) ||
            VOTING_QUESTION_IDS.indexOf(vote.questionId) === -1 ||
            (vote.answer !== 'yes' && vote.answer !== 'no') ||
            typeof vote.submittedAt !== 'string' ||
            isNaN(new Date(vote.submittedAt).getTime())) return null;
        return { key: key, voterId: vote.voterId, questionId: vote.questionId,
          answer: vote.answer, submittedAt: vote.submittedAt };
      } catch (error) {
        console.error(error);
        return null;
      }
    }).filter(function (vote) { return vote !== null; });
}

function getOrCreateVotingSheet_() {
  const spreadsheet = SpreadsheetApp.openById(VOTING_SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(VOTING_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(VOTING_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(VOTING_HEADERS);
    sheet.setFrozenRows(1);
  } else {
    if (sheet.getMaxColumns() < VOTING_HEADERS.length) sheet.insertColumnAfter(4);
    if (sheet.getRange(1, 5).getValue() !== VOTING_HEADERS[4]) sheet.getRange(1, 5).setValue(VOTING_HEADERS[4]);
  }
  return sheet;
}

function isValidVoterId_(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function jsonp_(callback, value) {
  return ContentService.createTextOutput(callback + '(' + JSON.stringify(value) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
