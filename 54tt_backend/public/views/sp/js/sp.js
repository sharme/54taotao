'use strict';

var couponProduct = angular.module('buybsControllers');
couponProduct.controller('ShareProductCtrl', ['$scope', '$cookies', '$window', '$http', '$css', '$sce', function($scope, $cookies, $window, $http, $css, $sce){

    $scope.checkMobile = function () {
        if($(window).width() < mobileSize - 100) {
            return true;
        } else {
            return false;
        }
    };
    $scope.page_no = 1;
    var init = false;
    $http({method: 'GET', url: ipAddress + '/taobao/getShareProducts', params:{page_no: '1', page_size: $scope.checkMobile()?'4':'8'}})
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
                url: ipAddress + '/taobao/getShareProducts',
                params: {page_no: $scope.page_no + 1, page_size: $scope.checkMobile()?'4':'8'}
            }).success(function (data) {
                if(!data.result_list)
                    $scope.couponMsg = true;
                else {
                    if (data.result_list.map_data.length > 0) {
                        for (var i = 0; i < data.result_list.map_data.length; i++) {
                            $scope.tripList.result_list.map_data.push(data.result_list.map_data[i]);
                        }
                        $scope.page_no = $scope.page_no + 1;
                        $scope.loadNext = true;
                        if($scope.checkMobile())
                            $(".trip_list").css("height", $scope.tripList.result_list.map_data.length/2 * 426 + "px");
                        else
                            $(".trip_list").css("height", $scope.tripList.result_list.map_data.length/4 * 426 + "px");
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
                params: {url: "https:" + coupon_click_url, logo: logo}
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
            input.value =  title + "【淘宝在售价】" + price + "         " + "            【拼团价】" + oeprice + "          ----------------" + "复制这条信息, " + val + " ,打开【手机淘宝】开始拼团";
            document.getElementById('couponCode').appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
            document.getElementById('couponCode').removeChild(input);

            $('.couponCode').css('display', "none");
        } else {
            $('.couponCode').css('display', "none");
        }
    }
    
}]);





