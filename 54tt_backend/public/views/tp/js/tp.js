'use strict';

var community = angular.module('buybsControllers');
community.controller('TripCtrl', ['$scope', '$cookies', '$window', '$http', '$css', '$sce', function($scope, $cookies, $window, $http, $css, $sce){
    $scope.checkMobile = function () {
        if($(window).width() < mobileSize - 100)
            return true;
    };
    $scope.page_no = 1;
    var init = false;
    $scope.txtValue = '女装';
    $http({method: 'GET', url: ipAddress + '/taobao/getProducts', params:{q: $scope.txtValue, page_no: $scope.page_no}})
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
                url: ipAddress + '/taobao/getProducts',
                params: {q: $scope.txtValue == ''?'女装': $scope.txtValue, page_no: $scope.page_no + 1}
            }).success(function (data) {
                if (data.results.n_tbk_item.length > 0) {
                    for (var i = 0; i < data.results.n_tbk_item.length; i++) {
                        $scope.tripList.results.n_tbk_item.push(data.results.n_tbk_item[i]);
                    }
                    $scope.page_no = $scope.page_no + 1;
                    $scope.loadNext = true;

                }
            }, function (error) {
                $scope.error = error;
            });
            heightDiv = heightDiv + 500;
            $(".trip_list").css("height", heightDiv + "px");
        }
    };

    $scope.loginCheck = function(fs_id) {
        $window.location.href = "#/foot/" + fs_id;
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
        $scope.txtValue = $('.search_bar').val();
        $scope.page_no = 1;
        $http({method: 'GET', url: ipAddress + '/taobao/getProducts',
            params:{q: $scope.txtValue == ''?'女装': $scope.txtValue, page_no: $scope.page_no}
        }).success(function(data){
            if(!data.results)
                $scope.couponMsg = true;
            $scope.tripList = data;
        }, function(error){
            $scope.error = error;
        });
        heightDiv = 500;
        $(".trip_list").css("height", heightDiv + "px");
    };

    
}]);





