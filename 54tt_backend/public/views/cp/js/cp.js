'use strict';

var couponProduct = angular.module('buybsControllers');
couponProduct.controller('CouponProductCtrl', ['$scope', '$cookies', '$window', '$http', '$css', '$sce', function($scope, $cookies, $window, $http, $css, $sce){

    $scope.checkMobile = function () {
        if($(window).width() < mobileSize - 100) {
            return true;
        } else {
            return false;
        }
    };
    $scope.page_no = 1;
    var init = false;
    $scope.txtValue = '女装';
    $http({method: 'GET', url: ipAddress + '/taobao/getCouponProducts', params:{ q: $scope.txtValue, page_no: '1', page_size: $scope.checkMobile()?'4':'6'}})
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
                url: ipAddress + '/taobao/getCouponProducts',
                params: {q: $scope.txtValue == ''?'女装': $scope.txtValue, page_no: $scope.page_no + 1, page_size: $scope.checkMobile()?'4':'6'}
            }).success(function (data) {
                if(!data.results)
                    $scope.couponMsg = true;
                else {
                    if (data.results.tbk_coupon.length > 0) {
                        for (var i = 0; i < data.results.tbk_coupon.length; i++) {
                            $scope.tripList.results.tbk_coupon.push(data.results.tbk_coupon[i]);
                        }
                        $scope.page_no = $scope.page_no + 1;
                        $scope.loadNext = true;
                        if($scope.checkMobile())
                            $(".trip_list").css("height", $scope.tripList.results.tbk_coupon.length * 426 + "px");
                        else
                            $(".trip_list").css("height", $scope.tripList.results.tbk_coupon.length/4 * 426 + "px");
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
    $scope.search = function(){
        $scope.couponMsg = false;
        $scope.loadNext = true;
        $scope.txtValue = $('.search_bar').val();
        $scope.page_no = 1;
        $http({method: 'GET', url: ipAddress + '/taobao/getCouponProducts',
            params:{q: $scope.txtValue == ''?'女装': $scope.txtValue, page_no: $scope.page_no, page_size: $scope.checkMobile()?'4':'6'}
        }).success(function(data){
                    if(!data.results)
                        $scope.couponMsg = true;
                    $scope.tripList = data;
                    init = true;
            }, function(error){
                $scope.error = error;
            });
        if($scope.checkMobile())
            heightDiv = 500;
        else
            heightDiv = 500;
        $(".trip_list").css("height", heightDiv + "px");
    };

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
                $('.couponCode').css('margin-top', index * 426 + 300 + "px");
                $('.couponCode').css('display', 'block');
            }, function (error) {
                $scope.error = error;
            });
    };
    $scope.close = function () {
       $('.couponCode').css('display', "none");
    }


}]);





