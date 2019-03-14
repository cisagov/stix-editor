angular.module('app.courses_of_action')
.controller('coaCtrl',['$scope','coa',function($scope,coa){
	$scope.coa = coa.coa();
	$scope.newCOA = function(){$scope.coa = coa.coa();};
	$scope.delCOA = function(){delete $scope.coa; $scope.newCOA();};
}]);