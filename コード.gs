// LINE Message API アクセストークン
var ACCESS_TOKEN = "<Messaging API管理画面で発行したアクセストークン>";
// 通知URL
var PUSH = "https://api.line.me/v2/bot/message/push";
// リプライ時URL
var REPLY = "https://api.line.me/v2/bot/message/reply";

function doPost(e) {
  // 投稿されたメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
   
  if(userMessage.match(/^\もくもく/)) {
    // 「もくもく」から始まるメッセージの場合、この後の文字列を再代入
    userMessage = userMessage.substr(4);
  } else {
    // 「もくもく」から始まらない場合は何もしない（処理終了）
    return;
  }

   
  // スプレッドシートへ保存=======================================
  var response = e.postData.getDataAsString();
  var spreadsheetId = "1yB1q8emCiBk5fMtE1Ln4SEUdhRlbMy9F8M5FG-lOzBE";
  var sheetName = "log";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
 
  // 空白・タブ・改行で区切り配列に変換  
  var arr = userMessage.split(/\s/);
 
  // 配列の先頭に日時を代入
  arr.unshift(new Date());

  // セルの最下部に配列を転記
  sheet.appendRow(arr);
  // =======================================
 
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
 
}

