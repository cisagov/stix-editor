angular.module('app.header')
.service('header',['infoSource', function(infoSource){
	function header() {
		var factory = {};
		factory.name = 'STIX_Header';
		factory.element = 'stix:STIX_Header';
		factory.tooltip = "The STIX Header field provides information characterizing this package of STIX content.";
		factory.arialabel = "STIX Header menu button: click to load the STIX Header input page: The Structured Threat Information Expression Header field provides information characterizing this package of threat information content.";
		factory.title = {
			validation:{required:true},
			name:'Title',
			parent:'STIX Header',
			element:"stix:Title", 
			text:"",
			tooltip:"This required field provides a simple title for this Structured Threat Information Expression package"
		};
		factory.description = {
			validation:{required:true},
			name:"Description", 
			parent:'STIX Header',
			element:"stix:Description",
			text:"", 
			tooltip:"The required Description field provides a description of this Structured Threat Information Expression package."
		};
		factory.profiles = {name:"Profiles", element:"stix:Profiles", tooltip:"The Profiles field provides a list of profiles that the STIX_Package conforms to.",
				children:[{name:"Profile", element:"stixCommon:Profile", placeholder:"", tooltip:"The Profile field represents a reference to one STIX Profile. The profile is referenced as a URI and should include components for: the creator of the profile, the name of the profile, and the version of the profile. When publishing a profile, this URI should be published alongside the profile such that it can be referred to from this field.",
							items:[], 
							add:function(){this.items.push({name:this.placeholder});this.placeholder='';},
							del:function(index){this.items.splice(index,1);}
						}]
			};
		factory.package_intents = {
			validation:{required:true},
			name:'Package_Intent', 
			parent:'STIX Header',
			element:"stix:Package_Intent", 
			tooltip:"This required field characterizes the intended purposes or uses for this Structured Threat Information Expression package.",
			'xsi:type': {name:'xsi:type',value:'stixVocabs:PackageIntentVocab-1.0'},
			items:[],
			vocab:{
				multiple:true,list:[
					{name:'Collective Threat Intelligence',description:'Package is intended to convey a broad characterization of a threat across multiple facets.'},
					{name:'Threat Report',description:'Package is intended to convey a broad characterization of a threat across multiple facets expressed as a cohesive report.'},
					{name:'Indicators',description:'Package is intended to convey mainly indicators.'},
					{name:'Indicators - Phishing',description:'Package is intended to convey mainly phishing indicators.'},
					{name:'Indicators - Watchlist',description:'Package is intended to convey mainly network watchlist indicators.'},
					{name:'Indicators - Malware Artifacts',description:'Package is intended to convey mainly malware artifact indicators.'},
					{name:'Indicators - Network Activity',description:'Package is intended to convey mainly network activity indicators.'},
					{name:'Indicators - Endpoint Characteristics',description:'Package is intended to convey mainly endpoint characteristics (hashes, registry values, installed software, known vulnerabilities, etc.) indicators.'},
					{name:'Campaign Characterization',description:'Package is intended to convey mainly a characterization of one or more campaigns.'},
					{name:'Threat Actor Characterization',description:'Package is intended to convey mainly a characterization of one or more threat actors.'},
					{name:'Exploit Characterization',description:'Package is intended to convey mainly a characterization of one or more exploits.'},
					{name:'Attack Pattern Characterization',description:'Package is intended to convey mainly a characterization of one or more attack patterns.'},
					{name:'Malware Characterization',description:'Package is intended to convey mainly a characterization of one or more malware instances.'},
					{name:'TTP - Infrastructure',description:'Package is intended to convey mainly a characterization of attacker infrastructure.'},
					{name:'TTP - Tools',description:'Package is intended to convey mainly a characterization of attacker tools.'},
					{name:'Courses of Action',description:'Package is intended to convey mainly a set of courses of action.'},
					{name:'Incident',description:'Package is intended to convey mainly information about one or more incidents.'},
					{name:'Observations',description:'Package is intended to convey mainly information about instantial observations (cyber observables).'},
					{name:'Observations - Email',description:'Package is intended to convey mainly information about instantial email observations (email cyber observables).'},
					{name:'Malware Samples',description:'Package is intended to convey a set of malware samples.'}
				]}
			};
		factory.package_intents.attributes = [factory.package_intents['xsi:type']];
		factory.handling = {
			validation:{required:true},
			name:"Handling",
			parent:"STIX Header",
			element:"stix:Handling",
			tooltip:"This required field specifies handling guidance for this Structured Threat Information Expression Package.",
			children: [],
			addmarking:function(marking){
				this.children.push(marking);
			},
			delmarking:function(index){this.children.splice(index,1);}
		};
		factory.information_source = infoSource.infoSource();
		factory.children = [
			factory.title,
			factory.package_intents,
			factory.description,
			factory.handling
		];
		return factory;
	};
	return { header : header };
}]);
