angular.module('app.home')
.controller('hashCtrl',['$scope','cyboxCommon',function($scope,cyboxCommon){
	$scope.hash = cyboxCommon.hash();
	$scope.newHash = function(){$scope.hash = cyboxCommon.hash();}
}]);