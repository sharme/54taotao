var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodeParser = bodyParser.urlencoded( { extended: false });

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'fm@youtumi',
    database: '54taotao'
});

connection.connect();

var date = new Date();

router.post('/add', function(req, res, next) {
    console.log(req.body.u_id + " ; " + req.param('u_id'));
    var nf_status = 0;
    if(req.body.tp_id == 3){
        nf_status = 2;
    }
    var addSQL = mysql.format("insert into jk_notifications(u_id,at_id,nf_to,tp_id,c_id,nf_status,nf_create_time) values (?,?,?,?,?,?,?)",[ req.body.u_id, req.body.at_id, req.body.nf_to, req.body.tp_id, req.body.c_id, nf_status, date]);

    connection.query(addSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.post('/consume', function(req, res, next) {
    var addSQL = mysql.format("update jk_notifications set nf_status=1 where nf_id=?",[ req.param('nf_id')]);

    connection.query(addSQL, function (err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

// 小白u_id 喜欢at_id 足迹tp_id
// [小白] [喜欢] 了你的 [足迹]    [时间]
router.get('/getNotifications', function(req, res, next) {
    var sql = "select nf_id, (select u_name from jk_users as jku where jku.u_id=jkn.u_id) as u_name, (select at_val from jk_actions as jka where jka.at_id=jkn.at_id ) as action, (select tp_val from jk_types as jkt where jkt.tp_id=jkn.tp_id) as type, c_id, nf_status, jkn.nf_create_time from jk_notifications as jkn where jkn.nf_to=?";
    var searchSQL = mysql.format(sql, [req.param('u_id')]);

    searchSQL += " order by nf_create_time desc";
    connection.query(searchSQL, function (err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })

});




module.exports = router;
