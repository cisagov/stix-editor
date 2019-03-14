var gui = angular.module('app',[
	'ngAnimate', 
	'ngSanitize',
	'ui.bootstrap',
	'ui.router',
	'flow',
	'checklist-model',
	'stixServices',
	'cyboxServices',
	'app.home',
	'guiServices',
	'angular-growl',
	'app.exports',
	'app.package',
	'app.header',
	'app.indicators',
	'app.observables',
	'app.ttps',
	'app.exploit_targets',
	'app.courses_of_action',
	'ngAria'
]);

gui.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('settings', {
			url: '/settings',
			views:{
				'main':{templateUrl: 'layout/settings.html'}
			}
		})
		.state('stix_header', {
			url: '/stix_header',
			views:{
				'main':{templateUrl: 'stix_header/stix_header.html'}
			}
		})
		.state('observables', {
			url: '/observables',
			views:{
				'main':{templateUrl: 'observables/observables.html'}
			}
		})
		.state('view', {
			url: '/{objectType:[A-z]+}/{childIndex:[0-9]+}',
			views:{
				'main':{templateUrl: 'shared/view.html',
					controller: 'viewCtrl'
				}
			}
		})
		.state('indicators', {
			url: '/indicators',
			views:{
				'main':{templateUrl: 'indicators/indicators.html'}
			}
		})
		.state('ttps', {
			url: '/ttps',
			views:{
				'main':{templateUrl: 'ttps/ttps.html'}
			}
		})
		.state('course_of_action', {
			url: '/course_of_action',
			views:{
				'main':{templateUrl: 'courses_of_action/coas.html'}
			}
		})
		.state('exploit_targets', {
			url: '/exploit_targets',
			views:{
				'main':{templateUrl: 'exploit_targets/ets.html'}
			}
		})
		.state('releases', {
			url: '/releases',
			views:{
				'main':{templateUrl: 'layout/releases.html'}
			}
		})
		.state('/',{
			url:'/',
			views:{
				'main':{templateUrl:'layout/landing.html'}
			}
		});
}]);

gui.directive('dateTime', [function(){
	return{
		restrict:'E',
		templateUrl:'shared/datetime.html'

	}
 }]);
gui.directive('titleDir', [function(){
	return{
		restrict:'E',
		scope:{
			text: '@'
		},
		templateUrl:'shared/title.html'
	}
}]);

gui.directive('dynamicTemplate', [function(){
	return {
		scope: {
			template: '=',
			value: '='
		},
		controller: function($scope, $element, $attrs, $transclude) {
			console.log('dynamicTemplate $scope',$scope);

			$scope.dynamicTemplate = function() {
				return 'shared/' + $scope.template + '.html';
			};
		},
		restrict: 'E',
		template: '<div ng-include="dynamicTemplate()"></div>',
	};
}]);
gui.directive('accordionRelated', [function(){
	return {
		scope:{
			value: '=',
			totalArray: '=',
			totalArrayFilter: '=',
			addModal: '&',
			editModal: '&',
			delModal: '&',
			templateModal: '@',
			self: '=',
			update: '=',
			delFuncName: '@',
			stix: '@',
			cybox: '@',
			viewType: '@',
			display: '&'
		},
		controller: function($scope, $element, $attrs, $transclude) {},
		restrict: 'E',
		templateUrl: function(elem,attr){
			if(attr.template === undefined){
				return 'shared/accordion.html';
			} else {
				return 'shared/accordion-' + attr.template +'.html';
			}
		}
	};
}]);
gui.directive('drawThis',[function(){
	return{
		restrict:'E',
		scope:{
			value: '='
		},
		templateUrl:'stix_header/draw-this.html'
	}
}]);
gui.directive('recursiveFill', [function () {
		return {
			restrict: 'E',
			templateUrl:'shared/recursive-fill.html'
		}
}]);
gui.directive('recursiveObservable', [function () {
	return {
		restrict: 'E',
		templateUrl:'observables/recursive-observable.html'
	}
}]);
gui.directive('stixPane', [function () {
		return {
			restrict: 'E',
			templateUrl:'layout/stix-pane.html'
		}
}]);
gui.directive('handling',[function(){
	return{
		restrict:'E',
		templateUrl:'stix_header/handling.html'
	}
}]);
gui.directive('generalForm',[function(){
	return{
		restrict:'E',
		templateUrl:'shared/general-form.html'
	}
}]);
gui.directive('informationSource',[function(){
	return{
		restrict:'E',
		templateUrl:'stix_header/information-source.html'
	}
}]);
gui.directive('observables',[function(){
	return{
		restrict:'E',
		templateUrl:'observables/observables.html'
	}
}]);
gui.directive('observable',[function(){
	return{
		restrict:'E',
		templateUrl:'observables/observable.html'
	}
}]);
gui.directive('ets',[function(){
	return{
		restrict:'E',
		templateUrl:'exploit_targets/ets.html'
	}
}]);
gui.directive('et',[function(){
	return{
		restrict:'E',
		templateUrl:'exploit_targets/et.html'
	}
}]);
gui.directive('coas',[function(){
	return{
		restrict:'E',
		templateUrl:'courses_of_action/coas.html'
	}
}]);
gui.directive('coa',[function(){
	return{
		restrict:'E',
		templateUrl:'courses_of_action/coa.html'
	}
}]);
gui.directive('indicators',[function(){
	return{
		restrict:'E',
		templateUrl:'indicators/indicators.html'
	}
}]);
gui.directive('indicator',[function(){
	return{
		restrict:'E',
		templateUrl:'indicators/indicator.html'
	}
}]);
gui.directive('hash',[function(){
	return{
		restrict:'E',
		templateUrl:'observables/hash.html'
	}
}]);
 gui.directive('value',[function(){
	return{
		restrict:'E',
		templateUrl:'observables/value.html'
	}
}]);
gui.directive('sighting',[function(){
	return{
		restrict:'E',
		templateUrl:'indicators/sighting.html'
	}
}]);
gui.directive('ttps',[function(){
	return{
		restrict:'E',
		templateUrl:'ttps/ttps.html'
	}
}]);
gui.directive('ttp',[function(){
	return{
		restrict:'E',
		templateUrl:'ttps/ttp.html'
	}
}]);
gui.directive('tooltipLabel',[function(){
	return{
		restrict:'E',
		templateUrl:'shared/tooltip-label.html'
	}
}]);

gui.config(['growlProvider', function (growlProvider) {
  growlProvider.onlyUniqueMessages(false);
  growlProvider.globalReversedOrder(true);
}]);

gui.config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
        target: '/',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4
    };
}]);

gui.filter('titleOrIdShortener',[function(){
	return function(passedObject,lengthLimit){
		if(typeof(passedObject) !== 'undefined'){
			if(typeof(passedObject.title) !== 'undefined' && passedObject.title.text !== ''){
				passedString = passedObject.title.text;
			}
			else if(typeof(passedObject.id) !== 'undefined'){
				passedString = passedObject.id.value;
			}
			else {
				return;
			}
		}
		else {
			return;
		}

		if(typeof(lengthLimit) === 'undefined' || typeof(lengthLimit) !== 'number'){
			lengthLimit = 15;
		}

		if(passedString.length <= lengthLimit){
			return passedString;
		}
		else{
			return passedString.substring(0,lengthLimit) + '...';
		}
	}
}]);
gui.filter('observableObject',['utils', function(utils){
	return function (obChildren,objectTypes){
		var allTypes = false;
		if(typeof(objectTypes) === 'undefined'){
			objectTypes = [''];
			allTypes = true;
		}

		if(typeof(obChildren) === 'undefined'){
			return
		}

		var objectArray = [];
		for(var obIndex = 0; obIndex < obChildren.length; obIndex++){
			var ob = obChildren[obIndex];
			if(ob.object.properties._properties && ob.object.properties._properties['xsi:type'] && ob.object.properties._properties['xsi:type'].value){
				if(allTypes){
					objectArray.push(ob);
				} else if(objectTypes.indexOf(ob.object.properties._properties['xsi:type'].value) >= 0){
					objectArray.push(ob);
				}
			}
		}
		return objectArray;
	}
}]);