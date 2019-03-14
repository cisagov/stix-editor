angular.module('app.observables')
.service('observables',['observable',function(observable){
	function observables() {
		var observables = {};
		observables.childType = function(){return observable.observable();};
		observables.name = 'Observables';
		observables.element = 'stix:Observables';
		observables.tooltip = 'Characterizes one or more cyber observables.';
		// new structure due to MITRE API usage
		observables.major_version = {name:'cybox_major_version',value:'2'};
		observables.minor_version = {name:'cybox_minor_version',value:'1'};
		observables.attributes = [observables.major_version, observables.minor_version,{name:'cybox_update_version',value:'0'}];
		observables.children = [];
		observables.add = function(observable){this.children.push(observable);};
		observables.del = function(index){this.children.splice(index,1);};
		
		return observables;
	}
	
	return {observables:observables}
}]);
