angular.module('app.exports')
.service('importServices',['stix',function(stix){
	var observableReferences = {};
	observableReferences.attachments = {};
	observableReferences.links= {};

	function arrayToDictionary(fieldToKey,array){
		dictionary = {};
		for(var index in array){
			dictionary[array[index][fieldToKey]] = array[index];
		}
		return dictionary;
	};

	function isArray(o) {
	  return Object.prototype.toString.call(o) === '[object Array]';
	};

	function isObject(o){
		return ((typeof o === 'object') && (o !== null));
	};

	function retrieveMarkingInfo(markingjson, stix){
		if (markingjson.Marking_Structure['_xsi:type'] == 'AIS:AISMarkingStructure'){
			var obj = markingjson.Marking_Structure;
			if (isObject(obj) && (isObject(obj['Is_Proprietary']) || isObject(obj['Not_Proprietary']))) {
				if (obj.Is_Proprietary && obj.Is_Proprietary._CISA_Proprietary == "true") {
					var color = markingjson.Marking_Structure['Is_Proprietary']['TLPMarking']['_color'];
					var consent = markingjson.Marking_Structure['Is_Proprietary']['AISConsent']['_consent'];
					var prop_marking = stix.marking.ais_proprietary();
					prop_marking['marking_structure']['is_proprietary']['color']['value']['name'] = color;
				}
				if (isObject(obj['Not_Proprietary']) && obj['Not_Proprietary']['_CISA_Proprietary'] == "false") {
					var color = markingjson.Marking_Structure['Not_Proprietary']['TLPMarking']['_color'];
					var consent = markingjson.Marking_Structure['Not_Proprietary']['AISConsent']['_consent'];
					var prop_marking = stix.marking.ais_not_proprietary();
					prop_marking['marking_structure']['not_proprietary']['color']['value']['name'] = color;
					prop_marking['marking_structure']['not_proprietary']['consent']['value']['name'] = consent;
				}
				if (isObject(markingjson.Information_Source)){
					var infosrc_obj = markingjson.Information_Source;
					if (isObject(infosrc_obj.Identity)){
						if (isObject(infosrc_obj.Identity.Specification)) {
							var infoSource = stix.marking.MIS();
							if (isObject(infosrc_obj.Identity.Specification.OrganisationInfo)) {
								infoSource.ciq.sectors.value.name = infosrc_obj.Identity.Specification.OrganisationInfo['_xpil:IndustryType'];
							}
							if (isObject(infosrc_obj.Identity.Specification.Addresses.Address.Country)) {
								infoSource.ciq.countries.value.name = 
									infosrc_obj.Identity.Specification.Addresses.Address.Country.NameElement['_xal:NameCode'];
								infoSource.ciq.administrative_areas.value.name = 
									infosrc_obj.Identity.Specification.Addresses.Address.AdministrativeArea.NameElement['_xal:NameCode'];
							}
							if (isObject(infosrc_obj.Identity.Specification.PartyName)) {
								if (infosrc_obj.Identity.Specification.PartyName.OrganisationName && infosrc_obj.Identity.Specification.PartyName.OrganisationName.NameElement) {
									if (isArray(infosrc_obj.Identity.Specification.PartyName.OrganisationName.NameElement)) {
										for (var j=0; j < infosrc_obj.Identity.Specification.PartyName.OrganisationName.NameElement.length; j++) {
											infoSource.ciq.party_names.placeholder = infosrc_obj.Identity.Specification.PartyName.OrganisationName.NameElement[j]['__text'];
											infoSource.ciq.party_names.add();
										}
									} else {
										infoSource.ciq.party_names.placeholder = infosrc_obj.Identity.Specification.PartyName.OrganisationName.NameElement['__text'];
										infoSource.ciq.party_names.add();
									}
								}
							}
							prop_marking.information_source = infoSource;
							prop_marking.children[2] = infoSource;
						}
					}
				}
				stix.header.handling.delmarking(0);
				stix.header.handling.addmarking(prop_marking);
			}
		}
	};
	
	function importHeader(stixheaderjson, stix) {
		for (child in stix.header.children) {
			switch (stix.header.children[child].name) {
				case "Information_Source":
					if (stixheaderjson.Information_Source 
					&& stixheaderjson.Information_Source.Time && stixheaderjson.Information_Source.Time.Produced_Time){
						stix.header.information_source.time.produced_time.text = stixheaderjson.Information_Source.Time.Produced_Time;
					}
					break;
				case "Title":
					if (stixheaderjson.Title){
						stix.header.title.text = stixheaderjson.Title;	
					}
					break;
				case "Description":
					if (stixheaderjson.Description){
						stix.header.description.text = stixheaderjson.Description;	
					}
					break;
				case "Package_Intent":
					if (stixheaderjson.Package_Intent) {
						if (isArray(stixheaderjson.Package_Intent)) {
							for (var i = 0; i < stixheaderjson.Package_Intent.length; i++) {
								var package_intent = stixheaderjson.Package_Intent[i];
								for (var j = 0; j < stix.header.children[1].vocab.list.length; j++) {
									if (package_intent == stix.header.children[1].vocab.list[j].name) {
										stix.header.children[1].items.push(stix.header.children[1].vocab.list[j]);
									}
								}
							}
						} else {
							for (var j = 0; j < stix.header.children[1].vocab.list.length; j++) {
								if (stixheaderjson.Package_Intent.toString() == stix.header.children[1].vocab.list[j].name) {
									stix.header.children[1].items.push(stix.header.children[1].vocab.list[j]);
								}
							}
						}
					}
					break;
				case "Handling":
					if (stixheaderjson.Handling) {
						if (isArray(stixheaderjson.Handling.Marking)) {
							for (var i = 0; i < stixheaderjson.Handling.Marking.length; i++){
								retrieveMarkingInfo(stixheaderjson.Handling.Marking[i], stix);
							}
						} else {
							retrieveMarkingInfo(stixheaderjson.Handling.Marking, stix);
						}
					}
					break;
			}
		}
	};

	function importCOA(coajson, tempCOA, stix) {
		if (coajson['_id']) {
			tempCOA.id.value = coajson['_id'];
		}
		if (coajson.Title) {
			tempCOA.title.text = coajson.Title['__text'];
		}
		if (coajson.Description) {
			tempCOA.description.text = coajson.Description['__text'];
		}

		stix.coas.add(tempCOA);
	};

	function importExploitTarget(etjson, tempET, stix) {
		if (etjson['_id']) {
			tempET.id.value = etjson['_id'];
		}
		if (etjson.Vulnerability) {
			if (isArray(etjson.Vulnerability)) {
				for (var i = 0; i < etjson.Vulnerability.length; i++) {
					var vulnerability = tempET.vulnerabilities.vulnerability();
					if (etjson.Vulnerability[i].OSVDB_ID) {
						vulnerability.osvdb_id.text = etjson.Vulnerability[i].OSVDB_ID['__text'];
					}
					if (etjson.Vulnerability[i].CVE_ID) {
						vulnerability.cve_id.text = etjson.Vulnerability[i].CVE_ID['__text'];
					}
					if (etjson.Vulnerability[i].Title) {
						vulnerability.title.text = etjson.Vulnerability[i].Title['__text'];
					}
					if (etjson.Vulnerability[i].Description) {
						vulnerability.description.text = etjson.Vulnerability[i].Description['__text'];
					}
					tempET.vulnerabilities.addVulnerability(vulnerability);
				}
			} else {
				var vulnerability = tempET.vulnerabilities.vulnerability();
				if (etjson.Vulnerability.OSVDB_ID) {
					vulnerability.osvdb_id.text = etjson.Vulnerability.OSVDB_ID['__text'];
				}
				if (etjson.Vulnerability.CVE_ID) {
					vulnerability.cve_id.text = etjson.Vulnerability.CVE_ID['__text'];
				}
				if (etjson.Vulnerability.Title) {
					vulnerability.title.text = etjson.Vulnerability.Title['__text'];
				}
				if (etjson.Vulnerability.Description) {
					vulnerability.description.text = etjson.Vulnerability.Description['__text'];
				}
				tempET.vulnerabilities.addVulnerability(vulnerability);
			}
		}
		if (etjson.Potential_COAs && etjson.Potential_COAs.Potential_COA) {
			if (isArray(etjson.Potential_COAs.Potential_COA)) {
				for (var i = 0; i < etjson.Potential_COAs.Potential_COA.length; i++){
					for (var j=0; j < stix.coas.children.length; j++) {
						if (etjson.Potential_COAs.Potential_COA[i].Course_Of_Action['_idref'] == stix.coas.children[j].id.value) {
							tempET.potential_coas.updateRef(stix.coas.children[j]);
						}
					}
				}
			} else {
				for (var i=0; i < stix.coas.children.length; i++) {
					if (etjson.Potential_COAs.Potential_COA.Course_Of_Action['_idref'] == stix.coas.children[i].id.value) {
						tempET.potential_coas.updateRef(stix.coas.children[i]);
					}
				}
			}
		}
		stix.ets.add(tempET);
	}

	function importTTP(ttpjson, tempTTP, stix) {
		if (ttpjson['_id']) {
			tempTTP.id.value = ttpjson['_id'];
		}
		if (ttpjson.Behavior && ttpjson.Behavior.Attack_Patterns && ttpjson.Behavior.Attack_Patterns && ttpjson.Behavior.Attack_Patterns.Attack_Pattern) {
			if (isArray(ttpjson.Behavior.Attack_Patterns.Attack_Pattern)) {
				for (var i=0; i < ttpjson.Behavior.Attack_Patterns.Attack_Pattern.length; i++) {
					importAttackPatern(ttpjson.Behavior.Attack_Patterns.Attack_Pattern[i]);
				}
			} else {
				importAttackPatern(ttpjson.Behavior.Attack_Patterns.Attack_Pattern);
			}

			function importAttackPatern(jsonAttackPattern) {
				var tempAP = tempTTP.behavior.attack_patterns.attack_pattern();
				if (jsonAttackPattern['_capec_id']) {
					tempAP['capec_id'].value = jsonAttackPattern['_capec_id'];
				}
				if (jsonAttackPattern.Title) {
					tempAP['title'].text = jsonAttackPattern.Title['__text'];
				}
				if (jsonAttackPattern.Description) {
					tempAP['description'].text = jsonAttackPattern.Description['__text'];
				}
				tempTTP.behavior.attack_patterns.addAttackPattern(tempAP);
			}
		}
		if (ttpjson.Exploit_Targets && ttpjson.Exploit_Targets.Exploit_Target) {
			if (isArray(ttpjson.Exploit_Targets.Exploit_Target)) {
				for (var i = 0; i < ttpjson.Exploit_Targets.Exploit_Target.length; i++){
					for (var j=0; j < stix.ets.children.length; j++) {
						if (ttpjson.Exploit_Targets.Exploit_Target[i].Exploit_Target['_idref'] == stix.ets.children[j].id.value) {
							tempTTP.related_ets.updateRef(stix.ets.children[j]);
						}
					}
				}
			} else {
				for (var i=0; i < stix.ets.children.length; i++) {
					if (ttpjson.Exploit_Targets.Exploit_Target.Exploit_Target['_idref'] == stix.ets.children[i].id.value) {
						tempTTP.related_ets.updateRef(stix.ets.children[i]);
					}
				}
			}
		}

		if (ttpjson.Exploit_Targets && ttpjson.Exploit_Targets.Exploit_Target && ttpjson.Exploit_Targets.Exploit_Target.Exploit_Target && ttpjson.Exploit_Targets.Exploit_Target.Exploit_Target['_idref']) {

		}
		stix.ttps.add(tempTTP);
	}
	
	function importObservable(stixjson, indicatorjson, tempIndicator, tempObservable, stix) {
		var propertiesJson;
		if (indicatorjson.Observable['_id']) {
			tempObservable.id.value = indicatorjson.Observable['_id'];
			tempObservable.object.id.value = indicatorjson.Observable.Object['_id'];
			propertiesJson = indicatorjson.Observable.Object.Properties;
		} else if (indicatorjson.Observable['_idref']) {
			if (isArray(stixjson.STIX_Package.Observables.Observable)) {
				for (var i = 0; i < stixjson.STIX_Package.Observables.Observable.length; i++){
					if (indicatorjson.Observable['_idref'] == stixjson.STIX_Package.Observables.Observable[i]['_id']) {
						tempObservable.object.id.value = stixjson.STIX_Package.Observables.Observable[i].Object['_id'];
						propertiesJson = stixjson.STIX_Package.Observables.Observable[i].Object.Properties;
						break;
					}
				}
			} else {
				if (indicatorjson.Observable['_idref'] == stixjson.STIX_Package.Observables.Observable['_id']) {
					tempObservable.object.id.value = stixjson.STIX_Package.Observables.Observable.Object['_id'];
					propertiesJson = stixjson.STIX_Package.Observables.Observable.Object.Properties;
				}
			}
		}

		var xsiType = propertiesJson['_xsi:type'].substring(propertiesJson['_xsi:type'].indexOf(':')+1, propertiesJson['_xsi:type'].indexOf('Type'));
		if (tempIndicator.observable.object.object.properties.types.hasOwnProperty(xsiType)) {
			tempObservable.object.properties.change(propertiesJson['_xsi:type'].substring(propertiesJson['_xsi:type'].indexOf(':')+1,propertiesJson['_xsi:type'].indexOf('Type')));
			switch (xsiType) {
				case 'AddressObject':
					if(propertiesJson['_category']){
						if(typeof(tempObservable.object.properties._properties.category.vocab) !== 'undefined'){
							allowedValues = arrayToDictionary('name',tempObservable.object.properties._properties.category.vocab.list);
							if(allowedValues.hasOwnProperty(propertiesJson['_category'])){
								tempObservable.object.properties._properties.category = allowedValues[propertiesJson['_category']];
							}
						}
					}
					if(propertiesJson.Address_Value){
						tempObservable.object.properties._properties.address_value.placeholder = propertiesJson.Address_Value['__text'];
						tempObservable.object.properties._properties.address_value.add();
					}
					cybox_attrUpload(propertiesJson.Address_Value,tempObservable.object.properties._properties.address_value);
					break;
				case 'DomainNameObject':
					if (propertiesJson['_type']) {
						var allowedProperties = arrayToDictionary('name', tempObservable.object.properties._properties.type.vocab.list);
						if (allowedProperties.hasOwnProperty(propertiesJson['_type'])) {
							tempObservable.object.properties._properties.type = allowedProperties[propertiesJson['_type']];
						}
					}
					if (propertiesJson.Value) {
						tempObservable.object.properties._properties.value.placeholder = propertiesJson.Value['__text'];
						tempObservable.object.properties._properties.value.add();
					}
					break;
				case 'EmailMessageObject':
					if(propertiesJson.Raw_Body){
						tempObservable.object.properties._properties.raw_body.text = propertiesJson.Raw_Body['__text'];
					}
					if(propertiesJson.Header){
						if(propertiesJson.Header.From){
							if(propertiesJson.Header.From.Address_Value){
								if (propertiesJson.Header.From.Address_Value['__text'].indexOf('##comma##') > 0) {
									var values = propertiesJson.Header.From.Address_Value['__text'].split('##comma##');
									for (i = 0; i < values.length; i++) {
										tempObservable.object.properties._properties.header.from.addressObj.address_value.placeholder = values[i];
										tempObservable.object.properties._properties.header.from.addressObj.address_value.add();											
									}
								} else {
									tempObservable.object.properties._properties.header.from.addressObj.address_value.placeholder = propertiesJson.Header.From.Address_Value['__text'];
									tempObservable.object.properties._properties.header.from.addressObj.address_value.add();
								}
							}
						}
						if(propertiesJson.Header.Message_ID){
							tempObservable.object.properties._properties.header.message_id.text = propertiesJson.Header.Message_ID['__text'];
						}
						if(propertiesJson.Header.Subject){
							tempObservable.object.properties._properties.header.subject.text = propertiesJson.Header.Subject['__text'];
						}
						if(propertiesJson.Header.X_Mailer){
							tempObservable.object.properties._properties.header.x_mailer.text = propertiesJson.Header.X_Mailer['__text'];
						}
						if(propertiesJson.Header.X_Originating_IP && propertiesJson.Header.X_Originating_IP.Address_Value){
							if (propertiesJson.Header.X_Originating_IP.Address_Value['__text'].indexOf('##comma##') > 0) {
								var values = propertiesJson.Header.X_Originating_IP.Address_Value['__text'].split('##comma##');
								for (i = 0; i < values.length; i++) {
									tempObservable.object.properties._properties.header.x_originating_ip.addressObj.address_value.placeholder = values[i];
									tempObservable.object.properties._properties.header.x_originating_ip.addressObj.address_value.add();											
								}
							} else {
								tempObservable.object.properties._properties.header.x_originating_ip.addressObj.address_value.placeholder = propertiesJson.Header.X_Originating_IP.Address_Value['__text'];
								tempObservable.object.properties._properties.header.x_originating_ip.addressObj.address_value.add();
							}
						}
					}
					if(propertiesJson.Attachments){
						if (isArray(propertiesJson.Attachments.File)) {
							for(i = 0; i < propertiesJson.Attachments.File.length; i++){
								observableReferences.attachments[i + "-" + tempIndicator.id.value] = propertiesJson.Attachments.File[i]._object_reference;
							}
						} else {
							observableReferences.attachments[1 + "-" + tempIndicator.id.value] = propertiesJson.Attachments.File._object_reference;
						}
					}
					if(propertiesJson.Links){
						if (isArray(propertiesJson.Links.Link)) {
							for(i = 0; i < propertiesJson.Links.Link.length; i++){
								observableReferences.links[i + "-" + tempIndicator.id.value] = propertiesJson.Links.Link[i]._object_reference;
							}
						} else {
							observableReferences.links[1 + "-" + tempIndicator.id.value] = propertiesJson.Links.Link._object_reference;
						}
					}
					break;
				case 'FileObject':
					if(propertiesJson.File_Extension){
						tempObservable.object.properties._properties.file_extension.text = propertiesJson.File_Extension['__text'];
					}
					if(propertiesJson.File_Name){
						tempObservable.object.properties._properties.file_name.text = propertiesJson.File_Name['__text'];
					}
					if(propertiesJson.File_Path){
						tempObservable.object.properties._properties.file_path.text = propertiesJson.File_Path['__text'];
					}
					if(propertiesJson.Size_In_Bytes){
						tempObservable.object.properties._properties.size_in_bytes.text = propertiesJson.Size_In_Bytes['__text'];
					}
					if(propertiesJson.Hashes && propertiesJson.Hashes.Hash){
						if (!isArray(propertiesJson.Hashes.Hash)) {
							if (propertiesJson.Hashes.Hash.Simple_Hash_Value && propertiesJson.Hashes.Hash.Type) {
								tempObservable.object.properties._properties.hashes.addHash({'simple':propertiesJson.Hashes.Hash.Simple_Hash_Value['__text'],'type':propertiesJson.Hashes.Hash.Type['__text']});
							}
						} else {
							for(i = 0; i < propertiesJson.Hashes.Hash.length; i++){
								if (propertiesJson.Hashes.Hash[i].Simple_Hash_Value && propertiesJson.Hashes.Hash[i].Type) {
									tempObservable.object.properties._properties.hashes.addHash({'simple':propertiesJson.Hashes.Hash[i].Simple_Hash_Value['__text'],'type':propertiesJson.Hashes.Hash[i].Type['__text']});
								}
							}
						}
					}
					break;
				case 'HTTPSessionObject':
					if(propertiesJson.HTTP_Request_Response && propertiesJson.HTTP_Request_Response.HTTP_Client_Request && propertiesJson.HTTP_Request_Response.HTTP_Client_Request.HTTP_Request_Header
						&& propertiesJson.HTTP_Request_Response.HTTP_Client_Request.HTTP_Request_Header.Parsed_Header && propertiesJson.HTTP_Request_Response.HTTP_Client_Request.HTTP_Request_Header.Parsed_Header.User_Agent) {
						tempObservable.object.properties._properties.user_agent.text = propertiesJson.HTTP_Request_Response.HTTP_Client_Request.HTTP_Request_Header.Parsed_Header.User_Agent['__text'];
					}
					break;
				case 'LinkObject':
					if(propertiesJson.hasOwnProperty('_type')){
						allowedValues = arrayToDictionary('name',tempObservable.object.properties._properties.type.vocab.list);
						if(allowedValues.hasOwnProperty(propertiesJson['_type'])){
							tempObservable.object.properties._properties.type = allowedValues[propertiesJson['_type']];
						}
					}
					
					if(propertiesJson.Value){
						tempObservable.object.properties._properties.value.text = propertiesJson.Value['__text'];
					}
	
					if(propertiesJson.URL_Label && propertiesJson.URL_Label['__text']){
						tempObservable.object.properties._properties.url_label.text = propertiesJson.URL_Label['__text'];
					}
					break;
				case 'MutexObject':
					if(propertiesJson.Name){
						tempObservable.object.properties._properties.name.text = propertiesJson.Name['__text'];
					}
					break;
				case 'NetworkConnectionObject':
					if(propertiesJson.Destination_Socket_Address){
						if (propertiesJson.Destination_Socket_Address.IP_Address && propertiesJson.Destination_Socket_Address.IP_Address.Address_Value) {
							if (propertiesJson.Destination_Socket_Address.IP_Address.Address_Value['__text'].indexOf('##comma##') > 0) {
								var values = propertiesJson.Destination_Socket_Address.IP_Address.Address_Value['__text'].split('##comma##');
								for (i = 0; i < values.length; i++) {
									tempObservable.object.properties._properties.socketAddressObj.addressObj.address_value.placeholder = values[i];
									tempObservable.object.properties._properties.socketAddressObj.addressObj.address_value.add();
								}
							} else {
								tempObservable.object.properties._properties.socketAddressObj.addressObj.address_value.placeholder = propertiesJson.Destination_Socket_Address.IP_Address.Address_Value['__text'];
								tempObservable.object.properties._properties.socketAddressObj.addressObj.address_value.add();
							}
						}
						if (propertiesJson.Destination_Socket_Address.Port && propertiesJson.Destination_Socket_Address.Port.Port_Value) {
							tempObservable.object.properties._properties.socketAddressObj.portObj.port_value.text = propertiesJson.Destination_Socket_Address.Port.Port_Value['__text'];
						}
						if (propertiesJson.Destination_Socket_Address.Port && propertiesJson.Destination_Socket_Address.Port.Layer4_Protocol) {
							var allowedValues = arrayToDictionary('name',tempObservable.object.properties._properties.socketAddressObj.portObj.layer4_protocol.vocab.list);
							tempObservable.object.properties._properties.socketAddressObj.portObj.layer4_protocol.value = allowedValues[propertiesJson.Destination_Socket_Address.Port.Layer4_Protocol['__text']];
						}
					}
					break;
				case 'PortObject':
					if (propertiesJson.Port_Value) {
						tempObservable.object.properties._properties.port_value.text = propertiesJson.Port_Value['__text'];
					}
					if (propertiesJson.Layer4_Protocol) {
						var allowedValues = arrayToDictionary('name', tempObservable.object.properties._properties.layer4_protocol.vocab.list);
						tempObservable.object.properties._properties.layer4_protocol.value = allowedValues[propertiesJson.Layer4_Protocol['__text']];
					}
					break;
				case 'SocketAddressObject':
					if (propertiesJson.IP_Address && propertiesJson.IP_Address.Address_Value) {
						if (propertiesJson.IP_Address.Address_Value['__text'].indexOf('##comma##') > 0) {
							var values = propertiesJson.IP_Address.Address_Value['__text'].split('##comma##');
							for (i = 0; i < values.length; i++) {
								tempObservable.object.properties._properties.addressObj.address_value.placeholder = values[i];
								tempObservable.object.properties._properties.addressObj.address_value.add();
							}
						} else {
							tempObservable.object.properties._properties.addressObj.address_value.placeholder = propertiesJson.IP_Address.Address_Value['__text'];
							tempObservable.object.properties._properties.addressObj.address_value.add();
						}
					}
					if (propertiesJson.Port) {
						if (propertiesJson.Port.Port_Value) {
							tempObservable.object.properties._properties.portObj.port_value.text = propertiesJson.Port.Port_Value['__text'];
						}
						if (propertiesJson.Port.Layer4_Protocol) {
							var allowedValues = arrayToDictionary('name',tempObservable.object.properties._properties.portObj.layer4_protocol.vocab.list);
							tempObservable.object.properties._properties.portObj.layer4_protocol.value = allowedValues[propertiesJson.Port.Layer4_Protocol['__text']];								
						}
					}
					break;
				case 'URIObject':
					if (propertiesJson.Value) {
						var allowedValues = arrayToDictionary('name',tempObservable.object.properties._properties.type.vocab.list);
						if (allowedValues.hasOwnProperty(propertiesJson['_type'])) {
							tempObservable.object.properties._properties.type = allowedValues[propertiesJson['_type']];
						}
						if (propertiesJson.Value) {
							tempObservable.object.properties._properties.value.text = propertiesJson.Value['__text'];
						}
					}
					break;
				case 'WindowsRegistryKeyObject':
					if(propertiesJson.Hive){
						var allowedValues = arrayToDictionary('name',tempObservable.object.properties._properties.hive.vocab.list);
						tempObservable.object.properties._properties.hive.value = allowedValues[propertiesJson.Hive['__text']];
					}
					if(propertiesJson.Key){
						tempObservable.object.properties._properties.key.text = propertiesJson.Key['__text'];
					}
					if(propertiesJson.Values){
						if (!isArray(propertiesJson.Values.Value)) {
							if (propertiesJson.Values.Value.Name && propertiesJson.Values.Value.Data) {
								tempObservable.object.properties._properties.values.addValue({'name':propertiesJson.Values.Value.Name['__text'], 'data':propertiesJson.Values.Value.Data['__text']});
							}
						} else {
							for(var i = 0; i < propertiesJson.Values.Value.length; i++){
								if (propertiesJson.Values.Value[i].Name && propertiesJson.Values.Value[i].Data) {
									tempObservable.object.properties._properties.values.addValue({'name':propertiesJson.Values.Value[i].Name['__text'], 'data':propertiesJson.Values.Value[i].Data['__text']});
								}
							}
						}
					}
					break;
			}
		}
	}

	function importIndicator(indicatorjson, tempIndicator, stix, stixjson) {
		if (indicatorjson['_id']) {
			tempIndicator.id.value = indicatorjson['_id'];
		}
		if (indicatorjson.Type) {
			var allowedTypes = arrayToDictionary('name', tempIndicator['indicator_types'].vocab.list);
			if (isArray(indicatorjson.Type)) {
				for (var i = 0; i < indicatorjson.Type.length; i++) {
					if(indicatorjson.Type[i].hasOwnProperty('_xsi:type')){
						if(indicatorjson.Type[i]['_xsi:type'] == tempIndicator['indicator_types']['xsi:type'].value){
							if(tempIndicator['indicator_types'].vocab.multiple){
								tempIndicator['indicator_types'].items.push(allowedTypes[indicatorjson.Type[i]['__text']]);
							} else {
								tempIndicator['indicator_types'].value = allowedTypes[indicatorjson.Type[i]['__text']];
							}
						} else {
							console.log(indicatorjson.Type[i]['_xsi:type'] + ' xsi:type is not expected in ' + tempIndicator['indicator_types'].element);
						}
					} else {
						if(allowedTypes.hasOwnProperty(indicatorjson.Type[i])){
							if(tempIndicator['indicator_types'].vocab.multiple){
								tempIndicator['indicator_types'].items.push(allowedTypes[indicatorjson.Type[i]]);
							} else {
								tempIndicator['indicator_types'].value = allowedTypes[indicatorjson.Type[i].value];
							}
						} else {
							console.log(indicatorjson.Type[i] + ' is not an expected value in ' + tempIndicator['indicator_types'].element);
						}
					}
				}
			} else {
				if(indicatorjson.Type.hasOwnProperty('_xsi:type')){
					if(indicatorjson.Type['_xsi:type'] == tempIndicator['indicator_types']['xsi:type'].value){
						if(tempIndicator['indicator_types'].vocab.multiple){
							tempIndicator['indicator_types'].items.push(allowedTypes[indicatorjson.Type['__text']]);
						} else {
							tempIndicator['indicator_types'].value = allowedTypes[indicatorjson.Type['__text']];
						}
					} else {
						console.log(indicatorjson.Type['_xsi:type'] + ' xsi:type is not expected in ' + tempIndicator['indicator_types'].element);
					}
				}
			}
		}
		if (indicatorjson.Description) {
			tempIndicator.description.text = indicatorjson.Description['__text'];
		}
		if (indicatorjson.Observable) {
			tempIndicator.choice.setIndex(0);
			var tempObservable = stix.observables.childType();
			importObservable(stixjson, indicatorjson, tempIndicator, tempObservable, stix);

			tempIndicator.observable.object = tempObservable;
			stix.observables.add(tempObservable);
		}
		if (indicatorjson.Indicated_TTP){
			if (isArray(indicatorjson.Indicated_TTP)) {
				for (var i = 0; i < indicatorjson.Indicated_TTP.length; i++){				
					for (var j = 0; j < stix.ttps.children.length; j++){
						if (indicatorjson.Indicated_TTP[i].TTP['_idref'] == stix.ttps.children[j].id.value) {
							tempIndicator.indicated_ttps.updateRef(stix.ttps.children[j]);
						}
					}
				}
			} else {
				for (var i=0; i < stix.ttps.children.length; i++) {
					if (indicatorjson.Indicated_TTP.TTP['_idref'] == stix.ttps.children[i].id.value) {
						tempIndicator.indicated_ttps.updateRef(stix.ttps.children[i]);
					}
				}
			}
		}
		if (indicatorjson.Kill_Chain_Phases){
			var allowedValues = arrayToDictionary('name',tempIndicator.kill_chain_phases.kill_chain_phase.extBase.vocab.list);
			if(indicatorjson.Kill_Chain_Phases.Kill_Chain_Phase.hasOwnProperty('_name') && allowedValues.hasOwnProperty(indicatorjson.Kill_Chain_Phases.Kill_Chain_Phase['_name'])){
				tempIndicator.kill_chain_phases.kill_chain_phase.extBase.value = allowedValues[indicatorjson.Kill_Chain_Phases.Kill_Chain_Phase['_name']];
			}
		}
		if (indicatorjson.Suggested_COAs && indicatorjson.Suggested_COAs.Suggested_COA){
			if (isArray(indicatorjson.Suggested_COAs.Suggested_COA)) {
				for (var i = 0; i < indicatorjson.Suggested_COAs.Suggested_COA.length; i++){				
					for (var j = 0; j < stix.coas.children.length; j++){
						if (indicatorjson.Suggested_COAs.Suggested_COA[i].Course_Of_Action['_idref'] == stix.coas.children[j].id.value) {
							tempIndicator.suggested_coas.updateRef(stix.coas.children[j]);
						}
					}
				}
			} else {
				for (var i=0; i < stix.coas.children.length; i++) {
					if (indicatorjson.Suggested_COAs.Suggested_COA.Course_Of_Action['_idref'] == stix.coas.children[i].id.value) {
						tempIndicator.suggested_coas.updateRef(stix.coas.children[i]);
					}
				}
			}
		}
		if (indicatorjson.Sightings){
			if (isArray(indicatorjson.Sightings.Sighting)) {
				for (var i = 0; i < indicatorjson.Sightings.Sighting.length; i++) {
					tempIndicator['sightings'].addSighting(indicatorjson.Sightings.Sighting[i]['_timestamp']);
				}
			} else {
				tempIndicator['sightings'].addSighting(indicatorjson.Sightings.Sighting['_timestamp']);
			}
		}

		stix.indicators.add(tempIndicator);
	}

	function cybox_attrUpload(propertiesJson, tempProperties){
		if(isObject(propertiesJson)){
			if(propertiesJson.hasOwnProperty('__text')){
				delete propertiesJson.Value;
			}
			for(key in propertiesJson){
				if(tempProperties.hasOwnProperty(key.substring(1))){
					propertiesJson[key] = propertiesJson[key].toString();
					console.log("properties attribute that needs to be imported: " + propertiesJson[key]);
				}
			}
		}
	}

	function linkReferencedObject(indicatorId, objectId, type) {
 		for(var i = 0; i < stix.indicators.children.length; i++){
			if (stix.indicators.children[i].id.value == indicatorId) {
				for(var j = 0; j < stix.observables.children.length; j++){
					if (stix.observables.children[j].object.id.value == objectId) {
						if (type === 'attachment') {
							stix.indicators.children[i].observable.object.object.properties._properties.attachments.updateRef(stix.observables.children[j].object);
						} else if (type === 'link') {
							stix.indicators.children[i].observable.object.object.properties._properties.links.updateRef(stix.observables.children[j].object);
						}
					}							
				}
			}
		}
 	}

	var importXML = function(stixjson, stix){
		var errorMessages = [];
		try {
			if (stixjson.STIX_Package.STIX_Header) {
				importHeader(stixjson.STIX_Package.STIX_Header, stix);
			}
			if (stixjson.STIX_Package.Courses_Of_Action && stixjson.STIX_Package.Courses_Of_Action.Course_Of_Action) {
				if (isArray(stixjson.STIX_Package.Courses_Of_Action.Course_Of_Action)) {
					for (var i = 0; i < stixjson.STIX_Package.Courses_Of_Action.Course_Of_Action.length; i++){
						var tempCOA = stix.coas.childType();
						importCOA(stixjson.STIX_Package.Courses_Of_Action.Course_Of_Action[i], tempCOA, stix);
					}
				} else {
					var tempCOA = stix.coas.childType();
					importCOA(stixjson.STIX_Package.Courses_Of_Action.Course_Of_Action, tempCOA, stix);
				}
			}
			if (stixjson.STIX_Package.Exploit_Targets && stixjson.STIX_Package.Exploit_Targets.Exploit_Target) {
				if (isArray(stixjson.STIX_Package.Exploit_Targets.Exploit_Target)) {
					for (var i = 0; i < stixjson.STIX_Package.Exploit_Targets.Exploit_Target.length; i++){
						var tempET = stix.ets.childType();
						importExploitTarget(stixjson.STIX_Package.Exploit_Targets.Exploit_Target[i], tempET, stix);
					}
				} else {
					var tempET = stix.ets.childType();
					importExploitTarget(stixjson.STIX_Package.Exploit_Targets.Exploit_Target, tempET, stix);
				}
			}
			if (stixjson.STIX_Package.TTPs && stixjson.STIX_Package.TTPs.TTP) {
				if (isArray(stixjson.STIX_Package.TTPs.TTP)) {
					for (var i = 0; i < stixjson.STIX_Package.TTPs.TTP.length; i++){
						var tempTTP = stix.ttps.childType();
						importTTP(stixjson.STIX_Package.TTPs.TTP[i], tempTTP, stix);
					}
				} else {
					var tempTTP = stix.ttps.childType();
					importTTP(stixjson.STIX_Package.TTPs.TTP, tempTTP, stix);
				}
			}
			if (stixjson.STIX_Package.Indicators && stixjson.STIX_Package.Indicators.Indicator) {
				if (isArray(stixjson.STIX_Package.Indicators.Indicator)) {
					for (var i = 0; i < stixjson.STIX_Package.Indicators.Indicator.length; i++){
						try {
							var tempIndicator = stix.indicators.childType();
							importIndicator(stixjson.STIX_Package.Indicators.Indicator[i], tempIndicator, stix, stixjson);
						} catch (error) {
							errorMessages.push({type: 'danger', msg: error.name + ": " + error.message});
							console.log(error.stack);
						}
					}
				} else {
					try {
						var tempIndicator = stix.indicators.childType();
						importIndicator(stixjson.STIX_Package.Indicators.Indicator, tempIndicator, stix, stixjson);
					} catch (error) {
						errorMessages.push({type: 'danger', msg: error.name + ": " + error.message});
						console.log(error.stack);
					}
				}
				for (var id in observableReferences.attachments){
					try {
						var realIndicatorId = id.substring(id.indexOf("-")+1);
						linkReferencedObject(realIndicatorId, observableReferences.attachments[id], 'attachment');
					} catch (error) {
						errorMessages.push({type: 'danger', msg: error.name + ": " + error.message});
						console.log(error.stack);
					}
				}
				for (var id in observableReferences.links){
					try {
						var realIndicatorId = id.substring(id.indexOf("-")+1);
						linkReferencedObject(realIndicatorId, observableReferences.links[id], 'link');
					} catch (error) {
						errorMessages.push({type: 'danger', msg: error.name + ": " + error.message});
						console.log(error.stack);
					}
				}
			}
		} catch (error) {
			errorMessages.push({type: 'danger', msg: error.name + ": " + error.message});
			console.log(error.stack);
		};

		return errorMessages; 
	};
	
	return {
		importXML: importXML
	};	

}]);