angular.module('app.home')
.controller('toolCtrl',['$scope','tool',function($scope,tool){
	$scope.tool = tool.tool();
	$scope.newTool = function(){$scope.tool = tool.tool();}
}]);