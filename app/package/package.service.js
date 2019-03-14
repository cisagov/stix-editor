angular.module('app.package')
.service('stix',['utils','guid','header', 'marking','stixNamespaces','observables','indicators','ets','ttps','coas',
	function(utils,guid,header,marking,stixNamespaces,observables,indicators,ets,ttps,coas){
		this.marking = marking;
		this.header = header.header();
		this.observables = observables.observables();
		this.indicators = indicators.indicators();
		this.ttps = ttps.ttps();
		this.ets = ets.ets();
		this.coas = coas.coas();
		this.ns = stixNamespaces;
		this.package = {name:'STIX_Package', element:'stix:STIX_Package', 
			id:{name:'id',value:guid.guid('Package')},
			timestamp:{name:'timestamp',value:guid.timestamp()},
			children:[this.header,
				this.observables,
				this.indicators,
				this.ttps,
				this.ets,
				this.coas
			]
		};
		this.package.attributes = [this.package.id,this.package.timestamp];
		this.removeOrphans = function (paramObj) {
			var used_ids = {};
			var orphan_ids = [];
	
			function get_used_ids (refObject) {
				function get_id (ref) {
					for(attrIndex = 0; attrIndex < ref.attributes.length; attrIndex++){
						attr = ref.attributes[attrIndex];
						if(attr.hasOwnProperty('name') && attr.name == "idref" &&
							attr.hasOwnProperty('value')){
							return attr.value;
						}
					}
				}
				if(refObject.hasOwnProperty('children')){
					for(refObjectChildIndex = 0; refObjectChildIndex < refObject.children.length; refObjectChildIndex++){
						ref = refObject.children[refObjectChildIndex].ref;
						if(ref.hasOwnProperty('children')){
							for(refChildIndex = 0; refChildIndex < ref.children.length; refChildIndex++){
								used_ids[get_id(ref.children[refChildIndex])] = true;
							}
						}
					}
				}
				else{
					used_ids[get_id(refObject.ref)] = true;
				}
			}
	
			if (typeof(paramObj) === "object" &&
				paramObj.hasOwnProperty('orphan') &&
				paramObj.hasOwnProperty('from') &&
				paramObj.hasOwnProperty('where')){
	
				for(index = 0; index < this[paramObj.from].children.length; index++){
					child = this[paramObj.from].children[index];
					get_used_ids(child[paramObj.where]);
	
				}

				for(index = 0; index < this[paramObj.orphan].children.length; index++){
					child = this[paramObj.orphan].children[index];
					if(!used_ids.hasOwnProperty(child.id.value)){
						orphan_ids.push(index);
					}
				}
				for(index = 0; index < orphan_ids.length; index++){
					this[paramObj.orphan].del(orphan_ids[index]-index);
				}
			}
			else {
				console.log('paramObj should be an object with "orphan" and "from" keys not:',paramObj);
			}
		}
		this.convertDelimited = function(){
			for(index = 0; index < this.indicators.children.length; index++){
				var indicator = this.indicators.children[index];
				var observable = this.observables.children.filter(function(item,i,arr){
					return item.id.value == indicator.observable.object.id.value;
				});
				observable = observable[0];
				if(typeof(observable) === "object"){
					console.log('ind OB', observable);
					object = observable.object;
					for(fieldIndex = 0; fieldIndex < object.properties.children.length; fieldIndex++){
						field = object.properties.children[fieldIndex];
						var items = [];
						if (field.hasOwnProperty('delimiter') && field.hasOwnProperty('items') &&
							field.items.length > 0){
							field.items.filter(function(item,i,arr){
								if (item.name.trim() != "" && items.indexOf(item.name.trim()) == -1){
									items.push(item.name.trim());
								}
							});
							field.text = items.shift();
							delete field.delimiter;
							delete field.items;
							delete field.placeholder;
							delete field.add;
							field.attributes.splice(utils.find('delimiter',field.attributes),1);
	
							for(itemIndex = 0; itemIndex < items.length; itemIndex++){
								console.log(items[itemIndex]);
								var newOb = angular.copy(observable);
								newOb.id = {name:'id',value:guid.guid('Observable')};
								newOb.attributes[0] = newOb.id;
								newOb.object.id = {name:'id',value:guid.guid('Object')};
								newOb.object.attributes[0] = newOb.object.id;
								newOb.object.properties.children[fieldIndex].text = items[itemIndex];
								newOb.object.children[0] = newOb.object.properties;
								newOb.children[0] = newOb.object;
								this.observables.add(newOb);

								var newInd = angular.copy(indicator);
								id = {name:'id', value:guid.guid('Indicator')};
								newInd.id = id;
								newInd.attributes[1] = id;
								console.log(id);
								newInd.references['observable'].update(newOb);
								this.indicators.add(newInd);
							}
						}
					}
				}
			}
		}
	
		this.ref2Embedded = function(indicator){
	
		}
	
		this.removeSTIXSection = function(section){
			if (this.package.children.indexOf(this[section]) >= 0){
				this.package.children.splice(this.package.children.indexOf(this[section]),1);
			}
		}
	}
]);
