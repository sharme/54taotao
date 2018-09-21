'use strict';

var highQualityProduct = angular.module('buybsControllers');
highQualityProduct.controller('HighQualityProductCtrl', ['$scope', '$cookies', '$window', '$http', '$css', '$sce', function($scope, $cookies, $window, $http, $css, $sce){


    ScrollImgLeft();

    $scope.checkMobile = function () {
        if($(window).width() < mobileSize - 100) {
            return true;
        } else {
            return false;
        }
    };
    $scope.page_no = 1;
    $scope.group_id = '18595332';
    var init = false;
    $http({method: 'GET', url: ipAddress + '/taobao/getFavorites', params:{page_no: '1', page_size: $scope.checkMobile()?'4':'8', group_id: $scope.group_id}})
        .success(function(data){
            $scope.tripList = data;
            init = true;
        },function(error){
            $scope.error = error;
    });

    var heightDiv = 0;
    $scope.loadNext = true;
    $scope.loadMore = function() {
        if($scope.loadNext && init) {
            $scope.loadNext = false;
            $http({
                method: 'GET',
                url: ipAddress + '/taobao/getFavorites',
                params: {page_no: $scope.page_no + 1, page_size: $scope.checkMobile()?'4':'8', group_id: $scope.group_id}
            }).success(function (data) {
                if(!data.results)
                    $scope.couponMsg = true;
                else {
                    if (data.results.uatm_tbk_item.length > 0) {
                        for (var i = 0; i < data.results.uatm_tbk_item.length; i++) {
                            $scope.tripList.results.uatm_tbk_item.push(data.results.uatm_tbk_item[i]);
                        }
                        $scope.page_no = $scope.page_no + 1;
                        $scope.loadNext = true;
                        if($scope.checkMobile())
                            $(".trip_list").css("height", $scope.tripList.results.uatm_tbk_item.length/2 * 426 + "px");
                        else
                            $(".trip_list").css("height", $scope.tripList.results.uatm_tbk_item.length/8 * 426 + "px");
                    }
                }
            }, function (error) {
                $scope.error = error;
            });
        }
    };

    $scope.bgColorChange = function (divkey) {
        $(".bgColorChange"+divkey).css("background-color",'rgba(239,239,239,0.96)');
    };
    $scope.bgColorRemove = function (divkey) {
        $(".bgColorChange" + divkey).css("background-color",'white');
    };

    $scope.couponMsg = false;
    $scope.getCode = function (coupon_click_url, zk_final_price, coupon_info, title, logo, index) {
            $http({
                method: 'GET', url: ipAddress + '/taobao/getCode',
                params: {url: coupon_click_url, logo: logo}
            }).success(function (data) {
                if (!data.data) {
                    $scope.coupon = data;
                } else {
                    $scope.coupon = {
                        model: data.data.model,
                        title: title,
                        info: coupon_info,
                        zk_final_price: zk_final_price,
                        click_url: coupon_click_url
                    }
                }
                $('.couponCode').css('margin-top', (index * 410)/2 + 80 + "px");
                $('.couponCode').css('display', 'block');
            }, function (error) {
                $scope.error = error;
            });
    };
    $scope.close = function (val, title, price, oeprice) {
        if(val) {
            var input = document.createElement("input");
            input.value =  title + "【淘宝在售价】" + price + "         " + "           【54淘淘优惠券】" + oeprice + "          ----------------" + "复制这条信息, " + val + " ,打开【手机淘宝】开始抢购";
            document.getElementById('couponCode').appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
            document.getElementById('couponCode').removeChild(input);

            $('.couponCode').css('display', "none");
        } else {
            $('.couponCode').css('display', "none");
        }
    }
    
    
    $scope.groupFilter = function (g_id) {

        $http({method: 'GET', url: ipAddress + '/taobao/getFavorites', params:{page_no: '1', page_size: $scope.checkMobile()?'4':'8', group_id: g_id}})
            .success(function(data){
                $scope.tripList = data;
                init = true;
                $scope.group_id = g_id;
                $scope.page_no = 1;
                $(".trip_list").css("height", $scope.tripList.results.uatm_tbk_item.length/8 * 426 + "px");
            },function(error){
                $scope.error = error;
        });
        
    }
    
}]);


function ScrollImgLeft(){
    var speed=10;
    var scroll_begin = document.getElementById("scroll_begin");
    var scroll_end = document.getElementById("scroll_end");
    var scroll_div = document.getElementById("scroll_div");
    scroll_end.innerHTML= scroll_begin.innerHTML;
    function Marquee(){
        if(scroll_end.offsetWidth-scroll_div.scrollLeft<=0)
        {
            scroll_div.scrollLeft-=scroll_begin.offsetWidth;
        }
        else
        {
            scroll_div.scrollLeft++;
        }
    }
    var MyMar=setInterval(Marquee,speed);

    // scroll_div.onmouseover = function()
    // {
    //     clearInterval(MyMar);
    // }
    // scroll_div.onmouseout=function()
    // {
    //     MyMar=setInterval(Marquee,speed);
    // }
}


