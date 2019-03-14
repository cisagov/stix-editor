angular.module('guiServices')
.service('filter',['utils',function(utils){
	function observableObject(obChildren,objectTypes){
		var allTypes = false;
		if(typeof(objectTypes) === 'undefined'){
			objectTypes = [''];
			allTypes = true;
		}
		var objectArray = [];
		for(var obIndex = 0; obIndex < obChildren.length; obIndex++){
			var ob = obChildren[obIndex];
			for(var childIndex = 0; childIndex < ob.children.length; childIndex++){
				var child = ob.children[childIndex];
				if(child.element.indexOf('Object') > -1){
					var object = child;
					for(var objectIndex = 0; objectIndex < object.children.length; objectIndex++){
						var objectChild = object.children[objectIndex];
						if(objectChild.element.indexOf('Properties') > -1){
							if(objectChild.hasOwnProperty('attributes')){
								if(allTypes){
									objectArray.push({'index':obIndex, 'object':ob, 'hashKey':ob.$$hashKey});
								}
								else {
									for(var typeIndex = 0; typeIndex < objectTypes.length; typeIndex++){
										var objectType = objectTypes[typeIndex];
										if(utils.getObj('value',objectType,objectChild.attributes)){
											objectArray.push({'index':obIndex, 'object':ob});
											break;
										}
									}
								}
							}
						}
					}
				}
				
			}
		}
		//alert();
		return objectArray;
	}
	
	return {
		obObjArray:observableObject
	}
}]);