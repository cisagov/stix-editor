angular.module('app.home')
.controller('homeCtrl',['$scope','stix','utils','reference','filter','$http','$location','$anchorScroll','growl','$rootScope','$filter','$uibModal','observable', 'exportToXML', 'myTooltip', '$state', 'importServices',
                       function($scope,stix,utils,reference,filter,$http,$location,$anchorScroll,growl,$rootScope,$filter,$uibModal,observable,exportToXML,myTooltip,$state,importServices){
	$scope.editor_version ='';	$scope.stix_version = '1.1.1';
	$scope.stix = stix;
	
	$scope.prefix = {name:"Namespace Prefix",text:''};
	$scope.schema = {name:"Namespace Location",text:''};
	$http.get('settings.json').then(function(data) {		
		$scope.prefix.text = data.data.XML_Prefix;
		$scope.schema.text = data.data.XML_URI;
	});

	$scope.debug = false;
	$scope.settings = [
		$scope.prefix,
		$scope.schema
	];

	$scope.order = [
		stix.header,
		stix.coas,
		stix.ets,
		stix.ttps,
		stix.indicators
	];

	$scope.alerts = [];
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	$rootScope.$on('$viewContentLoading',function(event,viewConfig){
		$scope.loading = 'LOADING .....';
		$scope.busy = true;
	});
	$rootScope.$on('$viewContentLoaded',function(event,viewConfig){
		$scope.busy = false;
		$scope.loading = 'DONE .....';
	});

	$scope.addObject = function(object){
		if(typeof(object.id) === 'undefined'){
			return;
		}

		var xmlName2ObjectKeyDict = {
			observable:'observables',
			indicator: 'indicators',
			exploit_target: 'ets',
			ttp: 'ttps',
			course_of_action: 'coas'
		};

		if(typeof(xmlName2ObjectKeyDict[object.name.toLowerCase()]) === 'undefined') {
			alert('can not add UNKNOWN item');
		} else {
			stix[xmlName2ObjectKeyDict[object.name.toLowerCase()]].add(object);
			if(xmlName2ObjectKeyDict[object.name.toLowerCase()] == xmlName2ObjectKeyDict['indicator']) {
				stix['observables'].add(object.observable.object);
			}

			if(object.title.text != ''){
				message = object.title.text;
			} else {
				message = object.id.value;
			}
			$scope.scrollTo('top');
			growl.success("created " + message, {ttl:7000});
		}
	}

	$scope.scrollTo = function(location){
		if(typeof(location) === 'undefined'){
			location = 'top';
		}
		$location.hash(location);
		$anchorScroll();
	}
	
	$scope.tooltip = myTooltip;
	
	$scope.updateIndicator = function(passedIndicator){
		$scope.indicator = passedIndicator;
		$scope.observable = $scope.indicator.references['observable'].object;
		$scope.prevOBs = [];
	}

	$scope.openModal = function (argument) {
		function modalConfig (options) {
			var settings = {
				addFunc: undefined
			}

			if(options.hasOwnProperty('child')){
				$scope.value = options.child;
			}

			if(options.hasOwnProperty('addFuncName')){
				settings.addFunc = function() {
					options.self[options.addFuncName]($scope.value);
				};
			}

			if(options.hasOwnProperty('add') && typeof(options.add) !== undefined){
				$scope.modalParam = options.add;
				var temp = observable.observable();
				$scope.value = temp.object.properties;
				$scope.value.change(options.add);
				settings.addFunc = function() {
					stix.observables.add(temp);
					options.self.updateRef(temp);
				};
			} else if(options.hasOwnProperty('edit') && typeof(options.edit) !== undefined){
				$scope.modalParam = "EDIT";
				$scope.value = options.edit;
			} else if(options.hasOwnProperty('stix') && typeof(options.stix) !== undefined){
				settings.addFunc = function() {
					$scope.stix[options.stix].add(options.child);
					options.self.updateRef(options.child);
				};
			} else{
				settings.addFunc = 'UNKNOWN key';
				settings.addFunc = function() {
					options.self[options.addFuncName]($scope.value);
				};
			}
			return settings;
		}

		$scope.argument = argument;
		var modalSettings = modalConfig(argument);

		var ModalInstanceCtrl = function ($scope, $uibModalInstance, view) {
			$scope.view = view;
			$scope.ok = function () {
				$uibModalInstance.close(true);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		};

		var modalInstance = $uibModal.open({
				templateUrl: 'shared/modal-form.html',
				controller: ModalInstanceCtrl,
				resolve: {
					view: function () {
					return $scope;
					}
				}
		});

		modalInstance.result.then(function(passed){
			modalSettings.addFunc();
		});
	}

	$scope.delModal = function(objectType,childIndex,options){
		function modalConfig (options){
			var action = {
				deleteObject: undefined,
				cancelFunc: undefined,
				deleteFunc: undefined
			};

			if(options !== undefined){
				if(options.stix){
					action.deleteFunc= function() {
						options.parent[options.delFuncName](options.cancel.edit);
						$scope.stix[options.stix].del($scope.stix[options.stix].children.indexOf(options.cancel.edit));
					};
				} else if(options.hasOwnProperty('parent') && typeof(options.parent) !== undefined){
					if(options.hasOwnProperty('delFuncName') && options.delFuncName !== undefined){
						action.deleteFunc = function () {
							options.parent[options.delFuncName](options.cancel.index);
						};
					}
				}
				action.cancelFunc = function (){
					$scope.openModal(options.cancel);
				}
				action.deleteObject = options.cancel.edit;

				if (action.deleteFunc === undefined) {
					action.deleteFunc = function (){
						stix[objectType].del(childIndex);
					}
				}
			}
			return action;
		}

		var modalSettings = modalConfig(options);
		var ModalInstanceCtrl = function ($scope, $uibModalInstance, view, outerscope) {
			$scope.stix = view;
			$scope.ok = function () {
	  			$uibModalInstance.close(true);
	  			modalSettings.deleteFunc();
			};

			$scope.cancel = function () {
	  			$uibModalInstance.dismiss('cancel');
	  			modalSettings.cancelFunc();
			};
		};

		var modalInstance = $uibModal.open({
			templateUrl: 'shared/modal-delete.html',
			controller: ModalInstanceCtrl,
			resolve: {
				view: function () {
					return modalSettings.deleteObject;
				},
				outerscope: function () {
					return $scope;
				}
			}
		});

		modalInstance.result.then(function (deleteConfirmed) {
			$scope.confirmation = deleteConfirmed;
			message = modalSettings.deleteObject.name;
			if(modalSettings.deleteObject.hasOwnProperty('title') && modalSettings.deleteObject.title.text != ''){
				message = modalSettings.deleteObject.title.text;
			}
			else if(modalSettings.deleteObject.hasOwnProperty('id')){
				message = modalSettings.deleteObject.id.value;
			}
			growl.error( message, {title:'DELETED',ttl:5000});
		});
	}

	$scope.displayRef = function(input){ return $filter('titleOrIdShortener')(input,25);} //reference.display;
	$scope.displayFilter = reference.displayFilter;
	$scope.filter = filter;

	$scope.print = function(stix){
		if(typeof(stix) === 'undefined'){
			var stix = $scope.stix.package;
		}
		$scope.stix.removeOrphans({orphan:'observables',from:'indicators',where:'observable'});
		$scope.stix.convertDelimited();
		$scope.stix.removeSTIXSection('observables');
		var namespace = $scope.stix.ns;
		var tempNS = {};

		return exportToXML.createXML(stix,$scope.exportOptions,$scope.stix.ns,$scope.prefix.text,$scope.schema.text);
	}

	$scope.exportOptions = {
		validation:{ required:true },
		referenceNumber: '',
		filename: $scope.stix.header.title.text
	};

	
	$scope.export = function() {
		try {
			$scope.exportOptions.referenceNumber = $scope.stix.package.attributes[0].value;
			if($scope.stix.package.children[0].title.text){
				$scope.exportOptions.filename = $scope.stix.package.children[0].title.text + '.xml';
			}
		} catch (e) {
			console.log(e.name + ": " + e.message);
		}

		var ModalInstanceCtrl = function ($scope, $uibModalInstance, exportOptions) {
			$scope.exportOptions = exportOptions;
			$scope.ok = function () {
				$uibModalInstance.close($scope.exportOptions);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		};

		var modalInstance = $uibModal.open({
				templateUrl: 'export/modal-export.html',
				controller: ModalInstanceCtrl,
				resolve: {
					exportOptions: function () {
						return $scope.exportOptions;
					}
				}
		});

		modalInstance.result.then(function () {
			if ($scope.exportOptions.filename == '') {
				$scope.exportOptions.filename = "stix.xml";
			} else if ($scope.exportOptions.filename.indexOf(
					'.xml', $scope.exportOptions.filename.length - 4) < 0) {
				$scope.exportOptions.filename += '.xml';
			}

			if ($scope.exportOptions.referenceNumber) {
				//$scope.stix.package.id = $scope.exportOptions.referenceNumber;
				$scope.stix.package.attributes[0].value = $scope.exportOptions.referenceNumber;
			}

			var xml = $scope.print();
			var xmlBlob = new Blob([xml], {type: "text/xml;charset=utf-8"});

			saveAs(xmlBlob, $scope.exportOptions.filename);
		});
	}

	$scope.import = function (file) {
		var reader = new FileReader();
		reader.readAsText(file.file);
		reader.onload = function(e) {
			var text = reader.result;
			xmlObj = $(text);
			xmlObj = xmlObj[xmlObj.length-1];
			if(xmlObj.attributes){
				attr = xmlObj.attributes[0];
				xmlAttrs = utils.xmlAttributesToDict('nodeName',xmlObj.attributes)
				if(xmlAttrs.hasOwnProperty('version') && xmlAttrs.version.nodeValue == $scope.stix_version){
					console.log('matches expected version: ' + xmlAttrs.version.nodeValue);
					stixApiParse(text);
				} else {
					console.log('Is not "' + $scope.stix_version +'"');
					if (xmlAttrs.hasOwnProperty('version')) {
						version = xmlAttrs.version.nodeValue;
					} else {
						version = 'UNKNOWN';
					}
					$scope.open = function(){
						var ModalInstanceCtrl = function ($scope, $uibModalInstance, view) {
							$scope.modalData = view;
							$scope.ok = function (uploadedFileAsString) {
								$uibModalInstance.close(uploadedFileAsString);
							};

							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						};

						var modalInstance = $uibModal.open({
							templateUrl: 'shared/modal-version.html',
							controller: ModalInstanceCtrl,
							resolve: {
								view: function () {
									return {
									expectedVersion:$scope.stix_version,
									uploadedVersion:version,
									file:text};
								}
							}
						});

						modalInstance.result.then(function (uploadedFileAsString) {
							console.log('uploadedFileAsString',uploadedFileAsString);
							stixApiParse(uploadedFileAsString);
						});
					};
					$scope.open();
				}
				$state.reload();
			}
		}

		function stixApiParse(fileAsString) {
			$scope.loading = 'Loading started.';
			$scope.busy = true;
			var x2js = new X2JS();
			var stixAsString = x2js.xml_str2json(fileAsString); 
			console.log(stixAsString);
			$scope.alerts = [];
			$scope.alerts = importServices.importXML(stixAsString, stix);
			if($scope.alerts.length == 0){
				$scope.alerts.push({type: 'success',msg:'STIX Uploaded successfully.'});
			} else {
				if ($scope.alerts[0].msg == "TypeError: Cannot read property 'STIX_Package' of null") {
					$scope.alerts[0].msg = "This is an invalid document.";
				}
			}
			$scope.busy = false;
			$scope.loading = 'Loading completed.';
		}
	}

}]);