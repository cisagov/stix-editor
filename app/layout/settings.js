(function() {
	'use strict';

	angular.module('app.home')
	.controller('SettingsCtrl', ['$scope', '$http', function($scope, $http) {

		$http.get('settings.json').then(function(data) {
			$scope.data = data.data;
			$scope.data.XML_Namespace = "xmlns:" + $scope.data.XML_Prefix + "=\"" + $scope.data.XML_Schemalocation + "\"";
		});
		
	}]);

})();