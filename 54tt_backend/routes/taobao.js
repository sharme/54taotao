var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var requestIp = require('request-ip');
TopClient = require('./lib/api/topClient').TopClient;
var client = new TopClient({
    'appkey': '25074824',
    'appsecret': '8a044030b89d2c68ff7df3347a679d70',

    // 'REST_URL': 'http://gw.api.taobao.com/router/rest'
    // 'REST_URL': 'http://gw.api.tbsandbox.com/router/rest'
    'REST_URL': 'https://eco.taobao.com/router/rest'
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
        // client.execute('taobao.tbk.item.get', {
        //     'fields': 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick',
        //     'q': req.param('q'),
        //     // 'cat':'16,18',
        //     // 'itemloc': '上海',
        //     'sort': 'tk_total_sales',
        //     'is_tmall': 'false',
        //     'is_overseas': 'false',
        //     // 'start_price':'10',
        //     // 'end_price':'20',
        //     'start_tk_rate': '200',
        //     'end_tk_rate': '1200',
        //     'platform': '1',
        //     'page_no': req.param('page_no') === '-1' ? Math.random() * 100 >>> 0: req.param('page_no'),
        //     'page_size': '6'
        // }, function (error, response) {
        //     if (!error) res.send(response);
        //     else res.send(error);
        // })
        client.execute('taobao.tbk.shop.get', {
            'fields':'user_id,shop_title,shop_type,seller_nick,pict_url,shop_url',
            'q': req.param('q'),
            'sort':'commission_rate_des',
            'is_tmall':'false',
            'start_credit':'1',
            'end_credit':'20',
            'start_commission_rate':'2000',
            'end_commission_rate':'123',
            'start_total_action':'1',
            'end_total_action':'100',
            'start_auction_count':'1',
            'end_auction_count':'20000',
            'platform':'1',
            'page_no':req.param('page_no') === '-1' ? Math.random() * 100 >>> 0: req.param('page_no'),
            'page_size':'6'
        }, function(error, response) {
            if (!error) console.log(response);
            else console.log(error);
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
    console.log('Visitor IP: getCouponProducts ' + ipAddress);
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
        // client.execute('taobao.tbk.dg.item.coupon.get', {
        //     'adzone_id':'1292558215',
        //     'platform':'1',
        //     'page_size':req.param('page_size'),
        //     'q':req.param('q'),
        //     'page_no':req.param('page_no')<0?Math.random() * 100 >>> 0:req.param('page_no')
        //     // 'page_no':req.param('page_no')
        // }, function(error, response) {
        //     if (!error) res.send(response);
        //     else res.send(error);
        // })
        console.log("Q: " + req.param('q'));

        client.execute('taobao.tbk.shop.get', {
            'fields':'user_id,shop_title,shop_type,seller_nick,pict_url,shop_url',
            'q': req.param('q'),
            'page_no':req.param('page_no') === '-1' ? Math.param() * 100 >>> 0: req.param('page_no'),
            'page_size':'6'
        }, function(error, response) {
            if (!error) res.send(response);
            else console.log(error);
        })
    } else {
        res.send({
            "code": "-1",
            "error": "非法请求, 请再次尝试."
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
            "code": "-1",
            "error": "非法请求, 请再次尝试."
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
    
    if(req.param('url') && req.param('logo') && send) {

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

router.get('/getShareProducts', function (req, res, next) {

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
        if(!req.param('q'))
        {
            client.execute('taobao.tbk.dg.optimus.material', {
                'page_size': req.param('page_size'),
                'adzone_id': '1292558215',
                'page_no': req.param('page_no'),
                'material_id': '4071'
            }, function (error, response) {
                if (!error) res.send(response);
                else res.send(error);
            })
        } else
        {
            client.execute('taobao.tbk.dg.material.optional', {
                'start_dsr': '100',
                'page_size': '6',
                'page_no': req.param('page_no'),
                'platform': '1',
                'end_tk_rate': '1534',
                'start_tk_rate': '334',
                'end_price': '200',
                'start_price': '10',
                'is_overseas': 'false',
                'sort': 'tk_rate_sales',
                'q': req.param('q'),
                'material_id': '4071',
                'has_coupon': 'false',
                'adzone_id': '1292558215',
                'need_free_shipment': 'true',
                'need_prepay': 'true',
                'include_pay_rate_30': 'true',
                'include_good_rate': 'true',
                'include_rfd_rate': 'true',
                'npx_level': '2'
            }, function (error, response) {
                if (!error) res.send(response);
                else res.send(error);
            })
        }
    } else {
        res.send({
            "code": "-1",
            "error": "非法请求, 请再次尝试."
        });
    }

});

router.get('/getPromotion', function (req, res, next) {

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
    
    if(req.param('start_time') && req.param('start_time') && send) {
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


router.get('/getEvents', function (req, res, next) {

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

    if(true && send) {
        client.execute('taobao.tbk.uatm.event.get', {
            'page_no':'1',
            'page_size':'20',
            'fields':'event_id,event_title,start_time,end_time'
        }, function(error, response) {
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

router.get('/getDailyShopping', function (req, res, next) {

    if(true) {
        client.execute('taobao.tbk.ju.tqg.get', {
            'adzone_id':'1292558215',
            'fields':'click_url,pic_url,reserve_price,zk_final_price,total_amount,sold_num,title,category_name,start_time,end_time',
            'start_time':'2018-09-18 00:00:00',
            'end_time': '2018-09-18 23:59:59',
            'page_no':'1',
            'page_size':'40'
        }, function(error, response) {
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

router.get('/getFavorites', function (req, res, next) {

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

        client.execute('taobao.tbk.uatm.favorites.item.get', {
            'platform': '1',
            'page_size': req.param('page_size'),
            'adzone_id': '1292558215',
            // 'unid':'3456',
            'favorites_id': req.param('group_id'),
            'page_no': req.param('page_no'),
            'fields': 'provcity,coupon_click_url,coupon_end_time,coupon_info,coupon_remain_count,num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick,shop_title,zk_final_price_wap,event_start_time,event_end_time,tk_rate,status,type'
        }, function (error, response) {
            if (!error) res.send(response);
            else res.send(error);
        })
    } else {
        res.send({
            "code": "-1",
            "error": "非法请求"
        });
    }

});










module.exports = router;