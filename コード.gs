const BOTNAME="\もくもくらいん💭";

// ======================= //
//  大事な設定
// ======================= //

// チャネルアクセストークン
const ACCESS_TOKEN = "（ここに入力）";  //提出時に抜く

// ======================= //
//  メッセージの受信と返信
// ======================= //

// doPost(e)...GASがLINE Messaging APIからPOST送信を受信した時に自動的に処理を実行（イベントハンドラ）
// e はJSON文字列
// LINE Messaging APIからGASにはJSONでメッセージが送信されるため、GASで扱えるようにparseする
// ここの解説がわかりやすい↓
// https://www.yukibnb.com/entry/linemessagingapi_gas_overview
// https://www.yukibnb.com/entry/linemessagingapi_gas_detail
// https://yuilog.xyz/google_apps_script

function doPost(e) {
  if (typeof e === "undefined"){
    // 動作を終了　：テスト実行用。LINEでやりとりが始まらないとエラーになるため、返り値のないreturnを置く
    return;
  } else { 
    // ユーザーメッセージの取得
    var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
    
    if(userMessage.match(/^\もくもく/)) {
      // 「もくもく」から始まるメッセージの場合、この後の文字列を再代入
      userMessage = userMessage.substr(4);
      
      //// 応答用Tokenの取得 ////
      // 応答メッセージを送るには応答トークンが必要。応答できるイベントの発生時にWebhookを使って通知される
      // 応答トークンは1回のみ使用可。一定の期間が経過すると無効になる
      let reply_token= JSON.parse(e.postData.contents).events[0].replyToken;

      //// 応答メッセージを送る ////
      // HTTPリクエスト（LINE Messaging APIにアクセスするためのURL）
      const REPLY_URL = "https://api.line.me/v2/bot/message/reply";
        
      // ヘッダ情報の宣言
      // 外部のAPIにアクセスする際は、情報をヘッダ情報として送り、サーバーとやり取りをすることが必要
      // 必要な情報を連想配列としてまとめる
      // Content-Type...JSONを使うことを宣言し、文字化けしないようUTF-8に指定
      // Authorization...アクセストークンを認証
      // method...メソッドの種類を指定
      // payload...同時に送信する情報を指定。JSの値をJSONに変換する必要があるので、ここではJSON.stringifyを使う  
      const HEADERS = {
        "Content-Type": "application/json; charset=UTF-8","Authorization": "Bearer " + ACCESS_TOKEN
      };

      // GASでは外部のサイトにアクセスする処理として「UrlFetchApp」というオブジェクトが用意されている
      // 今回はfetchというメソッドを呼び出してLineMessagingAPIにアクセス
      // UrlFetchApp.fetch(URL, ここにオプション)　引数にアクセス先となるURLを指定するだけで
      // そこにアクセスしサーバーからデータを取り出すことができる
      // オプションの指定により、外部サイトにアクセスする際の動きをより細かく指定できる

      var postData = {
        "replyToken": replyToken,
        "messages": [{
        "type": "text",
        "text": "もくもくをきろく！"
        }]
      };
      var options = {
        "method": "POST",
        "headers": HEADERS,
        "payload": JSON.stringify(postData)
        };
     　return UrlFetchApp.fetch(REPLY_URL, options);
      
    } else {     
      var postData = {
        "replyToken": replyToken,
        "messages": [{
        "type": "sticker",
        "packageId": "789",
        "stickerId": "10855"
        }]
      };   
      var options = {
        "method": "POST",
        "headers": HEADERS,
        "payload": JSON.stringify(postData)
        };

      return UrlFetchApp.fetch(REPLY_URL, options);
    }
  }
  
  // スプレッドシートへ保存=======================================
  var response = e.postData.getDataAsString();
  var spreadsheetId = "";
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