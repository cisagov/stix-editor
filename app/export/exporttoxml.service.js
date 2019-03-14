angular.module('app.exports')
.service('exportToXML',['$http','utils',function($http,utils){
	function json2xml(json,xml,prefixtext,namespace) {
		if (json.text == 'Invalid Date') {
		delete json.text; 	
		}
		if(json.text){
			xml.writeStartElement(json.element);
			checkNamespace(json.element,namespace);
			xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
			if(json.date){
				if(json.text.toISOString && typeof(json.text.toISOString) === 'function'){
					json.text = json.text.toISOString();
				}
				xml.writeString(escapeXML(json.text));
			} else {
				xml.writeString(escapeXML(json.text));
			}
			xml.writeEndElement();
		} else if (json.items) {
			if(json.items.length > 0){
				delimiterIndex = getIndexInObjArrayByName("delimiter",json.attributes);
				if(delimiterIndex !== false){
					delimitedString = '';
					for(var itemIndex in json.items){
						delimitedString += json.items[itemIndex].name;
						if(itemIndex < json.items.length-1){
							delimitedString +=json.attributes[delimiterIndex].value;
						}
					}
					xml.writeStartElement(json.element);
					checkNamespace(json.element,namespace);
					xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
					xml.writeString(escapeXML(delimitedString));
					xml.writeEndElement();
				} else {
					for(var itemIndex in json.items){
						if(json.element){
							xml.writeStartElement(json.element);
							checkNamespace(json.element,namespace);
							xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
							xml.writeString(escapeXML(json.items[itemIndex].name));
							xml.writeEndElement();
						}	else {
							xml = json2xml(json.items[itemIndex],xml,prefixtext,namespace);
						}
					}
				}
			}
		} else if (json.children) {
			if (json.killchainslist) {
				xml.writeStartElement(json.element);
				checkNamespace(json.element,namespace);
				xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
				if(json.children.length > 0){
					if(!(json.children[0].items && json.children[0].items.length == 0)){
						for(var childIndex = 0; childIndex < json.children.length; childIndex++){
							xml = json2xml(json.children[childIndex],xml,prefixtext,namespace);
						}
					}
				}
				for(var childIndex = 0; childIndex < json.killchainslist.length; childIndex++){
					xml = json2xml(json.killchainslist[childIndex],xml,prefixtext,namespace);
				}
				xml.writeEndElement();
			} else if(json.children.length > 0) {
				if(json.element && (json.element === "ttp:Intended_Effect" || json.element === "threat_actor:Motivation" || json.element === "incident:Intended_Effect" || json.element === "campaign:Intended_Effect")){
					if(!(json.children[0].items && json.children[0].items.length == 0)){
						for(var valueIndex = 0; valueIndex < json.children["0"].value.length; valueIndex++){
							xml.writeStartElement(json.element);
							checkNamespace(json.element,namespace);
							xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
							
							xml.writeStartElement(json.children["0"].element);
							checkNamespace(json.children["0"].element,namespace);
							xml = jsonAttributes2xml(json.children["0"],xml,prefixtext,namespace);

							xml.writeString(escapeXML(json.children["0"].value[valueIndex].name));
							xml.writeEndElement();
							
							xml.writeEndElement();
						}
					}
				} else {
					if(json.element){
						// if Kill_Chain_Phase is not provided don't write Kill_Chain_Phases XML structure
						if(json.element.split(":")[1] == 'Kill_Chain_Phases' && !json.children[0].attributes[utils.find('name',json.children[0].attributes)].value){
							return xml;
						} else {
							xml.writeStartElement(json.element);
							checkNamespace(json.element,namespace);
							xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
						}
					}
					for(var childIndex = 0; childIndex < json.children.length; childIndex++){
							xml = json2xml(json.children[childIndex],xml,prefixtext,namespace);
					}
					if(json.element){
						xml.writeEndElement();
					}
				}
			}
		} else if(json.value && json.hasOwnProperty('vocab')){
			xml.writeStartElement(json.element);
			checkNamespace(json.element,namespace);
			xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
			xml.writeString(escapeXML(json.value.name));
			xml.writeEndElement();
		} else if(json.attributes){
			if(!json.vocab){
				xml.writeStartElement(json.element);
				checkNamespace(json.element,namespace);
				xml = jsonAttributes2xml(json,xml,prefixtext,namespace);
				xml.writeEndElement();
			}
		} else if(json.choice){
			if (json.choiceIndex >= 0 && json.choiceIndex <= json.choice.length-1 && json.choice[json.choiceIndex].children){
				console.log("CHOICE Children");console.log(json);
				xml = json2xml(json.choice[json.choiceIndex],xml,prefixtext,namespace);
			} else if (typeof(json.choiceIndex) === 'number' && json.choiceIndex >= 0 && json.choiceIndex <= json.choice.length-1){
				console.log("CHOICE Option");console.log(json);
				xml = json2xml(json.choice[json.choiceIndex],xml,prefixtext,namespace);
			}
		} else if(json.ref){
			if(json.prefix == 'indicator'){
				json.object.element = json.ref.element;
				xml = json2xml(json.object,xml,prefixtext,namespace);
			} else {
				xml = json2xml(json.ref,xml,prefixtext,namespace);
			}
		} else if(angular.isArray(json)){
			for (var childIndex in json){
				xml = json2xml(json[childIndex],xml,prefixtext,namespace);
			}
		} else {
			console.log('how do write this:',json);
		}
		return xml;
	}

	function jsonAttributes2xml(json,xml,prefixtext,namespace){
		if(json.attributes){
			for(var attrIndex in json.attributes){
				if(typeof(json.attributes[attrIndex].value) === 'string'){
					if(['id','idref','object_reference'].indexOf(json.attributes[attrIndex].name) >= 0){
						var guidIdString = '';
						if(json.attributes[attrIndex].value.indexOf(':') >= 0){
							guidIdString = json.attributes[attrIndex].value;
						} else {
							guidIdString = prefixtext + ':' + json.attributes[attrIndex].value;
						}
						xml.writeAttributeString(json.attributes[attrIndex].name,guidIdString);
					} else {
						xml.writeAttributeString(json.attributes[attrIndex].name,json.attributes[attrIndex].value);
					}
				} else if (typeof(json.attributes[attrIndex].value) === 'object'){
					if(json.attributes[attrIndex].date){
						xml.writeAttributeString(json.attributes[attrIndex].name,json.attributes[attrIndex].value.toISOString());
					}	else{
						xml.writeAttributeString(json.attributes[attrIndex].name,json.attributes[attrIndex].value.name);
					}
				}
				if(json.attributes[attrIndex].name == 'xsi:type'){
					checkNamespace(json.attributes[attrIndex].value,namespace);
				}
			}
		}
		return xml;
	}

	function checkNamespace(ns,namespace){
		if (typeof(ns) !== "undefined"){
			ns = ns.substr(0,ns.indexOf(":"));
			if(namespace.hasOwnProperty(ns)){
				tempNS[ns] = true;
			} else {
				alert ('NOT in NS: ' + ns);
				ns = ns.replace("_","-").substr(0,ns.indexOf(":"));
				if(namespace.hasOwnProperty(ns)){
					tempNS[ns] = true;
				} else {
					alert ('Invalid NS: ' + ns);
				}
			}
		}
	}

	function getIndexInObjArrayByName(find,objArray){
		for(var obj in objArray){
			for(var key in obj){
				if(objArray[obj].name == find){
					return obj;
				}
			}
		}
		return false;
	}

	function escapeXML(xmlString){
		return xmlString.toString().replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}
	var tempNS = {};

	function createXML(stix,exportOptions,namespace,prefixtext,schematext){
		var attributes = [];
		var xml = new XMLWriter('UTF-8');
		xml.formatting = 'indented';//add indentation and newlines
		xml.indentChar = ' ';//indent with spaces
		xml.indentation = 2;//add 2 spaces per level
		xml.writeStartDocument();
		xml.writeStartElement(stix.name,'stix');
		xml = json2xml(stix.children,xml,prefixtext,namespace);
		xml.writeAttributeString("\nxmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
		schemaLoc = "\n";
		for(var ns in tempNS){
			try{
				xml.writeAttributeString('\nxmlns:'+ns,namespace[ns].uri);
				if(namespace[ns].hasOwnProperty('schemaLoc')){
					schemaLoc+=namespace[ns].uri+' '+namespace[ns].schemaLoc+' \n';
				}
			}
			catch (e) {
				alert (ns);
			}
		}
		xml.writeAttributeString("\nxsi:schemaLocation",schemaLoc);
		xml.writeAttributeString("\nversion",'1.1.1');
		xml.writeAttributeString("\nxmlns:"+prefixtext,schematext);
		jsonAttributes2xml(stix,xml,prefixtext,namespace);
		xml.writeEndElement();
		xml.writeEndDocument();

		return xml.flush();
	}

	return {
		createXML: createXML
	};
}]);
