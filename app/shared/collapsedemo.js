angular.module('app.home')
.controller('CollapseDemoCtrl',['$scope','$element','myTooltip',function($scope,$element,myTooltip){
	$scope.isCollapsed = false;
	$scope.toggle = function(){
		$element.next().toggleClass('collapse');
	}
	$scope.tooltip = myTooltip;
}]);