
// 定数の設定
const TOKEN = 'AAAA8nz9bCESM6Pc4Bmj2udIASMShZiIhs+0Ww+L6o/Kf5vo23waEwRcSheToDyuB2p+9B/VBILiM3HGlPogfanHZWZYOr9fyO5TQam4W7VijqyyWXBGelqPL98St10oCoueSPTcedKqpNJkFV4zd7nO9utY8tgo/vtIPboY3Z9SKjAXEVW2KHP2c3auJhSaOdAWzZAyUouiXMV543zL/0+qc4buVohJsCjBc82oRUAd03PMNeBsc5WO0q5sZkvukotxktpvO9waks3V3Y1I1TLndoVti8LoRrGZMwkrIxEWyORtTKSI88o3vJng87G7vH+OlD8hVi6hFKWMYydQ4PK4ZkI='; 


// -----------------------------------------------------------------------------
// モジュールのインポート
var express = require('express');
var bodyParser = require('body-parser'); 
var app = express();
var request = require('request');
var mysql = require('mysql');

// -----------------------------------------------------------------------------
// クラス定義
var SessionCtr = (function() {
    var SessionCtr = function() {
        this.hashMap = {};
    };
    var p = SessionCtr.prototype;
    p.get = function(accountId) {
        var session = this.hashMap[accountId]
        if( !session ){
            session = new Session(accountId);
            this.hashMap[accountId] = session;
        }
        return session;
    };
    return SessionCtr;
})();

var Session = (function() {
    var Session = function(accountId) {
        this.accountId = accountId;
        this.hashMap = {};
    };
    var p = Session.prototype;
    p.get = function(key) {
        return this.hashMap[key];
    };
    p.set = function(key,val) {
        this.hashMap[key]=val;
    };
    return Session;
})();



// -----------------------------------------------------------------------------
// ミドルウェア設定
// Webサーバー設定
var port = (process.env.PORT || 3000);
var server = app.listen(port, function() {
    console.log('Node is running on port ' + port);
});

app.use(bodyParser.json()); 

var sctr = new SessionCtr();


// -----------------------------------------------------------------------------
//  受付処理
// for callback acceptance
app.post('/webhook', function(req, res, next){
    var session = sctr.get(req.body.source.accountId);
    console.log(session);
    session.set('foo','foo-val');
    console.log(session); 
    
    res.status(200).end();
    //console.log(req.body)
    if (req.body.type == 'message'){
        sendMsgLineworks(3119, "6503355", req.body.content.text + " reply");
    }
});


// for zabbix msg  acceptance
app.post('/zabbix', function(req, res, next){
    res.status(200).end();
    //console.log(req.body);
    //console.log(req.body.title);
    //console.log(req.body.text);


    // parse msg
    var dict = Object.assign({}, parseMsg(req.body.text));
    //res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify(dict));
    //res.status(200).end();
    //console.log(dict);


    // store to db
    var connection = mysql.createConnection({
        host     : 'chatbot.cpau5kes0hmu.ap-northeast-1.rds.amazonaws.com',
        user     : 'admin',
        password : 'dir12345'
    });
    connection.connect();
    connection.query("insert into chatbot.errlog set ?", dict, function (error,results,fields){
        if(error) {
            console.log(error);
        } else {
            console.log(results);
        }            
    });
    connection.end();
    console.log('stored finished');


    // post msg to lineworks
    sendMsgLineworks(3119, "6503355", req.body.text);


    // msg anylize with log(db) and post to lineworks


    // msg anylize with jira and post to lineworks

});

 
/**
  * @description    parse message format to store db
  * @param          $bodyText: string
*/
function parseMsg(bodyText){
    var content = getStrCondition(bodyText, "*** Alert Message ***", "*** Additional Info ***", false, true);
    var dict = {};
    dict['system'] = "ZETTA";
    dict['node']= getStrCondition(content, "Hostname   :", "IPAddress   :");
    dict['description'] = getStrCondition(content, "Description:", "Status  :");
    dict['all'] = bodyText;
    dict['create_time'] = getStrCondition(content, "Date/Time:", "*** Additional Info ***");
    return dict;
}


/**
  * @description    get content between two condition strA, strB into string str
  * @param 
        $str: string
        $strA: string
        $strB: string
        $addFirst: boolean
        $addLast: boolean
    @return string if achieved condition else return null
*/
function getStrCondition(str, strA, strB, addFirst, addLast){
    var indexA = str.indexOf(strA);
    var indexB = str.indexOf(strB);
    if (indexA != -1 && indexB != -1){
        var start = indexA + strA.length;
        var end = indexB;
        if (addFirst == true) start = indexA;
        if (addLast == true) end += strB.length;
        var getStr = str.substring(start, end);
        return getStr.trim();
    }
    return null;
}


/**
  * @description    post msg text to lineworks
  * @param 
        $botNo: number
        $roomId: string
        $msg: string
*/
function sendMsgLineworks(botNo, roomId, msg){
    var post_msg = msg;
    var options = {
        uri: "https://apis.worksmobile.com/jp1UjLhmnmEbA/message/sendMessage/v2",
        headers: {
           "Content-type": "application/json",
           "consumerKey": 'OtzQvtXogFQD5e2NZKIO',
           "Authorization": 'Bearer ' + TOKEN
        },
        json: {
           "botNo": botNo,
           "roomId": roomId,
           "content": {
               "type": "text",
               "text": post_msg 
            }
        }
    };
    request.post(options, function (error, response, body) {
        // レスポンス結果
        // console.log(body);
    });
}