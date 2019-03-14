angular.module('guiServices')
.service('utils',[function(){
	function getIndexInObjArrayByName(find,objArray){
		for(var obj in objArray){
			for(var key in obj){
				if(objArray[obj].name == find){
					return obj;
				}
			}
		}
		return false;
	}
	function getIndexInObjArrayByValue(find,objArray){
		for(var obj in objArray){
			for(var key in obj){
				if(objArray[obj].value == find){
					return obj;
				} else if(objArray[obj].text == find){
					return obj;
				}
			}
		}
		return false;
	}
	function getIndexInObjArrayByKey(find,objArray){
		for(var objIndex in objArray){
			if(objArray[objIndex].hasOwnProperty(find)){
					return objIndex;
			}
		}
		return false;
	}
	function getObjectInArrayByKeyValue(key,value,objArray){
		for(var objIndex in objArray){
			var hasKey = objArray[objIndex].hasOwnProperty(key);
			var tempValue = objArray[objIndex][key];
			if(objArray[objIndex].hasOwnProperty(key) && objArray[objIndex][key] == value){
				return objArray[objIndex];
			}
		}
		return false;
	}
	function objArrayToDict(objArray){
		returnObj = {};
		for(var i = 0; i < objArray.length; i++){
			returnObj[objArray[i].name] = objArray[i];
		}
		return returnObj;
	}
	/**
	 * returns a dictionary of values for a given key from an array of Objects
	 */
	function xmlAttributesToDict(fieldToKey,array){
		dictionary = {};
		for(var index in array){
			dictionary[array[index][fieldToKey]] = array[index];
		}
		return dictionary;
	}

	return {
		find:getIndexInObjArrayByName,
		elementByName:getIndexInObjArrayByName,
		findKey:getIndexInObjArrayByKey,
		getObj:getObjectInArrayByKeyValue,
		objArrayToDict:objArrayToDict,
		xmlAttributesToDict:xmlAttributesToDict
	}
}]);