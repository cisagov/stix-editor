angular.module('guiServices')
.service('tool',['references',function(references){
	function tool (options){
		var tool = {};
		tool.name = "Tool";
		tool.element = "cyboxCommon:Tool";
		tool.tooltip = "The Tool field is optional and enables description of a single tool utilized for this cyber observation source.";
		tool.description = {name:"Description",element:"cyboxCommon:Description",text:"",tooltip:"This field contains general descriptive information for this tool."};
		tool.type = {
			name:"Type",
			element:"cyboxCommon:Type",
			tooltip:"This field contains the type of the tool leveraged.",
			attributes:[{name:"xsi:type",value:"cyboxVocabs:ToolTypeVocab-1.1"}],
			items:[],
			vocab:{multiple:true,list:[{name:"NIDS",description:"The NIDS value specifies a Network Intrusion Detection System tool."},
				{name:"NIPS",description:"The NIPS value specifies a Network Intrusion Protection System tool."},
				{name:"HIDS",description:"The HIDS value specifies a Host-based Intrusion Detection System tool."},
				{name:"HIPS",description:"The HIPS value specifies a Host-based Intrusion Protection System tool."},
				{name:"Firewall",description:"The Firewall value specifies a software or hardware firewall."},
				{name:"Router",description:"The Router value specifies a software or hardware router."},
				{name:"Proxy",description:"The Proxy value specifies a cyber observation made using a software or hardware network proxy."},
				{name:"Gateway",description:"The Gateway value specifies a cyber observation made using a software or hardware network gateway."},
				{name:"SNMP/MIBs",description:"The SNMP/MIBs value specifies a Simple Network Management Protocol or Management Information Base tool."},
				{name:"AV",description:"The AV value specifies Anti-Virus tools and/or software."},
				{name:"DBMS Monitor",description:"The DBMS value specifies a Database Management System monitor tool."},
				{name:"Vulnerability Scanner",description:"The Vulnerability Scanner value specifies a vulnerability scanner tool."},
				{name:"Configuration Scanner",description:"The Configuration Scanner value specifies a configuration scanner tool."},
				{name:"Asset Scanner",description:"The Asset Scanner value specifies an asset scanner tool."},
				{name:"SIM",description:"The SIM value specifies a Security Information Management tool."},
				{name:"SEM",description:"The SEM value specifies a Security Event Management tool."},
				{name:"Digital Forensics",description:"The Digital Forensics value specifies a digital forensics tool."},
				{name:"Static Malware Analysis",description:"The Static Malware Analysis value specifies a static malware Analysis tool."},
				{name:"Dynamic Malware Analysis",description:"The Dynamic Malware Analysis value specifies a dynamic malware Analysis tool."},
				{name:"System Configuration Management Tool",description:"The System Configuration Management value specifies a system configuration management tool."},
				{name:"Network Configuration Management Tool",description:"The Network Configuration Management value specifies a network configuration management tool."},
				{name:"Packet Capture and Analysis",description:"The Packet Capture and Analysis value specifies a packet capture and analysis tool."},
				{name:"Network Flow Capture and Analysis",description:"The Network Flow Capture and Analysis value specifies a network flow capture and analysis tool."},
				{name:"Intelligence Service Platform",description:"The Intelligence Service Platform value specifies an intelligence service platform tool."}
			]}
		};
		tool.vendor = {name:"Vendor", element:"cyboxCommon:Vendor", text:"",tooltip:"This field contains information identifying the vendor organization for this tool."};
		tool.version = {name:"Version", element:"cyboxCommon:Version", text:"",tooltip:"This field contains an appropriate version descriptor of this tool."};
		tool.children = [
		    {name:"Name",element:"cyboxCommon:Name",text:"",tooltip:"This field contains the name of the tool leveraged."},
			tool.type,	
			tool.description,
			//references.references('cybox'),
			tool.vendor,
			tool.version
		];
		
		if(typeof(options) !== 'undefined' && options.element){
			tool.element = options.element;
		}
		
		return tool;
	}
	return {tool:tool};
}]);