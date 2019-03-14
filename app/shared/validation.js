angular.module('app.home')
.controller('validationCtrl', ['$scope', 'myTooltip', function($scope, myTooltip){
	
	$scope.tooltip = myTooltip;
	
	$scope.updateStatus = function(page,form){
		console.log('field valid',form);
		// complete.state = complete.state && form;
		console.log("Page complete",page);
	}

	$scope.addField = function (page,form) {
		page.fields.push(form);
	}
	
	$scope.look = function (argument) {
		console.log("argument",argument);
		console.log("Page complete",$scope.$parent.complete);
		console.log("Field",value.name);
		console.log("Form status",genForm.valid);
	}
}]);