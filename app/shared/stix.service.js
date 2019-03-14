angular.module('stixServices',[])
.service('stixCommon',[function(){
	function killChainPhase(){
		var killChainPhase = {};
		killChainPhase.name = 'Kill_Chain_Phase';
		killChainPhase.element = 'stixCommon:Kill_Chain_Phase';
		killChainPhase.tooltip = 'The Kill_Chain_Phase field specifies a single Kill Chain phase associated with this item.';
		killChainPhase.extBase = {name:'name',tooltip:'This field specifies the descriptive name of the relevant kill chain phase.',
			value:{name:""},
			vocab:{list:[
					{name:"Reconnaissance",ordinality:"1",phase_id:"stix:KillChainPhase-af1016d6-a744-4ed7-ac91-00fe2272185a"},
					{name:"Weaponization",ordinality:"2",phase_id:"stix:KillChainPhase-445b4827-3cca-42bd-8421-f2e947133c16"},
					{name:"Delivery",ordinality:"3",phase_id:"stix:KillChainPhase-79a0e041-9d5f-49bb-ada4-8322622b162d"},
					{name:"Exploitation",ordinality:"4",phase_id:"stix:KillChainPhase-f706e4e7-53d8-44ef-967f-81535c9db7d0"},
					{name:"Installation",ordinality:"5",phase_id:"stix:KillChainPhase-e1e4e3f7-be3b-4b39-b80a-a593cfd99a4f"},
					{name:"Command and Control",ordinality:"6",phase_id:"stix:KillChainPhase-d6dc32b9-2538-4951-8733-3cb9ef1daae2"},
					{name:"Actions on Objectives",ordinality:"7",phase_id:"stix:KillChainPhase-786ca8f9-2d9a-4213-b38e-399af4a2e5d6"}
				]
			}
		};
		killChainPhase.ordinality = {name:'ordinality',disabled:true,tooltip:'This field specifies the ordinality (e.g. 1, 2 or 3) of this phase within this kill chain definition.'};
		killChainPhase.phase_id = {name:'phase_id',disabled:true,tooltip:'A globally unique identifier for this kill chain phase'};
		killChainPhase.kill_chain_id = {name:'kill_chain_id',value:'stix:KillChain-af3e707f-2fb9-49e5-8c37-14026ca0a5ff',tooltip:'This field specifies the ID for the relevant defined kill chain.'};
		killChainPhase.kill_chain_name = {name:'kill_chain_name',value:'LM Cyber Kill Chain',tooltip:'This field specifies the descriptive name of the relevant kill chain. If a kill chain is being referenced (via the kill_chain_id field), this field should be omitted or, if present, must match the kill chain name of the kill chain referenced by the @kill_chain_id attribute.'};
		killChainPhase.attributes = [
			killChainPhase.kill_chain_id,
			killChainPhase.kill_chain_name,
			killChainPhase.extBase,
			killChainPhase.ordinality,
			killChainPhase.phase_id
		];
		killChainPhase.sync = function(){
			if (killChainPhase.extBase.vocab.list.indexOf(killChainPhase.extBase.value) >= 0){
				killChainPhase.ordinality['value'] = killChainPhase.extBase.value.ordinality;
				killChainPhase.phase_id['value'] = killChainPhase.extBase.value.phase_id;
			}
			else {
				delete killChainPhase.extBase.value;
			}

		};

		// set killChainPhase to Reconnaissance as default
		//killChainPhase.extBase.value = killChainPhase.extBase.vocab.list[0];
		killChainPhase.sync();
		
		return killChainPhase;
	}
	
	function name (options) {
		var name = {};
		name.name = 'Name';
		name.element = 'stixCommon:Name';
		name.text = '';
		name.tooltip = 'The Name field allows for expression of an identity through a simple name.';
		
		if(typeof(options) !== 'undefined'){
			if(typeof(options.tooltip) !== 'undefined'){
				name.tooltip = options.tooltip;
			}
			if (typeof(options.text) !== 'undefined'){
				name.text = options.text;
			}
		}
		
		return name;
	}
	
	return{
		killChainPhase:killChainPhase,
		name:name
	}
}]);