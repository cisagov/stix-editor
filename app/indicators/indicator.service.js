angular.module('app.indicators')
.service('indicator',['observable','guid','reference','utils','stixCommon','coa',function(observable,guid,reference,utils,stixCommon,coa){
	function indicator(){
		indicator = {};
		indicator.name = 'Indicator';
		indicator.element = 'stix:Indicator';
		indicator.tooltip = 'The Indicator field characterizes a cyber threat indicator made up of a pattern identifying certain observable conditions as well as contextual information about the patterns meaning, how and when it should be acted on, etc.';
		indicator.id  = {name:'id',value:guid.guid(indicator.name)};
		indicator.timestamp = {name:'timestamp',value:guid.timestamp()};
		indicator.attributes = [
			{name:'xsi:type',value:'indicator:IndicatorType'},
			indicator.id,
			indicator.timestamp
		];
		indicator.references = {
			'observable':reference.reference(indicator.name.toLowerCase(),observable.observable()),
			'coa':reference.reference('stixCommon',coa.coa()),
			'indicators':{
				name:'Composite_Indicator_Expression',
				element:'indicator:Composite_Indicator_Expression',
				operator: {name:'operator',value:'OR'},
				attributes:[],
				list:[],
				children:[],
				updateRef:function(child){
					var id = utils.getObj('name','id',child.attributes);
					var refType = reference.reference(indicator.name.toLowerCase(),child);
					refType.update(child);
						
					if(this.list.indexOf(child) >= 0){
						var index = this.list.indexOf(child);
						this.list.splice(index,1);
						
						this.children.splice(index,1);
						
					} else {
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
			}
		}
		indicator.references['indicators'].attributes.push(indicator.references['indicators'].operator);
		indicator.observable = indicator.references['observable'];
		indicator.observable.object.object.validation = {required:true};
		indicator.observable.update(indicator.observable.object);
		
		indicator.description = {
			name:'Description',
			element:'indicator:Description',
			parent:'Indicator',
			text:'',
			tooltip:'The Description field provides an unstructured, text description for this Indicator.'
		};

		indicator.indicator_types = {
			name:'Type',
			parent:'Indicator',
			element:'indicator:Type', 
			tooltip:'Specifies the type or types for this Indicator.',
			'xsi:type':{name:'xsi:type',value:'stixVocabs:IndicatorTypeVocab-1.1'},
			attributes:[],
			items:[],
			vocab:{multiple:true, list:[
				{name:'Malicious E-mail',description:'Indicator describes suspected malicious e-mail (phishing, spear phishing, infected, etc.).'},
				{name:'IP Watchlist',description:'Indicator describes a set of suspected malicious IP addresses or IP blocks.'},
				{name:'File Hash Watchlist',description:'Indicator describes a set of hashes for suspected malicious files.'},
				{name:'Domain Watchlist',description:'Indicator describes a set of suspected malicious domains.'},
				{name:'URL Watchlist',description:'Indicator describes a set of suspected malicious URLS.'},
				{name:'Malware Artifacts',description:'Indicator describes the effects of suspected malware.'},
				{name:'C2',description:'Indicator describes suspected command and control activity or static indications.'},
				{name:'Anonymization',description:'Indicator describes suspected anonymization techniques (Proxy, TOR, VPN, etc.).'},
				{name:'Exfiltration',description:'Indicator describes suspected exfiltration techniques or behavior.'},
				{name:'Host Characteristics',description:'Indicator describes suspected malicious host characteristics.'},
				{name:'Compromised PKI Certificate',description:'Indicator describes a compromised PKI Certificate.'},
				{name:'Login Name',description:'Indicator describes a compromised Login Name.'},
				{name:'IMEI Watchlist',description:'Indicator describes a watchlist for IMEI (handset) identifiers.'},
				{name:'IMSI Watchlist',description:'Indicator describes a watchlist for IMSI (SIM card) identifiers.'}
			]}
		};
		
		indicator.indicator_types.attributes.push(indicator.indicator_types['xsi:type']);
		indicator.kill_chain_phases = {
			name:'Kill_Chain_Phases',
			element:'indicator:Kill_Chain_Phases',
			parent:'Indicator Kill Chain Phase',
			tooltip:'Specifies relevant kill chain phases indicated by this Indicator.',
			kill_chain_phase: stixCommon.killChainPhase(),
			children:[]
		};
		indicator.kill_chain_phases.children.push(indicator.kill_chain_phases.kill_chain_phase);

		indicator.sightings = {
			name:'Sightings',
			element:'indicator:Sightings',
			parent:'Indicator',
			tooltip:'Characterizes a set of sighting reports for this Indicator.',

			sighting: function(passedTimestamp){
				if(typeof(passedTimestamp) == 'undefined'){
					passedTimestamp = '';
				}
				var sighting = {};
				sighting.name = 'Sighting';
				sighting.element = 'indicator:Sighting';
				sighting.tooltip = 'This field characterizes a single sighting report for this Indicator.';
				sighting.timestamp = {name:'timestamp',value:passedTimestamp,tooltip:'This field provides the date and time of the Indicator sighting.',date:true};
				sighting.attributes = [
					sighting.timestamp
				];
				return sighting;
			},
			
			sightings_count:{name:'sightings_count',value:''},
			attributes:[],
			children:[],
			
			addSighting:function(passedTimestamp){
				this.children.push(this.sighting(passedTimestamp)); 
				this.sightings_count.value = this.children.length.toString();
			},

			delSighting:function(index){
				this.children.splice(index,1); 
				this.sightings_count.value = this.children.length.toString();
			}
		};
		indicator.sightings.attributes.push(indicator.sightings.sightings_count);

		indicator.title = {name:'Title',element:'indicator:Title',text:'',tooltip:'The Title field provides a simple title for this Indicator.'};
		indicator.composite_indicator_expression = indicator.references['indicators'];
		indicator.choice = {choiceIndex:'a string',
			setIndex:function(index){
				this.choiceIndex = index;
				if(typeof(index) === 'number'){
					if(this.choice[this.choiceIndex].hasOwnProperty('ref')){
						this.chosen = this.choice[this.choiceIndex].object;
					} else {
						this.chosen = this.choice[this.choiceIndex];
					}
				} else {
					this.choiceIndex = 'a string';
					this.chosen = null;
				}
			},
			choice:[
				indicator.references['observable'],
				indicator.references['indicators']
			]
		};
		indicator.indicated_ttps = {
			name:'Indicated_TTPs',
			parent:'Indicators',
			tooltip:'Specifies the relevant TTP indicated by this Indicator.',
			list:[],
			children:[],
			updateRef:function(child){
				var id = utils.getObj('name','id',child.attributes);
				// add custom structure for Related_TTP tree
				var refType = reference.reference('stixCommon',child);
				var options = {parent:['indicator:Indicated_TTP']};
				refType.update(child,options);
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
						//toDelete.push(index);
						this.updateRef(ref.object);
					}
				}
			}
		};
		indicator.suggested_coas = {name:'Suggested_COAs',element:'indicator:Suggested_COAs',tooltip:'The Suggested_COAs field specifies suggested Courses of Action for this cyber threat Indicator.',
			list:[],
			children:[],
			updateRef:function(child){
				var id = utils.getObj('name','id',child.attributes);
				// custom structure to Suggested_COA tree
				var refType = reference.reference('stixCommon',child);
				var options = {parent:['indicator:Suggested_COA']};
				refType.update(child,options);
					
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
		indicator.children = [
			indicator.indicator_types,
			indicator.description,
			indicator.observable,// indicator.choice,
			indicator.indicated_ttps,
			indicator.kill_chain_phases,
			indicator.suggested_coas,
			indicator.sightings
		];
		
		return indicator;
	}
	
	return {indicator:indicator}
}]);