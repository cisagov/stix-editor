angular.module('app.indicators')
.controller('indicatorCtrl',['$scope','indicator','utils',function($scope,indicator,utils){
	$scope.indicator = indicator.indicator();
	$scope.coa = $scope.indicator.references['coa'].object;
	
	$scope.notClicked = true;
	$scope.click = function(){$scope.notClicked = false;}
	$scope.newIndicator = function(){
		$scope.indicator = indicator.indicator();
		$scope.coa = $scope.indicator.references['coa'].object;
	}
	$scope.delIndicator = function(){delete $scope.indicator; $scope.newIndicator();}
	$scope.newSighting = function(){
		var temp = indicator.indicator();
	}
		
	$scope.displayObservable = function(observable){
		var id = utils.find('id',observable.attributes);
		var title = utils.find('Title',observable.children);
		$scope.prevOBs.push(observable);
		if($scope.prevOBs.indexOf($scope.observable) >=0){$scope.select = 'true';}
		return observable.children[title].text +' - - - ' + observable.attributes[id].value;
	}
	
	$scope.changeObservable = function(arg){
		$scope.indicator.references['observable'].update(arg);
		$scope.observable = arg;
		console.log('changeObservable');console.log(arg);
	}
	
	$scope.changeCOA = function(arg){
		$scope.indicator.references['coa'].update(arg);
		$scope.observable = arg;
		console.log('changeCOA');console.log(arg);
	}
	$scope.clearOB = function(){$scope.observable = 'just a string';}
	$scope.clearCOA = function(){$scope.coa = 'just a string';}
	
	$scope['new'] = 'true';
	$scope.obSelect = 'true';
	$scope.existingCOA = 'true';
	
	$scope.clearOB();
	$scope.clearCOA();

	$scope.$watch('indicator.kill_chain_phases.children[0].extBase.value',function(newValue,oldValue){
		if (newValue !== oldValue){
			$scope.indicator.kill_chain_phases.children[0].sync();
		}
	});
}]);