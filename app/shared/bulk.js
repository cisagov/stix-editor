angular.module('app.home')
.controller('bulkCtrl', ['$scope','$uibModal', 'myTooltip', function($scope,$uibModal,myTooltip){
	
	$scope.tooltip = myTooltip;
	$scope.uniqueEntries = function (entries) {
		var uniqueEntries = [];
		for (index = 0; index < entries.length; index++) {
			var entry = entries[index].trim();
			if (uniqueEntries.indexOf(entry) < 0 && entry.trim() != ""){
				uniqueEntries.push(entry);
			}
		}
		return uniqueEntries;
	}

	$scope.bulkEntry = function(){
		var modalInstance = $uibModal.open({
			templateUrl: 'shared/modal-bulk.html',
			controller: ModalInstanceCtrl,
			resolve: {
				view: function () {
					return $scope;
				}
			}
		});
		
		modalInstance.result.then(function (deleteConfirmed) {
			$scope.confirmation = deleteConfirmed;
			console.log('modalInstance.result.then',deleteConfirmed);
		});
	};
	var ModalInstanceCtrl = function ($scope, $uibModalInstance, view) {
		$scope.view = view;
		
		$scope.ok = function (entries) {
			console.log('process',entries);
			for (enrtyIndex = 0; enrtyIndex < entries.length; enrtyIndex++){
				entry = entries[enrtyIndex];
				$scope.view.value.placeholder = entry;
				$scope.view.value.add();
			}
			console.log('$scope.view',$scope.view);
		$uibModalInstance.close(true);
		};

		$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
		};
	};
}])