angular.module('app.observables')
.service('observable',['object','guid',function(object,guid){
	function observable() {
		observable = {}
		observable.name	= 'Observable';
		observable.element = 'cybox:Observable';
		observable.tooltip = 'The Observable construct represents a description of a single cyber observable.';
		observable.id = {name:'id',value:guid.guid(observable.name)};
		observable.attributes = [observable.id];
		
		observable.title = {name:'Title',element:'cybox:Title',text:'',tooltip:'The Title field provides a mechanism to specify a short title or description for this Observable.'}
		observable.description = {name:'Description',element:'cybox:Description',text:'',tooltip:'The Description field provides a mechanism to specify a structured text description of this Observable.'};
		observable.object = object.object();
		observable.children = [
			observable.object
		];
		
		return observable;
	}
	
	return {observable:observable};
}]);