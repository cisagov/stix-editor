angular.module('app.header')
.service('infoSource',['references','tool',function(references,tool){
	function infoSource (){
		var info = {};
		info.name = "Information_Source";
		info.element = "stix:Information_Source";
		info.tooltip = "The Information_Source field details the source of this entry, including time information as well as information about the producer, contributors, tools, and references.";
		info.description = {name:"Description",element:"stixCommon:Description",text:"",tooltip:"The Description field provides a description of this information source."};
		info.identity = {name:"Identity",element:"stixCommon:Identity",tooltip:"The Identity field is optional and specifies the identity of the information source.",
			children:[{name:"Name",element:"stixCommon:Name",text:"",tooltip:"The Name field allows for expression of an identity through a simple name."}]
		};
		info.roles = {name:"Role",element:"stixCommon:Role",tooltip:"The Profile field represents a reference to one STIX Profile. The profile is referenced as a URI and should include components for: the creator of the profile, the name of the profile, and the version of the profile. When publishing a profile, this URI should be published alongside the profile such that it can be referred to from this field.",
			'xsi:type':{name:"xsi:type",value:"stixVocabs:InformationSourceRoleVocab-1.0"},
			items:[],
			vocab:{multiple:true,list:[{name:"Aggregator",description:"Aggregator"},
				{name:"Content Enhancer/Refiner",description:"Content Enhancer/Refiner"},
				{name:"Initial Author",description:"A party acting as the initial author/creator of a set of information."},
				{name:"Transformer/Translator",description:"A party that transforms or translates a preexisting set of information into a different representation (e.g., translating an unstructured prose threat analysis report into STIX)."},
			]},
			add:function(){this.items.push({name:this.placeholder});this.placeholder='';},
			del:function(index){this.items.splice(index,1);
			}
		};
		info.roles.attributes = [info.roles['xsi:type']];
		info.time = {
				name:"Time",
				element:"stixCommon:Time",
				tooltip:"The Time element is optional and enables description of various time-related attributes for this instance",
				start_time:{
					name:"Start_Time",
					element:"cyboxCommon:Start_Time",
					text:"",
					date:true,
					tooltip:"The Start_Time field is optional and describes the starting time for this construct. In order to avoid ambiguity, it is strongly suggest that all timestamps in this field include a specification of the timezone if it is known."
				},
				end_time:{
					name:'End_Time',
					element:"cyboxCommon:End_Time",
					text:"",
					date:true,
					tooltip:"The End_Time field is optional and describes the ending time for this construct. In order to avoid ambiguity, it is strongly suggest that all timestamps in this field include a specification of the timezone if it is known."
				},
				produced_time:{
					validation:{required:true},
					name:"Produced_Time",
					element:"cyboxCommon:Produced_Time",
					text:"",
					date:true,
					tooltip:"The Produced_Time field is required and describes the time that this construct was produced. In order to avoid ambiguity, it is strongly suggest that all timestamps in this field include a specification of the timezone if it is known."
				},
				received_time:{
					name:"Received_Time",
					element:"cyboxCommon:Received_Time",
					text:"",
					date:true,
					tooltip:"The Received_Time field is optional and describes the time that this construct was received. In order to avoid ambiguity, it is strongly suggest that all timestamps in this field include a specification of the timezone if it is known."
				}
		};
		info.time.children = [
			info.time.produced_time
		];
		info.tools = {name:"Tools",element:"stixCommon:Tools",tooltip:"The Tools element is optional and enables description of the tools utilized for this instance.",
			childType:tool,
			children:[],
			addTool:function(tool){this.children.push(tool);},
			delTool:function(index){this.children.splice(index,1);}
		};
		info.references = references.references('stix');
		info.children = [ info.time ];

		return info;
	}
	return {infoSource:infoSource}
}]);