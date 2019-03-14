angular.module('app.header')
.service('references',[function(){
	function references(type){
		references = {};
		references.name = "References";
		references.element = type+"Common:References";
		references.tooltip = "This field contains references to instances or additional information for this tool.";
		references.children = [{name:"Reference", element: type+"Common:Reference", placeholder:"", tooltip:"Contains one reference to information or instances of a given tool.",
							items:[], 
							add:function(){this.items.push({name:this.placeholder});this.placeholder='';},
							del:function(index){this.items.splice(index,1);}
						}];
		return references;
	}
	return {references:references};
}]);