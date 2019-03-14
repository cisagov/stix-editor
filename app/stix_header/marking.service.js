angular.module('app.header')
.service('marking',['tool','ciq_identity', function(tool,ciq_identity){	
	function marking_info_source(){
		var marking_info_source = {};
		marking_info_source.name = 'Information_Source';
		marking_info_source.element = 'marking:Information_Source';
		marking_info_source.ciq = ciq_identity.ciq_identity();
		marking_info_source.tool = tool.tool();
		marking_info_source.children = [
			marking_info_source.ciq,
			{name:'Tools', element:'stixCommon:Tools',
				children:[
					marking_info_source.tool
				]
			}
		];

		return marking_info_source;
	}

	function is_proprietary() {
		var marking = {};
		marking.name = 'Marking';
		marking.element = 'marking:Marking';
		marking.controlled_structure = {name:"Controlled_Structure",element:"marking:Controlled_Structure",text:"//node()"};
		marking.marking_structure = {name:"Marking_Structure",element:"marking:Marking_Structure",
			'xsi:type':{name:'xsi:type',value:'AIS:AISMarkingStructure'},
			'is_proprietary':{name:'Proprietary',element:'AIS:Is_Proprietary',
				ais_consent:{name:'AISConsent', element:'AIS:AISConsent', attributes:[{'name':'consent',value:'EVERYONE'}]},
				ais_color:{name:'AISTLP', element:'AIS:TLPMarking',
					attributes:[]
				},
				color:{name:'color',
					vocab:{list:[
						{name:'WHITE'},
						{name:'GREEN'},
						{name:'AMBER'}
					]}
				},
				attributes:[{name:'CISA_Proprietary',value:'true'}],
				children:[]
			},
			attributes:[],
			children:[]
		};
		// add children to is_proprietary
		marking.marking_structure.is_proprietary.ais_color.attributes.push(marking.marking_structure.is_proprietary.color)
		marking.marking_structure.is_proprietary.children.push(marking.marking_structure.is_proprietary.ais_consent,marking.marking_structure.is_proprietary.ais_color);

		//this sets the default value on the dropdown
		marking.marking_structure.is_proprietary.ais_color.attributes[0].value = marking.marking_structure.is_proprietary.color.vocab.list[0];
		// add is_proprietary to marking.marking_structure
		marking.marking_structure.attributes.push(marking.marking_structure['xsi:type']);
		marking.marking_structure.children.push(marking.marking_structure.is_proprietary);
		
		marking.information_source = marking_info_source();
		marking.children = [
			marking.controlled_structure,
			marking.marking_structure,
			marking.information_source
		];
		return marking;
	}
	
	function not_proprietary() {
		var marking = {};
		marking.name = 'Marking';
		marking.element = 'marking:Marking';
		marking.controlled_structure = {name:"Controlled_Structure",element:"marking:Controlled_Structure",text:"//node()"};
		marking.marking_structure = {name:"Marking_Structure",element:"marking:Marking_Structure",
			'xsi:type':{name:'xsi:type',value:'AIS:AISMarkingStructure'},
			'not_proprietary':{name:'Proprietary',element:'AIS:Not_Proprietary',
				ais_consent:{name:'AISConsent', element:'AIS:AISConsent', 
					attributes:[]
				},
				ais_color:{name:'AISTLP', element:'AIS:TLPMarking',
					attributes:[]
				},
				consent:{name:'consent',
					vocab:{list:[
						{name:'EVERYONE'},
						{name:'USG'},
						{name:'NONE'}
					]}
				},
				color:{name:'color',
					vocab:{list:[
						{name:'WHITE'},
						{name:'GREEN'},
						{name:'AMBER'}
					]}
				},
				attributes:[{name:'CISA_Proprietary',value:'false'}],
				children:[]
			},
			attributes:[],
			children:[]
		};
		// add children to not_proprietary
		marking.marking_structure.not_proprietary.ais_consent.attributes.push(marking.marking_structure.not_proprietary.consent)
		marking.marking_structure.not_proprietary.ais_color.attributes.push(marking.marking_structure.not_proprietary.color)
		marking.marking_structure.not_proprietary.children.push(marking.marking_structure.not_proprietary.ais_consent,marking.marking_structure.not_proprietary.ais_color);
		
		// set default values
		marking.marking_structure.not_proprietary.ais_consent.attributes[0].value = marking.marking_structure.not_proprietary.consent.vocab.list[0]
		marking.marking_structure.not_proprietary.ais_color.attributes[0].value = marking.marking_structure.not_proprietary.color.vocab.list[0]

		// add not_proprietary to marking.marking_structure
		marking.marking_structure.attributes.push(marking.marking_structure['xsi:type']);
		marking.marking_structure.children.push(marking.marking_structure.not_proprietary);
		
		marking.information_source = marking_info_source();
		marking.children = [
			marking.controlled_structure,
			marking.marking_structure,
			marking.information_source
		];
		return marking;
	}

	return {
		ais_not_proprietary:not_proprietary,
		ais_proprietary:is_proprietary,
		MIS:marking_info_source
	}
}]);