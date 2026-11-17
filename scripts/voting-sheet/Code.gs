// Вставьте этот файл целиком в «Расширения → Apps Script» указанной таблицы.
const VOTING_SPREADSHEET_ID = '1dy35NRxTSYDKEDIgACOt3cJnRHPx7jtMTkaLzHTIzTs';
const VOTING_SHEET_NAME = 'Голоса';
const VOTING_QUESTION_IDS = ['question-1', 'question-2', 'question-3', 'question-4'];
const VOTING_HEADERS = ['Время', 'ID браузера', 'Вопрос', 'Ответ'];

function setupVotingSheet() {
  getOrCreateVotingSheet_();
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

  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    lock.waitLock(30000);
    locked = true;
    const sheet = getOrCreateVotingSheet_();
    const rows = sheet.getLastRow() > 1
      ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 2).getValues()
      : [];
    const alreadyVoted = rows.some(function (row) {
      return row[0] === params.voterId && row[1] === params.questionId;
    });
    if (alreadyVoted) return json_({ ok: false, error: 'Already voted' });

    sheet.appendRow([new Date(), params.voterId, params.questionId, params.answer]);
    SpreadsheetApp.flush();
    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: 'Write failed' });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function readVotingData_(voterId) {
  const questions = {};
  VOTING_QUESTION_IDS.forEach(function (id) {
    questions[id] = { yes: 0, no: 0 };
  });

  const ownAnswers = {};
  let updatedAt = null;
  let total = 0;
  const sheet = SpreadsheetApp.openById(VOTING_SPREADSHEET_ID).getSheetByName(VOTING_SHEET_NAME);
  if (sheet && sheet.getLastRow() > 1) {
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
    rows.forEach(function (row) {
      const questionId = row[2];
      const answer = row[3];
      if (!questions[questionId] || (answer !== 'yes' && answer !== 'no')) return;
      questions[questionId][answer] += 1;
      total += 1;
      if (voterId && row[1] === voterId) ownAnswers[questionId] = answer;
      if (row[0] instanceof Date && !isNaN(row[0].getTime())) {
        const date = row[0].toISOString();
        if (!updatedAt || date > updatedAt) updatedAt = date;
      }
    });
  }
  return { ownAnswers: ownAnswers, results: { total: total, questions: questions, updatedAt: updatedAt } };
}

function getOrCreateVotingSheet_() {
  const spreadsheet = SpreadsheetApp.openById(VOTING_SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(VOTING_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(VOTING_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(VOTING_HEADERS);
    sheet.setFrozenRows(1);
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
