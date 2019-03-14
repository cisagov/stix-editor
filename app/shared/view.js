angular.module('app.home')
.controller('viewCtrl',['$scope','$stateParams','$state','stix','utils','$uibModal','growl','myTooltip',function($scope, $stateParams, $state, stix, utils, $uibModal, growl, myTooltip){
	$scope.scrollTo();
	$scope.tooltip = myTooltip;
	try {
		$scope.childIndex = Number($stateParams.childIndex);
		$scope.objectType = $stateParams.objectType;
		$scope.pageUrl = $stateParams.objectType;
		$scope.del = function(index){
			$scope.open(index);
		}
		$scope.open = function(index){
			$scope.stix = stix[$scope.objectType].children[$scope.childIndex];
			var modalInstance = $uibModal.open({
				templateUrl: 'shared/modal.html',
				controller: ModalInstanceCtrl,
				resolve: {
					view: function () {
						return $scope;
					}
				}
			});
			
			modalInstance.result.then(function (deleteConfirmed) {
				$scope.confirmation = deleteConfirmed;
				if(deleteConfirmed){
					stix[$scope.objectType].del(index);
					if($scope.stix.title.text != ''){
						message = $scope.stix.title.text;
					} else {
						message = $scope.stix.id.value;
					}
					growl.error( message, {title:'DELETED',ttl:5000});
					$state.go($scope.pageUrl);
				}
			});
		};
		var ModalInstanceCtrl = function ($scope, $uibModalInstance, view) {
			$scope.view = view;
			$scope.ok = function () {
				$uibModalInstance.close(true);
			};
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		};
		var prefixMapping = {exploit_targets:"ets",	indicator:"Indicators", TTPs:"ttps", course_of_action:"coas"};
		if(prefixMapping[$stateParams.objectType]){
			$scope.objectType = prefixMapping[$stateParams.objectType];
		}
		$scope.object = stix[$scope.objectType.toLowerCase()].children[$stateParams.childIndex];
		$scope.idIndex = utils.find('id',$scope.object.attributes);
		switch($scope.objectType){
			case 'observables':
				$scope.observable = $scope.object;
				break;
			case 'indicators':
				$scope.indicator = $scope.object;
				$scope.$watch('indicator.kill_chain_phases.children[0].extBase.value', function (newValue, oldValue) {
					if(newValue !== oldValue){
						$scope.indicator.kill_chain_phases.children[0].sync();
					}
				})
				break;
			case 'coas':
				$scope.coa = $scope.object;
				break;
			case 'ttps':
				$scope.ttp = $scope.object;
				break;
			case 'ets':
				$scope.et = $scope.object;
				break;
		}
	} 
	catch(e) {
		$state.go('/');
	}
}]);