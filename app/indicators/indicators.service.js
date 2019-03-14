angular.module('app.indicators')
.service('indicators',['indicator',function(indicator){
	function indicators(){
		var indicators = {};
		indicators.childType = function(){return indicator.indicator();};
		indicators.name = 'Indicators';
		indicators.element = 'stix:Indicators';
		indicators.tooltip = 'Characterizes one or more cyber threat Indicators.';
		indicators.arialabel = 'Indicators menu button: click to toggle indicator menu options: Characterizes one or more cyber threat Indicators.';
		indicators.children = [];
		indicators.add = function(indicator){this.children.push(indicator);};
		indicators.del = function(index){this.children.splice(index,1);};
		return indicators;
	}
	
	return {indicators:indicators}
}]);
