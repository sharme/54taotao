var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var requestIp = require('request-ip');
TopClient = require('./lib/api/topClient').TopClient;
var client = new TopClient({
    'appkey': '25074824',
    'appsecret': '8a044030b89d2c68ff7df3347a679d70',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
    // 'REST_URL': 'http://gw.api.tbsandbox.com/router/rest'
});

var date = new Date();

var ips = [];

var clearIpsList = setInterval(function(){
    ips = [];
},1000*60*30);

var clearBlackList = setInterval(function(){
    blacklist = [];
},1000*60*60*24);

var blacklist = [];


router.get('/getProducts', function (req, res, next) {

    var ipAddress = req.connection.remoteAddress;
    if(req.header['x-forwarded-for']){
        ipAddress = req.header['x-forwarded-for'];
        console.log("x-forward-for ip: " + ipAddress)
    }
    var send = true;
    console.log('Visitor IP: ' + ipAddress);
    ips.push({ip: ipAddress});

    var checkCount = 0;
    ips.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                checkCount++;
            }
        }
    });

    blacklist.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                send = false;
            }
        }
    });

    if(checkCount > 500) {
        blacklist.push({ip: ipAddress});
    }
    

    if(req.param('q') && req.param('page_no') && send) {
        client.execute('taobao.tbk.item.get', {
            'fields': 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick',
            'q': req.param('q'),
            // 'cat':'16,18',
            // 'itemloc': '上海',
            'sort': 'tk_total_sales',
            'is_tmall': 'false',
            'is_overseas': 'false',
            // 'start_price':'10',
            // 'end_price':'20',
            'start_tk_rate': '200',
            'end_tk_rate': '1200',
            'platform': '1',
            'page_no': req.param('page_no') === '-1' ? Math.random() * 100 >>> 0: req.param('page_no'),
            'page_size': '6'
        }, function (error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else {
        res.send({
            "code": "-1",
            "error": "非法请求, 请再次尝试."
        });
    }
    
});


router.get('/getCouponProducts', function (req, res, next) {


    var ipAddress = req.connection.remoteAddress;
    if(req.header['x-forwarded-for']){
        ipAddress = req.header['x-forwarded-for'];
        console.log("x-forward-for ip: " + ipAddress)
    }
    var send = true;
    console.log('Visitor IP: ' + ipAddress);
    ips.push({ip: ipAddress});

    var checkCount = 0;
    ips.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                checkCount++;
            }
        }
    });

    blacklist.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                send = false;
            }
        }
    });

    if(checkCount > 500) {
        blacklist.push({ip: ipAddress});
    }

    if(req.param('q') && send && req.param('page_no') && req.param('page_size')) {
        client.execute('taobao.tbk.dg.item.coupon.get', {
            'adzone_id':'1292558215',
            'platform':'1',
            'page_size':req.param('page_size'),
            'q':req.param('q'),
            'page_no':req.param('page_no')<0?Math.random() * 100 >>> 0:req.param('page_no')
            // 'page_no':req.param('page_no')
        }, function(error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else {
        res.send({
            "total_results": 100,
            "request_id": "hexkj4qh3dc8"
        });
    }

});


router.get('/getProductDetail', function (req, res, next) {

    var ipAddress = req.connection.remoteAddress;
    if(req.header['x-forwarded-for']){
        ipAddress = req.header['x-forwarded-for'];
        console.log("x-forward-for ip: " + ipAddress)
    }
    var send = true;
    console.log('Visitor IP: ' + ipAddress);
    ips.push({ip: ipAddress});

    var checkCount = 0;
    ips.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                checkCount++;
            }
        }
    });

    blacklist.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                send = false;
            }
        }
    });

    if(checkCount > 500) {
        blacklist.push({ip: ipAddress});
    }
    
    if(send) {

        var ipAddress = requestIp.getClientIp(req);

        client.execute('taobao.tbk.item.info.get', {
            'num_iids': req.param('num_iids'),
            'platform': '1',
            'ip': ipAddress
        }, function (error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else {
        res.send({
            "total_results": 100,
            "request_id": "hexkj4qh3dc8"
        });
    }

});


router.get('/getSeller', function (req, res, next) {

    var ipAddress = req.connection.remoteAddress;
    if(req.header['x-forwarded-for']){
        ipAddress = req.header['x-forwarded-for'];
        console.log("x-forward-for ip: " + ipAddress)
    }
    var send = true;
    console.log('Visitor IP: ' + ipAddress);
    ips.push({ip: ipAddress});

    var checkCount = 0;
    ips.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                checkCount++;
            }
        }
    });

    blacklist.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                send = false;
            }
        }
    });

    if(checkCount > 500) {
        blacklist.push({ip: ipAddress});
    }
    
    
    if(req.param('seller_name') && send) {

        client.execute('taobao.tbk.shop.get', {
            'fields':'user_id,shop_title,shop_type,seller_nick,pict_url,shop_url',
            'q': req.param('seller_name'),
            'platform':'1',
            'page_no':'1',
            'page_size':'1'
        }, function(error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
        
    } else {
        res.send({
            "code": "-1",
            "error": "非法请求, 请再次尝试."
        });
    }

});


router.get('/getProductRecommend', function (req, res, next) {

    var ipAddress = req.connection.remoteAddress;
    if(req.header['x-forwarded-for']){
        ipAddress = req.header['x-forwarded-for'];
        console.log("x-forward-for ip: " + ipAddress)
    }
    var send = true;
    console.log('Visitor IP: ' + ipAddress);
    ips.push({ip: ipAddress});

    var checkCount = 0;
    ips.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                checkCount++;
            }
        }
    });

    blacklist.forEach(function(item, index){
        for (key in item){
            if(key === 'ip' && item[key] === ipAddress){
                send = false;
            }
        }
    });

    if(checkCount > 500) {
        blacklist.push({ip: ipAddress});
    }
    
    if(req.param('q') && send) {

        client.execute('taobao.tbk.item.get', {
            'fields': 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick',
            'q': req.param('q'),
            'sort': 'tk_rate_des',
            'platform': '1',
            'page_no': Math.random() * 100 >>> 0,
            'page_size': '6'
        }, function (error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else  {
        res.send({
            "code": "-1",
            "error": "非法请求, 请再次尝试."
        });
    }

});


router.get('/getCode', function (req, res, next) {

    if(req.param('url') && req.param('logo')) {

        client.execute('taobao.tbk.tpwd.create', {
            // 'user_id':'123',
            'text':'先 领券 再购物, 54淘淘为你省钱. 点击【打开】领取优惠券',
            'url':req.param('url'),
            'logo':req.param('logo'),
            'ext': '{}'
        }, function (error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else  {
        res.send({
            "code": "-1",
            "error": "非法请求"
        });
    }


});

router.get('/getCoupon', function (req, res, next) {

    if(req.param('item_id')) {
        client.execute('taobao.tbk.coupon.get', {
            'item_id': req.param('item_id'),
            'activity_id': '15618150'
        }, function (error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else {
        res.send({
            "code": "-1",
            "error": "非法请求, 请再次尝试."
        });
    }

});

router.get('/getPromotion', function (req, res, next) {

    if(req.param('start_time') && req.param('start_time')) {
        client.execute('taobao.tbk.ju.tqg.get', {
            'adzone_id': '1292558215',
            'fields': 'click_url,pic_url,reserve_price,zk_final_price,total_amount,sold_num,title,category_name,start_time,end_time',
            'start_time': req.param('start_time'),
            'end_time': req.param('end_time'),
            'page_no': '1',
            'page_size': '40'
        }, function (error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else  {
        res.send({
            "code": "-1",
            "error": "非法请求"
        });
    }

});






module.exports = router;