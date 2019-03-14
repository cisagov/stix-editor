angular.module('app.home')
.service('reference',['utils',function(utils){
	function reference(prefix,refObject,options){
		var reference = {};
		reference.prefix = prefix;
		reference.object = refObject;
		reference.ref = '';
		reference.update = function(passedRefObject,options){
			reference.object = passedRefObject;
			if(typeof(options) !== 'undefined' && options.parent){
				reference.ref = {};
				reference.ref.element = options.parent[0];
				reference.ref.children = [];
				
				var currParent = reference.ref.children;
				for(var index = 1; index < options.parent.length; index++){
					currParent.push({element:options.parent[index],children:[]});
					currParent = currParent[0].children;
				}
				currParent.push({
						element:reference.prefix + ':' + reference.object.name,
						attributes:[
							{name:'idref', value:reference.object.attributes[utils.find('id',reference.object.attributes)].value}
						]
					}
				);
				
			}
			else {
				reference.ref = {
					name:reference.object.name,
					element:reference.prefix + ':' + reference.object.name,
					attributes:[
						{name:'idref', value:reference.object['id'].value}
					]
				};
			}
		};
		
		return reference;
	}
	
	/**
	 * this function returns a object_reference
	 */
	function object(prefix,refObject,options){
		var reference = {};
		//default values
		reference.prefix = prefix;
		reference.object = refObject;
		reference.element = reference.prefix + ':' + reference.object.name;
		reference.attrType = 'object_reference';
		reference.ref = '';
		//console.log('options.attrType');//console.log(options.attrType);
		// passed options replacement
		if(options !== 'undefined'){
			if (options.element) {
				reference.element = options.element;
			}
			if (options.attrType) {
				reference.attrType = options.attrType;
			}
		}
		reference.update = function(passedRefObject){
			reference.object = passedRefObject;
			var objId = '';
			// determine if this a element is an Object type
			if(passedRefObject.name.indexOf('Object') > -1){
				objId = reference.object.attributes[utils.find('id',reference.object.attributes)].value;
			} else {
				
				for(var childIndex = 0; childIndex < passedRefObject.children.length; childIndex++){
					var child = passedRefObject.children[childIndex];
					if(child.hasOwnProperty('chosen')){
						child = child.chosen;
					}
					if(child.name.indexOf('Object') > -1){
						objId = child.attributes[utils.find('id',child.attributes)].value;
						break;
					}
				}
			}
			
			reference.ref = {
				name:reference.object.name,
				element:reference.element,
				attributes:[
					{name:reference.attrType, value:objId}
				]
			};
		};
		
		return reference;
	}
	

	function updateRef (refObjectString) {
		return function(child){
			// something is adding extra items(objects) to this.list.
			// Quick fix remove non-sting values
			for(index = 0; index <= this.list.length; index++){
				if(typeof(this.list[index]) !== "string"){
					this.list.splice(index,1);
				}
			}
			// remove child if it is in log
			var id = utils.getObj('name','id',child.attributes);
			var refType = object(this.element.split(":")[0],child,{element:this.element.split(":")[0]+":"+refObjectString});
			refType.update(child);
			// child is already in list
			if(this.list.indexOf(refType.ref.attributes[0].value) >= 0){
			// if(this.list.indexOf("me") >= 0){
				var index = this.list.indexOf(refType.ref.attributes[0].value);
				this.list.splice(index,1);
				// var index = this.list.indexOf("me");
				// this.list.splice(index,1);
				this.children.splice(index,1);
			}
			// otherwise add child if not in list
			else {
				this.list.push(refType.ref.attributes[0].value);
				this.children.push(refType);
			}
		}
	}

	function cleanRef () {
		return function(stixObjectArray){
			toDelete = [];
			stixIds = [];
			for(var index = 0; index < stixObjectArray.length; index++){
				stixIds.push(stixObjectArray[index].id.value);
				if(stixObjectArray[index].hasOwnProperty('object')){
					stixIds.push(stixObjectArray[index].object.id.value);
				}
			}
			for(var index = 0; index < this.children.length; index++){
				var ref = this.children[index];
				if(stixIds.indexOf(ref.object.id.value) < 0){
					this.updateRef(ref.object);
				}
			}
		}
	}

	function display(refObject){
		if(refObject.hasOwnProperty('ref')){
			refObject = refObject.object;
		}
		return refObject.title.text +'***'+ refObject.id.value
	}
	
	function selfReference(Object,refObject){
		return Object == refObject;
	}
	
	/**
	 * this function compares to the ids/idref of the passedObject to determine if items
	 * exist within the passedArray
	 * returns true if the passed object exist within the passed array
	 * false otherwise
	 */
	function displayFilter(passedObject, passedArray){
		if(passedObject.hasOwnProperty('ref')){
			passedObject = passedObject.object;
		}
		var idref = utils.find('idref',passedObject.attributes);
		if(!idref){
			idref = utils.find('id',passedObject.attributes);
		}
		idref = passedObject.attributes[idref];
		if(!idref) {
			return false;
		}
		for(var index = 0; index < passedArray.length; index++){
			var arrayObject = passedArray[index];
			if(arrayObject.hasOwnProperty('ref')){
				arrayObject = arrayObject.object;
			}
			var id = utils.find('id',arrayObject.attributes);
			if(!id){
				id = utils.find('idref',arrayObject.attributes);
			}
			id = arrayObject.attributes[id];
			
			if( id && idref.value == id.value){
				return true;
			}
		
		}
		return false;
	}

	return{
		reference:reference,
		object:object,
		updateRef:updateRef,
		cleanRef:cleanRef,
		display:display,
		selfReference:selfReference,
		displayFilter:displayFilter
	}
}]);