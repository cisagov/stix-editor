angular.module('cyboxServices',[])
.service('attrPatterns',['utils',function(utils){
	function attrPatterns(options){
		
		var attrPatterns = {};
		attrPatterns.condition = {name:'condition', value:{name:"Equals",description:'Specifies the equality or = condition.'},
			vocab:{list:[
				{name:"Equals",description:'Specifies the equality or = condition.'},
				{name:"DoesNotEqual",description:'Specifies the "does not equal" or != condition.'},
				{name:"Contains",description:'Specifies the "contains" condition.'},
				{name:"DoesNotContain",description:'Specifies the "does not contain" condition.'},
				{name:"StartsWith",description:'Specifies the "starts with" condition.'},
				{name:"EndsWith",description:'Specifies the "ends with" condition.'},
				{name:"GreaterThan",description:'Specifies the "greater than" condition.'},
				{name:"GreaterThanOrEqual",description:'Specifies the "greater than or equal to" condition.'},
				{name:"LessThan",description:'Specifies the "less than" condition.'},
				{name:"LessThanOrEqual",description:'Specifies the "less than or equal" condition.'},
				{name:"InclusiveBetween",description:'The pattern is met if the given value lies between the values indicated in the field value body, inclusive of the bounding values themselves. The field value body MUST contain at least 2 values to be valid. If the field value body contains more than 2 values, then only the greatest and least values are considered. (I.e., If the body contains "2,4,6", then an InclusiveBetween condition would be satisfied if the observed value fell between 2 and 6, inclusive. Since this is an inclusive range, an observed value of 2 or 6 would fit the pattern in this example.) As such, always treat the InclusiveBetween condition as applying to a single range for the purpose of evaluating the apply_condition attribute.'},
				{name:"ExclusiveBetween",description:'The pattern is met if the given value lies between the values indicated in the field value body, exclusive of the bounding values themselves. The field value body MUST contain at least 2 values to be valid. If the field value body contains more than 2 values, then only the greatest and least values are considered. (I.e., If the body contains "2,4,6", then an InclusiveBetween condition would be satisfied if the observed value fell between 2 and 6, exclusive. Since this is an exclusive range, an observed value of 2 or 6 would not fit the pattern in this example.) As such, always treat the ExclusiveBetween condition as applying to a single range for the purpose of evaluating the apply_condition attribute.'},
				{name:"FitsPattern",description:'Specifies the condition that a value fits a given pattern.'},
				{name:"BitwiseAnd",description:'Specifies the condition of bitwise AND. Specifically, when applying this pattern, a given value is bitwise-ANDed with the bit_mask attribute value (which must be present). If the result is identical to the value provided in the body of this field value, the pattern is considered fulfilled.'},
				{name:"BitwiseOr",description:'Specifies the condition of bitwise OR. Specifically, when applying this pattern, a given value is bitwise-ORed with the bit_mask attribute value (which must be present). If the result is identical to the value provided in the body of this field value, the pattern is considered fulfilled.'},
				{name:"BitwiseXor",description:'Specifies the condition of bitwise XOR. Specifically, when applying this pattern, a given value is bitwise-XORed with the bit_mask attribute value (which must be present). If the result is identical to the value provided in the body of this field value, the pattern is considered fulfilled.'}
			]}
		};
		attrPatterns.is_case_sensitive = {name:'is_case_sensitive',value:'false'};
		attrPatterns.apply_condition = {name:'apply_condition',value:{name:'ANY',description:'Indicates that a pattern holds if the given condition can be successfully applied to any of the field values.'},
			vocab:{list:[
				{name:'ANY',description:'Indicates that a pattern holds if the given condition can be successfully applied to any of the field values.'},
				{name:'ALL',description:'Indicates that a pattern holds only if the given condition can be successfully applied to all of the field values.'},
				{name:'NONE',description:'Indicates that a pattern holds only if the given condition can be successfully applied to none of the field values.'}
			]}
		};
		attrPatterns.delimiter = {name:'delimiter', value:'##comma##'};
		
		var attributes = [];
		for(key in attrPatterns){
			// handle passed defaults (options)
			if(typeof(options) !== 'undefined' && options.hasOwnProperty(key)){
				if(attrPatterns[key].hasOwnProperty('vocab')){
					vocabValues = utils.objArrayToDict(attrPatterns.vocab.list);
					if(vocabValues.hasOwnProperty(options[key])){
						attrPatterns[key].value = vocabValues[options[key]];
					}
				}
				else{
					attrPatterns[key].value = options[key];
				}
			}
			
			attributes.push(attrPatterns[key]);
		}

		return attrPatterns;
	}
	
	return {attrPatterns:attrPatterns};
}])

.service('cyboxCommon',['attrPatterns','utils',function(attrPatterns,utils){
	var prefix ='cyboxCommon';
	
	function hash(options){
		var hash = {};
		hash.name = 'Hash';
		hash.element = 'cyboxCommon:Hash';
		hash.tooltip = "The HashType type is intended to characterize hash values.";
		hash.type = {
			name:'Type',
			element:'cyboxCommon:Type',
			parent:'Hash',
			tooltip:"The Type field utilizes a standardized controlled vocabulary to capture the type of hash used in the Simple_Hash_Value or Fuzzy_Hash_Value elements.",
			attributes:[{name:'xsi:type',value:'cyboxVocabs:HashNameVocab-1.0'}],
			value:'',
			setAttributes: function(options){
				temp = attrPatterns.attrPatterns(options);
				for(key in temp){
					this[key] = temp[key];
					this.attributes.push(this[key]);
				}
			},
			vocab:{list:[
				{name:'MD5',description:'The MD5 value specifies the MD5 hashing algorithm.'},
				{name:'MD6',description:'The MD6 value specifies the MD6 hashing algorithm.'},
				{name:'SHA1',description:'The SHA1 value specifies the SHA1 hashing algorithm.'},
				{name:'SHA224',description:'The SHA24 value specifies the SHA224 hashing algorithm.'},
				{name:'SHA256',description:'The SHA256 value specifies the SHA256 hashing algorithm.'},
				{name:'SHA384',description:'The SHA384 value specifies the SHA384 hashing algorithm.'},
				{name:'SHA512',description:'The SHA512 value specifies the SHA512 hashing algorithm.'},
				{name:'SSDEEP',description:'The SSDEEP value specifies the SSDEEP hashing algorithm.'}
			]}
		};
		hash.type.setAttributes();
		hash.simple_hash_value = {
			name:'Simple_Hash_Value',
			element:'cyboxCommon:Simple_Hash_Value',
			parent:'Hash',
			text:'',
			tooltip:"The Simple_Hash_Value field specifies a single result value of a basic cryptograhic hash function outputting a single hexbinary hash value.",
			attributes:[],
			setAttributes: function(options){
				temp = attrPatterns.attrPatterns(options);
				for(key in temp){
					this[key] = temp[key];
					this.attributes.push(this[key]);
				}
			}
		};
		
		if(typeof(options) !== 'undefined'){
			if(options.type){
				vocabValues = utils.objArrayToDict(hash.type.vocab.list);
				if(vocabValues.hasOwnProperty(options.type)){
					hash.type.value = vocabValues[options.type];
				}
			}
			if(options.simple){
				hash.simple_hash_value.text = options.simple;
			}
		}
		
		hash.simple_hash_value.setAttributes();
		hash.children = [
			hash.type,
			hash.simple_hash_value
		];

		return hash;
	}
	
	return{
		hash:hash
	}
	
}]);