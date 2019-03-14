angular.module('guiServices')
.service('myTooltip', function() {
	
	var _tooltipsEnabled = "Disabled";
	
	this.setTooltips = function(tooltipsEnabled) {
		_tooltipsEnabled = tooltipsEnabled;
	}
	
	this.getTooltips = function() {
		return _tooltipsEnabled;
	}
	
	this.toggleTooltips = function() {
		if ( _tooltipsEnabled != "Enabled" ) {
			_tooltipsEnabled = "Enabled";
		} else {
			_tooltipsEnabled = "Disabled";
		}
		console.log("toggled to: " + _tooltipsEnabled);
	}
	
	this.focusTooltip = function(name, page_or_section, tooltip) {
		if ( _tooltipsEnabled == "Enabled" ) {
			document.getElementById(name + page_or_section + "_tooltip").style.display = 'block';
			console.log("Enable tooltip focus for: " + tooltip);
		}
	}

	this.blurTooltip = function(a, b) {
		document.getElementById(a + b + "_tooltip").style.display = 'none';
	}
});