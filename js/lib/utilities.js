"use strict";
var Util = (function(){
	function pad(text, length, padChar) {
		text = text.toString();
		padChar = padChar || "0";
		var lengthToPad = length - text.length;

		if (lengthToPad > 0) {
			for (var i = 0; i < lengthToPad; i++) {
				text = padChar + text;
			}
		}
		return text;
	}

	function numberAsHex(number){
		return pad(number.toString(16).toUpperCase(), 2);
	}

	function numberAsBin(number){
		return pad(number.toString(2).toUpperCase(), 8);
	}
	
	function numberAsAscii(number){
		return String.fromCharCode(number);
	}

	return {
		numberAsHex : numberAsHex,
		numberAsBin : numberAsBin,
		numberAsAscii : numberAsAscii,
		pad : pad
	};
})();
