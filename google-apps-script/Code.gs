/**
 * Nandani — Orders database (Google Sheets)
 *
 * Setup:
 * 1. Create a new Google Sheet, then open Extensions > Apps Script.
 * 2. Paste this whole file into Code.gs and change SECRET below.
 * 3. Deploy > New deployment > type "Web app"
 *      Execute as: Me   |   Who has access: Anyone
 * 4. Copy the Web app URL and add these env vars to the website (v0 > Settings > Vars):
 *      GOOGLE_SHEETS_WEBHOOK_URL = <the web app URL>
 *      GOOGLE_SHEETS_SECRET      = <the same SECRET as below>
 * The "Orders" and "Subscribers" tabs are created automatically on the first request.
 */

const SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING";

const STATUSES = ["New", "Confirmed", "Paid", "Packed", "Shipped", "Delivered", "Cancelled"];

const ORDER_HEADERS = [
  "Timestamp",
  "Order ID",
  "Status",
  "Customer Name",
  "Phone",
  "Email",
  "Address",
  "City",
  "Pincode",
  "Items",
  "Total Qty",
  "Subtotal (INR)",
  "Notes",
];

const SUBSCRIBER_HEADERS = ["Timestamp", "Email", "Source"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!SECRET || data.secret !== SECRET) {
      return json({ ok: false, error: "Unauthorized" });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (data.type === "order") {
        const o = data.order;
        const sheet = getSheet("Orders", ORDER_HEADERS, true);
        sheet.appendRow([
          new Date(o.createdAt),
          safe(o.id),
          "New",
          safe(o.customer.name),
          "'" + String(o.customer.phone),
          safe(o.customer.email),
          safe(o.customer.address),
          safe(o.customer.city),
          "'" + String(o.customer.pincode),
          safe(o.itemsText),
          Number(o.totalQty),
          Number(o.subtotal),
          safe(o.customer.notes),
        ]);
      } else if (data.type === "subscriber") {
        const s = data.subscriber;
        const sheet = getSheet("Subscribers", SUBSCRIBER_HEADERS, false);
        sheet.appendRow([new Date(s.createdAt), safe(s.email), safe(s.source)]);
      } else {
        return json({ ok: false, error: "Unknown type" });
      }
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet(name, headers, withStatus) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet
      .getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#f5a3b7")
      .setFontColor("#2a0f1c");
    if (withStatus) {
      const rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
      sheet.getRange(2, 3, 5000, 1).setDataValidation(rule);
      sheet.getRange(2, 1, 5000, 1).setNumberFormat("dd MMM yyyy, hh:mm a");
      sheet.getRange(2, 12, 5000, 1).setNumberFormat("₹#,##0");
    }
  }
  return sheet;
}

// Prevents formula injection from user-entered text.
function safe(value) {
  const str = value == null ? "" : String(value);
  return /^[=+\-@]/.test(str) ? "'" + str : str;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
