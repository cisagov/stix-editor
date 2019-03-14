angular.module('guiServices')
.service('guid',[function(){
	function guid(type) {
		var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
		
		if(typeof type === 'string'){
			return type + '-' + guid;
		} else {
			return guid;
		}
	}
	function timestamp () {
		timestamp = new Date();
		return timestamp.toISOString();
	}
	return {
		guid:guid,
		timestamp:timestamp
		}
}]);