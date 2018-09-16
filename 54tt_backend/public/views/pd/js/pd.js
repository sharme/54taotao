'use strict';

var product = angular.module('buybsControllers');

product.controller('ProductDetailCtrl', ['$scope', '$routeParams', '$http', '$cookies', '$window','$css','$sce', function ($scope, $routeParams, $http, $cookies, $window,$css,$sce) {
    if($(window).width() < mobileSize - 100) {
        $scope.zoom = false;
    } else {
        $scope.zoom = true;
    }
    $scope.windowSize = $(window).width();
    $scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
    };
    $scope.renderHtml = function(value) {
        return $sce.trustAsHtml(value);
    };

    $http({method: 'GET', url: ipAddress + '/taobao/getProductDetail', params:{num_iids:$routeParams.footId}})
        .success(function(data){
            $scope.foot = data.results.n_tbk_item['0'];
            $scope.checkUser = $scope.foot.u_id == $cookies.get('u_id')?true:false;

            $http({method: 'GET', url: ipAddress + '/taobao/getSeller', params:{seller_name:$scope.foot.nick}})
                .success(function(data){
                    $scope.seller = data.results.n_tbk_shop['0'];
                }, function(error){
                    $scope.error = error;
                });

            $http({method: 'GET', url: ipAddress + '/taobao/getProductRecommend', params:{q:$scope.foot.cat_name, page_size: 6}})
                .success(function(data){
                    $scope.recomms = data;

                }, function(error){
                    $scope.error = error;
                });
            

        }, function(error){
            $scope.error = error;
        });


    $http({method: 'GET', url: ipAddress + '/comments/getCommentsByFSID', params:{fs_id:$routeParams.footId}})
        .success(function(data){
            $scope.comments = data;
        }, function(error){
            $scope.error = error;
        });

    $scope.goTo = function(num_iid){
        $window.location.href = "#/foot/" + num_iid;
    };
    $scope.addComment = {
        cm_content: '',
        fs_id: '',
        u_id: $cookies.get('u_id')
    };
    $scope.submit = function(){
        if($cookies.get('u_id') == undefined){
            $window.location.href = '#/login';
            return;
        }
        $scope.addComment.fs_id = $scope.foot.fs_id;
        $scope.addComment.cm_content = CKEDITOR.instances.editor1.getData();
        var req = {
            method: 'POST',
            url: ipAddress + '/comments/add',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify($scope.addComment)
        };
        $http(req).success(function(result){
            console.log($scope.foot.u_id + " ; " + $scope.foot.fs_id);
            addEvent($http, $window, $cookies.get('u_id'),eComment,$scope.foot.u_id,eFootstep,$scope.foot.fs_id, true);
        }, function(error){
            console.log(error);
        });
    };
    $scope.index_number = 1;
    $scope.switchPic = function(pic, index_number) {
            var maxIndex = false;
            if (pic.small_images.string['1']) maxIndex = 2;
            if (pic.small_images.string['2']) maxIndex = 3;
            if (pic.small_images.string['3']) maxIndex = 4;

            if(index_number == 0 && pic.pict_url){
                index_number ++;
                $('.picture-present').attr('src',pic.pict_url);
            } else if(index_number == 1 && pic.small_images.string['1']){
                index_number ++;
                $('.picture-present').attr('src',pic.small_images.string['1']);
            } else if(index_number == 2 && pic.small_images.string['2']) {
                index_number ++;
                $('.picture-present').attr('src',pic.small_images.string['2']);
            } else if(index_number == 3 && pic.small_images.string['3']) {
                index_number ++;
                $('.picture-present').attr('src',pic.small_images.string['3']);
            }
            if (index_number == maxIndex) index_number = 0;

            $scope.index_number = index_number;
        }
}]);





