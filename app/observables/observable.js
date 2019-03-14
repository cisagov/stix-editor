angular.module('app.observables')
.controller('observableCtrl',['$scope','observable',function($scope,observable){
	$scope.observable = observable.observable();
	$scope.setObject = function(obj){
		$scope.objectProperty = obj;
	};
	$scope.newObservable = function(){$scope.observable = observable.observable(); delete $scope.objectProperty;};
	$scope.delObservable = function(){delete $scope.observable; $scope.newObservable();};
	$scope['new'] = 'true';
	$scope.data = {
		observableOptions: [
			{value: 'IP', name:'AddressObject'},
			{value: 'Domain', name:'DomainNameObject'},
			{value: 'Email', name:'EmailMessageObject'},
			{value: 'File', name:'FileObject'},
			{value: 'User_Agent', name:'HTTPSessionObject'},
			{value: 'Link', name:'LinkObject'},
			{value: 'Mutex', name:'MutexObject'},
			{value: 'NetworkConnection', name:'NetworkConnectionObject'},
			{value: 'Port', name:'PortObject'},
			{value: 'SocketAddress', name:'SocketAddressObject'},
			{value: 'URI', name:'URIObject'},
			{value: 'WindowsRegistryKey', name:'WindowsRegistryKeyObject'}
		],
		selectedObservable: null
	};
}]);