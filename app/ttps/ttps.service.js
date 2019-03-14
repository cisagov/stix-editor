angular.module('app.ttps')
.service('ttps',['ttp',function(ttp){
	function ttps(){
		var ttps = {};
		ttps.childType = function(){ var child = ttp.ttp(); return child;}
		ttps.name = 'TTPs';
		ttps.element = 'stix:TTPs';
		ttps.tooltip = 'Characterizes one or more cyber threat adversary Tactics, Techniques or Procedures. TTPs within the editor are currently hardcoded values for Kill Chains so no user interface yet.';
		ttps.arialabel = 'Tactics, Techniques, or Procedures menu button: click to toggle TTPs menu options: Characterizes one or more cyber threat adversary Tactics, Techniques or Procedures. TTPs within the editor are currently hardcoded values for Kill Chains so no user interface yet.';
		ttps.children = [];
		ttps.killchainslist = [
			{name:'Kill_Chains',element:'stix:Kill_Chains',
				children:[
					{name:'Kill_Chain',element:'stixCommon:Kill_Chain',
						attributes:[
							{name:'definer',value:'LMCO'},
							{name:'id',value:'stix:KillChain-af3e707f-2fb9-49e5-8c37-14026ca0a5ff'},
							{name:'name',value:'LM Cyber Kill Chain'},
							{name:'number_of_phases',value:'7'},
							{name:'reference',value:'http://www.lockheedmartin.com/content/dam/lockheed/data/corporate/documents/LM-White-Paper-Intel-Driven-Defense.pdf'}
						],
						children:[
							{name:'Kill_Chain_Phase',element:'stixCommon:Kill_Chain_Phase',attributes:[
									{name:'name',value:'Reconnaissance'},
									{name:'ordinality',value:'1'},
									{name:'phase_id',value:'stix:KillChainPhase-af1016d6-a744-4ed7-ac91-00fe2272185a'}
								]
							},
							{name:'Kill_Chain_Phase',element:'stixCommon:Kill_Chain_Phase',attributes:[
									{name:'name',value:'Weaponization'},
									{name:'ordinality',value:'2'},
									{name:'phase_id',value:'stix:KillChainPhase-445b4827-3cca-42bd-8421-f2e947133c16'}
								]
							},
							{name:'Kill_Chain_Phase',element:'stixCommon:Kill_Chain_Phase',attributes:[
									{name:'name',value:'Delivery'},
									{name:'ordinality',value:'3'},
									{name:'phase_id',value:'stix:KillChainPhase-79a0e041-9d5f-49bb-ada4-8322622b162d'}
								]
							},
							{name:'Kill_Chain_Phase',element:'stixCommon:Kill_Chain_Phase',attributes:[
									{name:'name',value:'Exploitation'},
									{name:'ordinality',value:'4'},
									{name:'phase_id',value:'stix:KillChainPhase-f706e4e7-53d8-44ef-967f-81535c9db7d0'}
								]
							},
							{name:'Kill_Chain_Phase',element:'stixCommon:Kill_Chain_Phase',attributes:[
									{name:'name',value:'Installation'},
									{name:'ordinality',value:'5'},
									{name:'phase_id',value:'stix:KillChainPhase-e1e4e3f7-be3b-4b39-b80a-a593cfd99a4f'}
								]
							},
							{name:'Kill_Chain_Phase',element:'stixCommon:Kill_Chain_Phase',attributes:[
									{name:'name',value:'Command and Control'},
									{name:'ordinality',value:'6'},
									{name:'phase_id',value:'stix:KillChainPhase-d6dc32b9-2538-4951-8733-3cb9ef1daae2'}
								]
							},
							{name:'Kill_Chain_Phase',element:'stixCommon:Kill_Chain_Phase',attributes:[
									{name:'name',value:'Actions on Objectives'},
									{name:'ordinality',value:'7'},
									{name:'phase_id',value:'stix:KillChainPhase-786ca8f9-2d9a-4213-b38e-399af4a2e5d6'}
								]
							}
						]
					}
				]
			}
		];
		ttps.add = function(ttp){this.children.push(ttp);};
		ttps.del = function(index){this.children.splice(index,1);};
		
		return ttps;
	}
	
	return {ttps:ttps}
}]);