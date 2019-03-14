angular.module('app.ttps')
.controller('ttpCtrl',['$scope','ttp',function($scope,ttp){
	$scope.ttp = ttp.ttp();
	$scope.newTTP = function(){$scope.ttp = ttp.ttp();};
	$scope.delTTP = function(){delete $scope.ttp; $scope.newTTP();};
}]);