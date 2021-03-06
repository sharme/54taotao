var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var auth = require('./auth.js');
var bodyParser = require('body-parser');
var requestIp = require('request-ip');
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

router.get('/getFootsteps', function(req, res, next) {

    var u_id = req.param('u_id');
    
    var criteriaSQL = "";
    if(u_id) {
         criteriaSQL = mysql.format("select fs_id, u_id, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_des, fs_from," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
             "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," + 
            "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
            "(select u_name from jk_users as jku where jku.u_id=jkf.u_id) as u_tag_name," +
            "(select count(*) from jk_followers as jkfo where jkfo.u_id = jkf.u_id and jkfo.fl_fl_id = ?) as follow," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id and jks.u_id=?) as stick_status," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id and jkl.u_id=?) as like_status," +
            "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
            "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
            "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
            "fs_create_time " +
            " from jk_footsteps as jkf where jkf.fs_status=1",[req.param('u_id'),req.param('u_id'),req.param('u_id')]);
    } else {
        criteriaSQL = "select fs_id, u_id, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_des, fs_from," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
            "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
            "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
            "(select u_name from jk_users as jku where jku.u_id=jkf.u_id) as u_tag_name," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
            "(select count(*) from jk_followers as jkfo where jkfo.u_id = jkf.u_id and jkfo.fl_fl_id = 0) as follow," +
            "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
            "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
            "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
            "fs_create_time " +
            " from jk_footsteps as jkf where jkf.fs_status=1 ";
    }
    
    console.log(req.param('fs_from'));

    if(req.param('fs_from')){
        criteriaSQL += " and jkf.fs_from='" + req.param('fs_from') + "'";
    }
    
    if(req.param('fs_platform')) {
        criteriaSQL += " and jkf.fs_platform='" + req.param('fs_platform') + "'";
    }
    
    criteriaSQL += " order by fs_create_time desc";
    
    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }
    console.log(criteriaSQL);
    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFootstepsByTag', function(req, res, next) {

    var u_id = req.param('u_id');
    var criteriaSQL = "";
    if(req.param('tag')) {
        if(req.param('filter')) {
            criteriaSQL = "select fs_id, u_id, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_des,fs_from," +
                "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
                "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
                "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
                "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
                "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
                "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
                "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
                "fs_create_time " +
                " from jk_footsteps as jkf where jkf.fs_status=1 and jkf.fs_des like '%" + req.param('tag') + "%' or jkf.fs_from like '%" + req.param('tag') + "%' and fs_from like '%" + req.param('filter') +"%'";


        } else  {
            criteriaSQL = "select fs_id, u_id, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_des,fs_from," +
                "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
                "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
                "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
                "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
                "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
                "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
                "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
                "fs_create_time " +
                " from jk_footsteps as jkf where jkf.fs_status=1 and jkf.fs_des like '%" + req.param('tag') + "%' or jkf.fs_from like '%" + req.param('tag') + "%'";
            
        }

    } else {
        
        if(req.param('filter')) {

            criteriaSQL = "select fs_id, u_id, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_des, fs_from," +
                "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
                "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
                "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
                "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
                "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
                "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
                "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
                "fs_create_time " +
                " from jk_footsteps as jkf where jkf.fs_status=1 and fs_from like '%" + req.param('filter') + "%'";
            
        } else {

            criteriaSQL = "select fs_id, u_id, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_des, fs_from," +
                "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
                "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
                "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
                "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
                "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
                "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
                "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
                "fs_create_time " +
                " from jk_footsteps as jkf where jkf.fs_status=1 ";
        }
    }

    if(req.param('fs_from')){
        criteriaSQL += " and jkf.fs_from='" + req.param('fs_from') + "'";
    }
    if(req.param('fs_platform')){
        criteriaSQL += " and jkf.fs_platform='" + req.param('fs_platform') + "'";
    }
    criteriaSQL += " order by fs_create_time desc";

    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }

    console.log(criteriaSQL);

    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFootstepsByUID', function(req, res, next) {
    
    var criteriaSQL = mysql.format("select fs_id, u_id, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_des, fs_from," +
        "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
        "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
        "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
        "(select u_name from jk_users as jku where jku.u_id=jkf.u_id) as u_tag_name," +
        "(select count(*) from jk_followers as jkfo where jkfo.u_id = jkf.u_id and jkfo.fl_fl_id = ?) as follow," +
        "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id and jks.u_id=?) as stick_status," +
        "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
        "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id and jkl.u_id=?) as like_status," +
        "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
        "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
        "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
        "fs_create_time " +
        " from jk_footsteps as jkf where jkf.fs_status=1 and jkf.u_id =? ",[req.param('u_id'),req.param('u_id'),req.param('u_id'),req.param('u_id')]);

    criteriaSQL += " order by fs_create_time desc";
    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }
    
    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFootstepsNumber', function(req, res, next) {
    var criteriaSQL = "select count(*) as number from jk_footsteps as jkf where jkf.fs_status = 1";
    
    if(req.param('fs_platform')) {
        criteriaSQL += " and jkf.fs_platform='" + req.param('fs_platform') + "'";
    }
    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

//select count(*) as number from jk_footsteps as jkf where jkf.fs_status = 1 and jkf.fs_des like '%%' or jkf.fs_from like '%%' and jkf.fs_from like '%小背心/小吊带d jkf.fs_platform = '淘宝'
//Tag_SQL_READ: select count(*) as number from jk_footsteps as jkf where jkf.fs_status = 1 and jkf.fs_des like '%%' or jkf.fs_from like '%%' and jkf.fs_from like '%女装尖货%' anf.fs_platform = '淘宝'

router.get('/getFootstepsTagNumber', function(req, res, next) {
    var criteriaSQL = "select count(*) as number from jk_footsteps as jkf where jkf.fs_status = 1 and ";

    if(req.param('fs_platform')) {
        criteriaSQL += "jkf.fs_platform = ?";
    }
    
    if(req.param('tag')) {
        criteriaSQL += " and jkf.fs_des like'%" + req.param('tag') + "%'";
    }

    if(req.param('filter')) {
        criteriaSQL += " and jkf.fs_from like'%" + req.param('filter') + "%'";
    }
    
    criteriaSQL = mysql.format(criteriaSQL, [req.param("fs_platform")]);
    
    console.log("Tag_SQL_READ: " + criteriaSQL);
    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getStickFootstepsByUID', function(req, res, next) {
    var criteriaSQL = mysql.format("select fs_id,u_id,fs_pic,fs_des, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4," +
        "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
        "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
        "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
        "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
        "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc limit 1) as u_avatar," +
        "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc limit 1) as u_name," +
        "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content, fs_smallImg, fs_bigImg, fs_create_time" +
        " from jk_footsteps as jkf where jkf.fs_id IN (select fs_id from jk_sticks as jks where jks.u_id = ?)",[req.param('u_id')]);

    if(req.param('fs_from')){
        criteriaSQL += " and jkf.fs_from='" + req.param('fs_from') + "'";
    }
    criteriaSQL += " order by fs_create_time desc";

    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }
    
    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

router.post('/create', function(req, res, next) {

    
    if(req.body.secret == auth.encrypt(req.body.u_id)) {

        var createSQL = mysql.format("insert into jk_footsteps(fs_pic,fs_des,fs_from,u_id,fs_bigImg," +
            "fs_smallImg,fs_create_time,fs_update_time, fs_status, fs_pic2, fs_pic3, fs_pic4, fs_pic5," +
            " fs_pic6, fs_pic7, fs_pic8, fs_disPic, fs_disPic2, fs_disPic3, fs_disPic4, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform) values(?,?,?,?,?,?,NOW(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.fs_pic,
            req.body.fs_desc, req.body.fs_from, req.body.u_id, req.body.fs_bigImg, req.body.fs_smallImg, date, 0, req.body.fs_pic2, 
            req.body.fs_pic3, req.body.fs_pic4, req.body.fs_pic5, req.body.fs_pic6, req.body.fs_pic7, req.body.fs_pic8, req.body.fs_disPic,
        req.body.fs_disPic2, req.body.fs_disPic3, req.body.fs_disPic4, req.body.fs_price, req.body.fs_sales, req.body.fs_commission, req.body.fs_promo, req.body.fs_discount, req.body.fs_platform]);

        console.log(createSQL);
        
        connection.query(createSQL, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {

                var addEvent = mysql.format("insert into jk_events(u_id,et_type,et_create_time) values (?,?,?)",[req.body.u_id, 'publish',date]);
                connection.query(addEvent);


                connection.query('select jkf.fl_fl_id, (select fs_id from jk_footsteps as jkft where jkft.u_id=jkf.u_id order by fs_create_time desc limit 0,1) as fs_id from jk_followers as jkf where jkf.u_id = ' + req.body.u_id, function (err, result) {

                    console.log(result);

                    result.forEach(function(item, index){
                        var fl_fl_id;
                        var fs_id;
                        for (key in item){
                            console.log(key + " ; " + item[key]);

                            if (key == 'fl_fl_id') {
                                fl_fl_id = item[key];
                            }
                            if (key == 'fs_id') {
                                fs_id = item[key];
                            }
                        }
                        var sendNotification = mysql.format("insert into jk_notifications(u_id,at_id,nf_to,tp_id,c_id,nf_status,nf_create_time) values (?,?,?,?,?,?,?)",[ req.body.u_id, 5, fl_fl_id, 1, fs_id, 0, date]);
                        connection.query(sendNotification);

                    });


                });


                res.send(result);
            }
        })
    } else {
        res.send({errno: 1001, code: 'access denied'});
    }
});

router.post('/delete', function(req, res, next) {
    var createSQL = mysql.format("delete from jk_footsteps where fs_id=?", [req.body.fs_id]);

    connection.query(createSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFootstepsDetail', function (req, res, next) {
   var criteriaSQL = mysql.format("select fs_id,u_id,fs_des,fs_pic," +
       "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
       "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
       "(select count(*) from jk_followers as jkfs where jkfs.u_id = jkf.u_id and jkfs.fl_fl_id = ?) as follow," +
       "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
       "(select u_name from jk_users as jku where jku.u_id = jkf.u_id) as u_name," +
           "(select u_avatar from jk_users as jku where jku.u_id = jkf.u_id) as u_avatar," +
       "(select u_slogan from jk_users as jku where jku.u_id = jkf.u_id) as u_slogan, fs_smallImg, fs_bigImg, fs_pic2, fs_pic3, fs_pic4, fs_pic5, fs_pic6, fs_pic7, fs_pic8, fs_price, fs_sales, fs_commission, fs_promo, fs_discount, fs_platform from jk_footsteps as jkf where jkf.fs_id = ?", [req.param('u_id'), req.param('fs_id')]);

    connection.query(criteriaSQL, function (err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })


});

router.get('/getNext', function (req, res, next) {
    var criteriaSQL = "select fs_id from jk_footsteps as jkf where jkf.fs_status = 1 order by fs_create_time desc ";

    connection.query(criteriaSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            console.log(JSON.stringify(result));
            for(var index = 0; index < result.length; index ++ ){

                console.log("result= " + result[index].fs_id + " == " + req.param('fs_id'));
                if(result[index].fs_id == req.param('fs_id')) {
                    
                    if(index+1 < result.length) {
                        return res.send(result[index+1]);
                    } else {
                        return res.send({errno: 1005, code: "no next picture can be found."});
                    }        
                }
            }
            res.send({errno: 1005, code: "no next picture can be found."});
        }
    })
});

router.get('/getPrev', function (req, res, next) {
    var criteriaSQL = "select fs_id from jk_footsteps as jkf where jkf.fs_status = 1 order by fs_create_time desc";

    connection.query(criteriaSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            console.log(JSON.stringify(result));
            for(var index = 0; index < result.length; index ++ ){

                console.log("result= " + result[index].fs_id + " == " + req.param('fs_id'));
                if(result[index].fs_id == req.param('fs_id')) {

                    if(index-1 >= 0) {
                        return res.send(result[index-1]);
                    } else {
                        return res.send({errno: 1005, code: "no next picture can be found."});
                    }
                }
            }
            res.send({errno: 1005, code: "no next picture can be found."});
        }
    })
});

router.get('/getFootstepsByNewest', function (req, res, next) {

});




module.exports = router;
