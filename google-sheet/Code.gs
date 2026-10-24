/**
 * Home Central - Nhận lead từ form website vào Google Sheet.
 * ĐÃ TRIỂN KHAI (deployed) dưới dạng standalone Web App gắn với Sheet:
 *   Sheet ID: 16ZASdxLui7FAKXN-97gu2qBU9VEflZ5B8HJAhe_pkxs
 *   Web app : https://script.google.com/macros/s/AKfycbz_chsPLR8IVD1W7cv5kifhyXn1dGBFKE_RyXTy-afDeXwX0jyvoAsKpl7cKYhVroMWUg/exec
 * Nếu cần chỉnh: mở script.google.com > dự án, sửa, rồi Deploy > Manage deployments
 * > (bút chì) > Version: New version > Deploy để bản mới có hiệu lực.
 */

var SHEET_ID = '16ZASdxLui7FAKXN-97gu2qBU9VEflZ5B8HJAhe_pkxs';
var SHEET_NAME = 'Leads';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Thoi gian', 'Ho va ten', 'So dien thoai', 'Email', 'Nguon']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    var p = (e && e.parameter) ? e.parameter : null;
    if (!p || (!p.name && !p.phone && !p.email)) { return json({ ok: false, error: 'empty' }); }
    sheet.appendRow([new Date(), p.name || '', "'" + (p.phone || ''), p.email || '', p.source || '']);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Home Central lead endpoint: OK');
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Chạy 1 lần khi cần dọn dẹp: đưa tab Leads lên đầu, xoá tab trống + dòng rỗng.
function tidy() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var leads = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  ss.setActiveSheet(leads); ss.moveActiveSheet(1);
  ss.getSheets().forEach(function (sh) { if (sh.getName() !== SHEET_NAME && sh.getLastRow() === 0) ss.deleteSheet(sh); });
  var last = leads.getLastRow();
  for (var r = last; r >= 2; r--) {
    var v = leads.getRange(r, 2, 1, 3).getValues()[0];
    if (!v[0] && !v[1] && !v[2]) leads.deleteRow(r);
  }
  leads.setFrozenRows(1); leads.autoResizeColumns(1, 5);
  return 'tidy done';
}
