angular.module('app.observables')
.service('properties',['attrPatterns','cyboxCommon','utils','reference',function(attrPatterns,cyboxCommon,utils,reference){
	function addressObj(){
		var addressObj = {};
		addressObj.tooltip = 'The Address object is intended to specify a cyber address.';
		addressObj['xsi:type'] = {name:'xsi:type',value:'AddressObj:AddressObjectType'};
		addressObj.category = {
			name:'category',
			value:{name:'ipv4-addr', description:'The IPV4-addr value specifies an IPV4 address.'},
			vocab:{list:[
				{name:'asn',description:'The asn value specifies an identifier for an Autonomous System Number.'},
				{name:'atm',description:'The atm value specifies an Asynchronous Transfer Mode address.'},
				{name:'cidr',description:'The CIDR value specifies an address in Classless Inter-domain Routing notation (the IP address and its associated routing prefix).'},
				{name:'e-mail',description:'The e-mail value specifies an e-mail address.'},
				{name:'mac',description:"The mac value specifies a system's MAC address."},
				{name:'ipv4-addr',description:'The IPV4-addr value specifies an IPV4 address.'},
				{name:'ipv4-net',description:'NO DESCRIPTION GIVEN'},
				{name:'ipv4-net-mask',description:'The IPV4-net-mask value specifies an IPV4 bitwise netmask.'},
				{name:'ipv6-addr',description:'The IPV6-addr value specifies an IPV6 address.'},
				{name:'ipv6-net',description:'NO DESCRIPTION GIVEN'},
				{name:'ipv6-net-mask',description:'The IPV6-net-mask value specifies an IPV6 bitwise netmask.'},
			]}
		};
		addressObj.attributes = [
			addressObj['xsi:type'],
			addressObj.category
		];
		addressObj.address_value = {
			name:'Address_Value',
			element:'AddressObj:Address_Value',
			parent:'Address Object',
			placeholder:'',
			tooltip:"The required Address_Value construct specifies the actual value of the address.",
			attributes:[],
			setAttributes: function(options){
				temp = attrPatterns.attrPatterns(options);
				for(key in temp){
					this[key] = temp[key];
					this.attributes.push(this[key]);
				}
			},
			items:[],
			add:function(){
				this.items.push({name:this.placeholder});
				this.placeholder='';
				},
			del:function(index){this.items.splice(index,1);}
		};
		addressObj.address_value.setAttributes();
		addressObj.children = [
			addressObj.address_value
		];
		return addressObj;
	}
	
	function domainObj(){
		var domainObj = {};
		domainObj.tooltip = 'The Domain_Name object is intended to characterize network domain names.';
		domainObj['xsi:type'] = {name:'xsi:type',value:"DomainNameObj:DomainNameObjectType"};
		domainObj.type = {
			name:'type',
			value:{name:"FQDN",description:'Specifies a fully qualified domain name (FQDN), e.g. "www.abcd.com".'},
			vocab:{list:[
				{name:"FQDN",description:'Specifies a fully qualified domain name (FQDN), e.g. "www.abcd.com".'},
				{name:"TLD",description:'Specifies a top-level domain (TLD) name, e.g. ".com" or ".org".'}
			]}
		};
		domainObj.attributes =[
			domainObj['xsi:type'],
			domainObj.type
		];
		domainObj.value = {
			name:'Value',
			element:'DomainNameObj:Value',
			parent:'Domain Name Object',
			placeholder:'',
			tooltip:"The Domain_Name object is intended to characterize network domain names.",
			attributes:[],
			setAttributes: function(options){
				temp = attrPatterns.attrPatterns(options);
				for(key in temp){
					this[key] = temp[key];
					this.attributes.push(this[key]);
				}
			},
			items:[],
			add:function(){this.items.push({name:this.placeholder});this.placeholder='';},
			del:function(index){this.items.splice(index,1);}
		};
		domainObj.value.setAttributes();
		domainObj.children = [
			domainObj.value
		];
		return domainObj;
	}
	
	function emailObj(){
		var emailObj = {};
		emailObj.tooltip = 'The Email_Message object is intended to characterize an individual email message.';
		emailObj['xsi:type'] = {name:'xsi:type',value:"EmailMessageObj:EmailMessageObjectType"};
		emailObj.attributes = [
			emailObj['xsi:type']
		];
		emailObj.header = {
			name:'Header',
			element:'EmailMessageObj:Header',
			tooltip:"The Header field specifies a variety of common headers that may be included in the email message.",
			from:{
				name:'From',
				element:'EmailMessageObj:From',
				tooltip:"The From field specifies the email address of the sender of the email message.",
				category:{name:'category',value:'e-mail'},
				addressObj:addressObj(),
				attributes:[],
				children:[]
				},
			subject:{
				name:'Subject',
				element:'EmailMessageObj:Subject',
				parent:'Email Message Object: Header',
				text:'',
				tooltip:"The Subject field specifies the subject (a brief summary of the message topic) of the email message.",
				attributes:attrPatterns.attrPatterns()
			},
			message_id:{
				name:'Message_ID',
				element:'EmailMessageObj:Message_ID',
				parent:'Email Message Object: Header',
				text:'',
				tooltip:"The Message_ID field specifies the automatically generated ID of the email message.",
				attributes:attrPatterns.attrPatterns()
			},
			sender:{name:'Sender',element:'EmailMessageObj:Sender',tooltip:"The Sender field specifies the email address of the sender who is acting on behalf of the author listed in the From: field.",
					children:addressObj().children
				},
			reply_to:{name:'Reply_To',element:'EmailMessageObj:Reply_To',tooltip:"The Reply_To field specifies the email address that should be used when replying to the email message.",
					children:addressObj().children
				},
			x_mailer:{
				name:'X_Mailer',
				element:'EmailMessageObj:X_Mailer',
				parent:'Email Message Object: Header',
				text:'',
				tooltip:"The X-Mailer field specifies the software used to send the email message. This field is non-standard.",
				attributes:attrPatterns.attrPatterns()
			},
			x_originating_ip:{name:'X_Originating_IP',element:'EmailMessageObj:X_Originating_IP',tooltip:"The X-Originating-IP field specifies the originating IP Address of the email sender, in terms of their connection to the mail server used to send the email message. This field is non-standard.",
					addressObj:addressObj(),
					children:[]
				},
			children:[]
		};
		emailObj.header.from.addressObj.address_value.parent = "Email Message Object: Header: From";
		emailObj.header.x_originating_ip.addressObj.address_value.parent='Email Message Object: Header: X Originating IP';
		
		emailObj.header.from.attributes.push(emailObj.header.from.category);
		//utils.objectConvertor(emailObj.header.from.addressObj.address_value,['placeholder','add','items','delimiter'],{'text':''});
		emailObj.header.from.children = emailObj.header.from.addressObj.children;
		//utils.objectConvertor(emailObj.header.x_originating_ip.addressObj.address_value,['placeholder','add','items','delimiter'],{'text':''});
		emailObj.header.x_originating_ip.children = emailObj.header.x_originating_ip.addressObj.children;
		emailObj.header.children.push(
			emailObj.header.from,
			emailObj.header.subject,
			emailObj.header.message_id,
		//	emailObj.header.sender,
		//	emailObj.header.reply_to,
			emailObj.header.x_mailer,
			emailObj.header.x_originating_ip
		);
		
		emailObj.raw_body = {name:'Raw_Body',element:'EmailMessageObj:Raw_Body',text:'',tooltip:"The Raw_Body field specifies the complete (raw) body of the email message.",
			attributes:[],
			setAttributes: function(options){
				temp = attrPatterns.attrPatterns(options);
				for(key in temp){
					this[key] = temp[key];
					this.attributes.push(this[key]);
				}
			}
		};
		emailObj.raw_body.setAttributes();
		
		emailObj.links = {name:'Links',element:'EmailMessageObj:Links',tooltip:'The Links field specifies any URL links contained within the email message. It imports and uses the CybOX LinkObjectType from the Link_Object to do so.',
			list:[],
			children:[],
			updateRef:reference.updateRef('Link'),
			cleanRef: reference.cleanRef()
		};
		emailObj.attachments = {name:'Attachments',element:'EmailMessageObj:Attachments',tooltip:'The Attachments field specifies any files that were attached to the email message. It imports and uses the CybOX FileObjectType from the File_Object to do so.',
			list:[],
			children:[],
			updateRef:reference.updateRef('File'),
			cleanRef:reference.cleanRef()
		};

		emailObj.children = [
			emailObj.header,
			emailObj.raw_body,
			emailObj.attachments,
			emailObj.links
		];
		return emailObj;
	}
	
	function fileObj(){
		var fileObj = {};
		fileObj.tooltip = 'The File object is intended to characterize a generic file.';
		fileObj['xsi:type'] = {name:'xsi:type',value:"FileObj:FileObjectType"};
		fileObj.attributes = [
			fileObj['xsi:type']
		];
		fileObj.file_name = {
			name:'File_Name',
			element:'FileObj:File_Name',
			parent:'File Object',
			text:'',
			attributes:attrPatterns.attrPatterns(),
			tooltip:'The File_Name field specifies the base name of the file (including an extension, if present).'
		};
		fileObj.file_path = {
			name:'File_Path',
			element:'FileObj:File_Path',
			parent:'File Object',
			text:'',
			attributes:attrPatterns.attrPatterns(),
			tooltip:'The File_Path field specifies the relative or fully-qualified path to the file, not including the path to the device where the file system containing the file resides. Whether the path is relative or fully-qualified can be specified via the \'fully_qualified\' attribute of this field. The File_Path field may include the name of the file; if so, it must not conflict with the File_Name field. If not, the File_Path field should contain the path of the directory containing the file, and should end with a terminating path separator("\" or "/").'
		};
		fileObj.file_extension = {
			name:'File_Extension',
			element:'FileObj:File_Extension',
			parent:'File Object',
			text:'',
			attributes:attrPatterns.attrPatterns(),
			tooltip:'The File_Extension field specifies the extension of the name of the file. The File_Extension field must not conflict with the ending of the File_Name field. The File_Extension field should not begin with a "." (period) character, but may contain a "." (period) character in the case of a compound file extension, such as "tar.gz".'
		};
		fileObj.hashes = {name:'Hashes',element:'FileObj:Hashes',
			children:[],
			tooltip:'The Hashes field specifies any hashes of the file.',
			addHash:function(options){
				this.children.push(cyboxCommon.hash(options));
			},
			delHash:function(index){this.children.splice(index,1);console.log(index);}
		};
		fileObj.size_in_bytes = {
			name:'Size_In_Bytes',
			element:'FileObj:Size_In_Bytes',
			parent:'File Object',
			text:'',
			pattern:/^\d+$/,
			validationtip:"Required format is one or more numbers (for example 21)",
			attributes:attrPatterns.attrPatterns(),
			tooltip:'The Size_In_Bytes field specifies the size of the file, in bytes.'
		};
		fileObj.children = [
			fileObj.file_name,
			fileObj.file_path,
			fileObj.file_extension,
			fileObj.size_in_bytes,
			fileObj.hashes
		];
		
		return fileObj;
	}
	
	function httpSessionObj(){
		var httpSessionObj = {};
		httpSessionObj.tooltip = 'The HTTP_Session object is intended to capture the HTTP requests and responses made on a single HTTP session.';
		httpSessionObj['xsi:type'] = {name:'xsi:type',value:'HTTPSessionObj:HTTPSessionObjectType'};
		httpSessionObj.attributes = [
			httpSessionObj['xsi:type']
		];
		httpSessionObj.user_agent = {
			name:'User_Agent',
			element:'HTTPSessionObj:User_Agent',
			parent:'HTTP Session Object: User Agent from within HTTP Request Response: HTTP Client Request: HTTP Request Header: Parsed Header',
			tooltip:'The User-Agent field specifies the HTTP Request User-Agent field, which defines the user agent string of the user agent.',
			text:''
		};
		httpSessionObj.children = [
			{name:'HTTP_Request_Response',element:'HTTPSessionObj:HTTP_Request_Response',tooltip:'The HTTPRequestResponseType captures a single HTTP request/response pair.',
				children:[
					{name:'HTTP_Client_Request',element:'HTTPSessionObj:HTTP_Client_Request',tooltip:'The HTTP_Client_Request field specifies the HTTP client request portion of a single HTTP request/response pair.',
						children:[
							{name:'HTTP_Request_Header',element:'HTTPSessionObj:HTTP_Request_Header',tooltip:'The HTTP_Request_Header field specifies all of the HTTP header fields that may be found in the HTTP client request.',
								children:[
									{name:'Parsed_Header',element:'HTTPSessionObj:Parsed_Header',tooltip:'The Parsed_Header field captures the HTTP request header as a set of parsed HTTP header fields.',
										children:[
											httpSessionObj.user_agent
										]
									}
								]
							}
						]
					}
				]
			
			}
		];
		return httpSessionObj;
	}
	
	function linkObj(){
		var linkObj = {};
		linkObj.tooltip = 'The Link Object is intended to characterize links, such as those on a webpage or in an e-mail message.';
		linkObj['xsi:type'] = {name:'xsi:type',value:'LinkObj:LinkObjectType'};
		linkObj.type = uriObj().type;
		linkObj.attributes = [linkObj['xsi:type'],linkObj.type];
		linkObj.url_label = {
			name:'URL_Label',
			element:'LinkObj:URL_Label',
			parent:"Link Object",
			text:'',
			tooltip:'The URL_Label field specifies the label of the link.'
		};
		linkObj.value = uriObj().value;
		linkObj.value.parent = "Link Object";
		linkObj.children = [linkObj.value,linkObj.url_label];
		
		return linkObj;
	}
	
	function mutexObj(){
		var mutexObj = {};
		mutexObj.tooltip = 'The Mutex object is intended to characterize generic mutual exclusion (mutex) objects.';
		mutexObj['xsi:type'] = {name:'xsi:type',value:'MutexObj:MutexObjectType'};
		mutexObj.attributes = [
			mutexObj['xsi:type']
		];
		mutexObj.name = {
			name:'Name',
			element:'MutexObj:Name',
			parent:'Mutex Object',
			text:'',
			tooltip:'The Name field specifies the name for a named mutex object.'
		};
		mutexObj.children = [mutexObj.name];
		
		return mutexObj;
	}
	
	function networkConnectionObj(){
		var networkConnectionObj = {};
		networkConnectionObj.tooltip = 'The Network_Connection object is intended to represent a single network connection.';
		networkConnectionObj['xsi:type'] = {name:'xsi:type',value:'NetworkConnectionObj:NetworkConnectionObjectType'};
		networkConnectionObj.attributes = [
			networkConnectionObj['xsi:type']
		];
		networkConnectionObj.socketAddressObj = socketAddressObj();
		networkConnectionObj.children = [{
			name:'Destination_Socket_Address',
			element:'NetworkConnectionObj:Destination_Socket_Address',
			tooltip:'The Destination_Socket_Address field specifies the destination socket address, consisting of an IP Address and port number, used in the connection.',
			children: networkConnectionObj.socketAddressObj.children
		}]
		networkConnectionObj.children[0].children[0].children[0].parent = "Network Connection Object: Destination Socket Address: IP Address";
		networkConnectionObj.children[0].children[1].children[0].parent = "Network Connection Object: Destination Socket Address: Port";
		networkConnectionObj.children[0].children[1].children[1].parent = "Network Connection Object: Destination Socket Address: Port";
		
		return networkConnectionObj;
	}
	
	function portObj(){
		var portObj = {};
		portObj.tooltip = 'The Port object is intended to characterize networking ports.';
		portObj['xsi:type'] = {name:'xsi:type',value:'PortObj:PortObjectType'};
		portObj.attributes = [
			portObj['xsi:type']
		];
		portObj.port_value = {
			name:'Port_Value',
			element:'PortObj:Port_Value',
			parent:'Port Object',
			text:'',
			pattern:/^\d+$/,
			validationtip:"Required format is one or more numbers (for example 23)",
			tooltip:'The required Port_Value field specifies the actual value of the port.'
		};
		portObj.layer4_protocol = {
			name:'Layer4_Protocol',
			element:'PortObj:Layer4_Protocol',
			parent:'Port Object',
			tooltip:'The Layer4_Protocol field specifies the Layer 4 Protocol (OSI Model) associated with the port.',
			vocab:{list:[
					{name:'AH'},
					{name:'DCCP'},
					{name:'ESP'},
					{name:'GRE'},
					{name:'IL'},
					{name:'SCTP'},
					{name:'Sinec H1'},
					{name:'SPX'},
					{name:'TCP'},
					{name:'UDP'}
				]
			}
		};

		portObj.children = [
			portObj.port_value,
			portObj.layer4_protocol	
		];
		
		return portObj;
	}
	
	function socketAddressObj(){
		var socketAddressObj = {};
		socketAddressObj.tooltip = 'The Socket_Address element is intended to characterize a single network socket address.';
		socketAddressObj['xsi:type'] = {name:'xsi:type',value:'SocketAddressObj:SocketAddressObjectType'};
		socketAddressObj.attributes = [
			socketAddressObj['xsi:type']
		];
		socketAddressObj.addressObj = addressObj();
		socketAddressObj.ip_address = {name:'IP_Address',element:'SocketAddressObj:IP_Address',tooltip:'The IP_Address field specifies the IP address component of the socket address.',
			children: socketAddressObj.addressObj.children
		};
		socketAddressObj.portObj = portObj();
		socketAddressObj.port = {name:'Port',element:'SocketAddressObj:Port',tooltip:'The Port field specifies the port number component of the socket connection.',
			children: socketAddressObj.portObj.children
		};

		//utils.objectConvertor(socketAddressObj.addressObj.address_value,['placeholder','add','items','delimiter'],{'text':''});
		socketAddressObj.children = [
			socketAddressObj.ip_address,
			socketAddressObj.port
		];
		
		socketAddressObj.addressObj.address_value.parent = "Socket Address Object: IP Address";
		socketAddressObj.portObj.port_value.parent = "Socket Address Object: Port";
		socketAddressObj.portObj.layer4_protocol.parent = "Socket Address Object: Port";
		
		return socketAddressObj;
	}
	
	function uriObj(){
		var uriObj = {};
		uriObj.tooltip ="The URI object is intended to characterize Uniform Resource Identifiers (URI's).";
		uriObj['xsi:type'] = {name:'xsi:type',value:'URIObj:URIObjectType'};
		uriObj.type = {name:'type',value:{name:'URL',description:'Specifies a URL type of URI.'},
			vocab:{list:[
				{name:'URL',description:'Specifies a URL type of URI.'},
				{name:'General URN',description:'Specifies a General URN type of URI'},
				{name:'Domain Name',description:'Specifies a Domain Name type of URI.'}
				]
			}
		};
		uriObj.attributes = [
			uriObj['xsi:type'],
			uriObj.type
		];
		uriObj.value = {
			name:'Value',
			element:'URIObj:Value',
			parent:'URI Object',
			text:'',
			tooltip:'The Value field specifies the value of the URI.'
		};
		uriObj.children = [
			uriObj.value
		];
		
		return uriObj;
	}
	
	function winRegistryKeyObj(){
		var winRegistryKeyObj = {};
		winRegistryKeyObj.tooltip = 'Windows_Registry_Key object characterizes windows registry objects, including Keys and Key/Value pairs. See also: http://msdn.microsoft.com/en-us/library/windows/desktop/ms724871(v=vs.85).aspx.';
		winRegistryKeyObj['xsi:type'] = {name:'xsi:type',value:'WinRegistryKeyObj:WindowsRegistryKeyObjectType'};
		winRegistryKeyObj.attributes = [
			winRegistryKeyObj['xsi:type']
		];
		winRegistryKeyObj.key = {
			name:'Key',
			element:'WinRegistryKeyObj:Key',
			parent:'Windows Registry Key Object',
			text:'',
			tooltip:'The Key field specifies the full key to the Windows registry object, not including the hive.'
		};
		winRegistryKeyObj.hive = {
			name:'Hive',
			element:'WinRegistryKeyObj:Hive',
			parent:'Windows Registry Key Object',
			tooltip:'The Hive field specifies the Windows registry hive to which the registry object belongs to.',
			vocab:{list:[
					{name:'HKEY_CLASSES_ROOT',description:'Registry entries subordinate to this key define types (or classes) of documents and the properties associated with those types. Shell and COM applications use the information stored under this key.'},
					{name:'HKEY_CURRENT_CONFIG',description:'Contains information about the current hardware profile of the local computer system. The information under HKEY_CURRENT_CONFIG describes only the differences between the current hardware configuration and the standard configuration.'},
					{name:'HKEY_CURRENT_USER',description:"Registry entries subordinate to this key define the preferences of the current user. These preferences include the settings of environment variables, data about program groups, colors, printers, network connections, and application preferences. This key makes it easier to establish the current user's settings; the key maps to the current user's branch in HKEY_USERS."},
					{name:'HKEY_LOCAL_MACHINE',description:'Registry entries subordinate to this key define the physical state of the computer, including data about the bus type, system memory, and installed hardware and software.'},
					{name:'HKEY_USERS',description:'Registry entries subordinate to this key define the default user configuration for new users on the local computer and the user configuration for the current user.'},
					{name:'HKEY_CURRENT_USER_LOCAL_SETTINGS',description:'Registry entries subordinate to this key define preferences of the current user that are local to the machine. These entries are not included in the per-user registry portion of a roaming user profile.'},
					{name:'HKEY_PERFORMANCE_DATA',description:'Registry entries subordinate to this key allow you to access performance data. The data is not actually stored in the registry; the registry functions cause the system to collect the data from its source.'},
					{name:'HKEY_PERFORMANCE_NLSTEXT',description:'Registry entries subordinate to this key reference the text strings that describe counters in the local language of the area in which the computer system is running. These entries are not available to Regedit.exe and Regedt32.exe.'},
					{name:'HKEY_PERFORMANCE_TEXT',description:'Registry entries subordinate to this key reference the text strings that describe counters in US English. These entries are not available to Regedit.exe and Regedt32.exe.'}
				]
			}
		};
		winRegistryKeyObj.values = {name:'Values',element:'WinRegistryKeyObj:Values',tooltip:'The Values field specifies the values (with their name/data pairs) held within the registry key.',
			children:[],
			addValue:function(options){
				var value = {};
				value.name = 'Value';
				value.element = 'WinRegistryKeyObj:Value';
				value.tooltip = 'The Value field specifies the value (with name/data pair) held within the registry key.';
				value.value_name = {name:'Name',element:'WinRegistryKeyObj:Name',tooltip:'The Name field specifies the name of the registry value. For specifying the default value in a registry key, an empty string should be used.',text:''};
				value.data = {name:'Data',element:'WinRegistryKeyObj:Data',tooltip:'The Data field specifies the data contained in the registry value.',text:''};
				value.children = [
					value.value_name,
					value.data
				];
				if(typeof(options) !== 'undefined'){
					if(typeof(options.name) !== 'undefined'){
						value.value_name.text = options.name;
					}
					if(typeof(options.data) !== 'undefined'){
						value.data.text = options.data;
					}
				}
				this.children.push(value);
			},
			delValue:function(index){this.children.splice(index,1);console.log(index);}
		};
		winRegistryKeyObj.children = [
			winRegistryKeyObj.key,
			winRegistryKeyObj.hive,
			winRegistryKeyObj.values
		];
		
		return winRegistryKeyObj;
	}
	
	function properties(){
		properties = {};
		properties.type = '';
		properties.name = "Properties";
		properties.tooltip = "The Object construct identifies and specificies the characteristics of a specific cyber-relevant object (e.g. a file, a registry key or a process).";
		properties.element = 'cybox:Properties';
		properties.types = {
			AddressObject:addressObj(),
			DomainNameObject:domainObj(),
			EmailMessageObject:emailObj(),
			FileObject:fileObj(),
			HTTPSessionObject:httpSessionObj(),
			LinkObject:linkObj(),
			MutexObject:mutexObj(),
			NetworkConnectionObject:networkConnectionObj(),
			PortObject:portObj(),
			SocketAddressObject:socketAddressObj(),
			URIObject:uriObj(),
			WindowsRegistryKeyObject:winRegistryKeyObj()
		};
		properties.change = function(type){
			if(typeof(this.types[type]) === 'undefined'){
				delete this.tooltip;
				delete this.attributes;
				delete this.children;
				delete this._properties;
				delete this.type;
			} else {
				temp = this.types[type];
				this.tooltip = temp.tooltip;
				this.attributes = temp.attributes;
				this.children = temp.children;
				this._properties = temp;
				this.type = type;
				delete temp;
			}
		};

		return properties;
	}
	return { properties:properties };
}]);