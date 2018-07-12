var mysql = require('mysql');
var pool =  mysql.createPool({
    host : 'chatbot.cpau5kes0hmu.ap-northeast-1.rds.amazonaws.com',
    user : 'admin',
    password: 'dir12345',
    database: 'chatbot'
});
 
pool.getConnection(function(err, connection){    
    //run the query
    connection.query({sql: 'select * from errlog', timeout: 3000}, function(err, rows){
        if(err) throw err;
        else {
            console.log(rows);
        }
    });

    connection.release();//release the connection
});
