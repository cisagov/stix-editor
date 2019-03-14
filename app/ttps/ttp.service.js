angular.module('app.ttps')
.service('ttp',['guid','tool','utils','reference','et',function(guid,tool,utils,reference,et){
	function ttp() {
		var ttp = {};
		ttp.name = 'TTP';
		ttp.element = 'stix:TTP';
		ttp.tooltip = 'The TTP field characterizes specific details of observed or potential attacker Tactics, Techniques and Procedures.';
		ttp.id = {name:'id',value:guid.guid(ttp.name)};
		ttp.timestamp = {name:'timestamp',value:guid.timestamp()};
		ttp.attributes = [
			{name:'xsi:type',value:'ttp:TTPType'},
			ttp.id,
			ttp.timestamp
		];
		
		ttp.title = {name:'Title',element:'ttp:Title',text:'',tooltip:'The Title field provides a simple title for this TTP.'};
		ttp.description = {name:'Description',element:'ttp:Description',text:'',tooltip:'The Description field is optional and provides an unstructured, text description of this TTP.'};
		
		ttp.behavior = {
			name:'Behavior',
			element:'ttp:Behavior',
			tooltip:'Behavior describes the attack patterns, malware, or exploits that the attacker leverages to execute this TTP.',
			attack_patterns: {
				name:'Attack_Patterns',
				element:'ttp:Attack_Patterns',
				tooltip:'The Attack_Patterns field specifies one or more Attack Patterns for this TTP item.',
				children:[],
				attack_pattern:function(){
					var attack_pattern = {};
					attack_pattern.name = 'Attack_Pattern';
					attack_pattern.element = 'ttp:Attack_Pattern';
					attack_pattern.attributes = [];
					attack_pattern.children = [];
					//attack_pattern.capec =  {name:'capec_id',value:'',pattern:/^CAPEC-\d+$/};
					attack_pattern.capec_id =  {
						name:'capec_id',
						parent:'Attack Pattern',
						value:'',
						tooltip:'This field specifies a reference to a particular entry within the Common Attack Pattern Enumeration and Classification (CAPEC)',
						pattern:/^CAPEC-\d+$/,
						validationtip:"Required format is 'CAPEC', dash, one or more numbers (for example: CAPEC-101)"
					};
					attack_pattern.title = {
						name:'Title',
						parent:'Attack Pattern',
						element:'ttp:Title',
						text:'',
						tooltip:'Title of this Attack Pattern'
					};
					attack_pattern.description = {
						name:'Description',
						parent:'Attack Pattern',
						element:'ttp:Description',
						text:'',
						tooltip:'Description of this Attack Pattern'
					};
					attack_pattern.attributes = [
						attack_pattern.capec_id
					];
					attack_pattern.children = [
						attack_pattern.title,
						attack_pattern.description
					];
					return attack_pattern;
				},
				addAttackPattern:function(attack_pattern){
					if( typeof(attack_pattern) === 'undefined'){
						attack_pattern = this.attack_pattern();
					}
					// if(attack_pattern.attributes["0"].value == ""){
					// 	delete attack_pattern.attributes["0"];
					// }
					this.children.push(attack_pattern);
				},
				delAttackPattern:function(index){this.children.splice(index,1);}
			}
		};
		ttp.behavior.children = [
			ttp.behavior.attack_patterns
		];
		
		ttp.related_ets = {name:'Related_Exploit_Targets',element:'ttp:Exploit_Targets',tooltip:'The Related_Exploit_Targets field characterizes potential vulnerability, weakness or configuration targets for exploitation by this TTP.',
				list:[],
				children:[],
				updateRef:function(child){
					var id = utils.getObj('name','id',child.attributes);
					var refType = reference.reference('stixCommon',child);
					var options = {parent:['ttp:Exploit_Target']};
					refType.update(child,options);
					
					if(this.list.indexOf(child) >= 0){
						var index = this.list.indexOf(child);
						this.list.splice(index,1);
						this.children.splice(index,1);
					}
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
		
		ttp.children = [
			ttp.behavior,
			ttp.related_ets
		];
		
		return ttp;
	}
	
	return {ttp:ttp};
}]);