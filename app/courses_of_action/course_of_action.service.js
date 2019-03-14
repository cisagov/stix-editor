angular.module('app.courses_of_action')
.service('coa',['guid',function(guid){
	function coa (){
		var coa = {};
		coa.name = 'Course_Of_Action';
		coa.element = 'stix:Course_Of_Action';
		coa.tooltip = 'The CourseOfAction field is optional and characterizes a Course of Action to be taken in regards to one of more cyber threats. NOTE: This construct is still in its early stages of maturity and will require a good deal of review and refinement.';
		coa.id = {name:'id',value:guid.guid(coa.name)};
		coa.timestamp = {name:'timestamp',value:guid.timestamp()};
		coa.attributes = [
			{name:'xsi:type',value:'coa:CourseOfActionType'},
			coa.id,
			coa.timestamp
		];
		coa.description = {
			name:'Description',
			parent: 'Course of Action',
			element:'coa:Description',
			text:'',
			tooltip:'The Description field is optional and provides an unstructured, text description of this CourseOfAction.'
		};

		coa.stage = {
			name:'Stage',
			element:'coa:Stage',
			tooltip:'The Stage field specifies what stage in the cyber threat management lifecycle this CourseOfAction is relevant to (e.g. Remedy or Response).',
			'xsi:type':{name:'xsi:type',value:'stixVocabs:COAStageVocab-1.0'},
			attributes: [],
			value:'',
			vocab:{list:[
					{name:'Remedy',description:'This COA is applicable to the "Remedy" stage of the threat management lifecycle, meaning it may be applied proactively to prevent future threats.'},
					{name:'Response',description:'This COA is applicable to the "Response" stage of the threat management lifecycle, meaning it may be applied as an immediate reaction to an ongoing threat.'}
				]
			}
		};
		coa.stage.attributes.push(coa.stage['xsi:type']);
		coa.title = {
			name:'Title',
			parent: 'Course of Action',
			element:'coa:Title',
			text:'',
			tooltip:'The Title field provides a simple title for this CourseOfAction.'
		};
		coa.children = [
			coa.title,
			coa.description
		];
		
		return coa;
	}

	return {coa:coa};
}]);