angular.module('app.observables')
.service('object',['properties','guid','utils','reference',function(properties,guid,utils,reference){
	function object(){
		object = {};
		object.name = 'Object';
		object.element = 'cybox:Object';
		object.parent = 'Indicator';
		object.tooltip = 'The Object construct identifies and specificies the characteristics of a specific cyber-relevant object (e.g. a file, a registry key or a process).';
		object.id ={name:'id',value:guid.guid(object.name)} 
		object.attributes = [
			object.id
		];
		object.properties = properties.properties();
		object.related_objects = {name:'Related_Objects',element:'cybox:Related_Objects',tooltip:'The Related_Objects construct is optional and enables the identification and/or specification of Objects with relevant relationships with this Object.',
			list:[],
			children:[],
			updateRef:function(child){
				// remove child if it is in log
				var id = utils.getObj('name','id',child.attributes);
				var refType = reference.object(this.element.split(":")[0],child,{element:this.element.substr(0,this.element.length-1),attrType:'idref'});
				refType.update(child);
				if(this.list.indexOf(child) >= 0){
					var index = this.list.indexOf(child);
					this.list.splice(index,1);
					this.children.splice(index,1);
				} // otherwise add child if not in list
				else {
					this.list.push(child);
					this.children.push(refType);
				}
			},
			cleanRef:function(stixObjectArray){
				toDelete = [];
				for(var index = 0; index < this.children.length; index++){
					var ref = this.children[index];
					if(stixObjectArray.indexOf(ref.object) < 0){
						this.updateRef(ref.object);
					}
				}
			}
		};
		object.children = [
			object.properties,	
		];

		return object;
	}
	
	return {object:object};
}]);