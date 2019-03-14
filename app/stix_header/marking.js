angular.module('app.header')
.controller('markingCtrl',['$scope','marking',function($scope,marking){
	$scope.types = marking;
	$scope.type = 'TLP';
	$scope.tlperror = false;
	$scope.change = function(type, value){
		$scope.tlperror = false;
		if(marking.hasOwnProperty(type)){
			$scope.marking = marking[type]();
			if (value.children.length > 0) {
				var tlpExists = false;
				for (i = 0; i < value.children.length; i++) {
					if (((value.children[i].marking_structure["xsi:type"].value == "tlpMarking:TLPMarkingStructureType") ||
						(value.children[i].marking_structure["xsi:type"].value == "AIS:AISMarkingStructure")) &&
						(($scope.marking.marking_structure["xsi:type"].value == "tlpMarking:TLPMarkingStructureType") ||
						($scope.marking.marking_structure["xsi:type"].value == "AIS:AISMarkingStructure"))) {
						tlpExists = true;
						break;
					}
				}
				if (!tlpExists) {
					$scope.type = type;
					delete $scope.error;
					value.addmarking($scope.marking);
				} else {
					$scope.tlperror = true;
				}
			} else {
				$scope.type = type;
				delete $scope.error;
				value.addmarking($scope.marking);
			}
		} else {
			$scope.error = "marking:MarkingType '" + type + "' has not been implemented";
		}
	};
	$scope.reseTLPError = function(){
		$scope.tlperror = false;
	};

}]);