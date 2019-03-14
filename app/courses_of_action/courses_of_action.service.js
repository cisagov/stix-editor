angular.module('app.courses_of_action')
.service('coas',['coa',function(coa){
	function coas (){
		var coas = {};
		coas.name = 'Course_Of_Action';
		coas.element = 'stix:Courses_Of_Action';
		coas.tooltip = 'Characterizes Courses of Action to be taken in regards to one of more cyber threats.';
		coas.arialabel = 'Courses of Action menu button: click to toggle course of action menu options: Characterizes Courses of Action to be taken in regards to one of more cyber threats.';
		coas.childType = function(){return coa.coa();};
		coas.children = [];
		coas.add = function(coa){this.children.push(coa);};
		coas.del = function(index){this.children.splice(index,1);};
		
		return coas;
	}
	
	return {coas:coas};
}]);