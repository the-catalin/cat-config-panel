function connectComponentWithConfigPanel(componentName, styleObj, componentString) {

	function forEach(array, callback, scope) {
		for (var i = 0; i < array.length; i++) {
			callback.call(scope, array[i], i);
		}
	}

	function dashedLowercase(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}

	function buildCssFromObj(obj) {
		var googleFonts = ['Open Sans', 'Lato', 'Raleway', 'Roboto', "Oswald", "Roboto Condensed", "PT Sans", "Baloo", "Open Sans Condensed", "Indie Flower", "Abel"];
		var fontLink = '';
		var returnString = '<style>';

		for (var selector in obj) {
			if (obj.hasOwnProperty(selector)) {
			
				returnString += selector + '{';
				for (var prop in obj[selector]) {
					if (obj[selector].hasOwnProperty(prop)) {
						returnString += dashedLowercase(prop);
						returnString += ':';
						returnString += obj[selector][prop];

						if (typeof obj[selector][prop] === 'number' &&
							prop !== 'fontWeight') {
							returnString += 'px';
						}
						if (prop === 'fontFamily' && googleFonts.indexOf(obj[selector][prop] !== -1)) {
							fontLink = '<link href="https://fonts.googleapis.com/css?family=' +
								obj[selector][prop].replace(' ','+') +
								':' + (obj[selector].fontWeight ? obj[selector].fontWeight : '') +
								'" rel="stylesheet">';
						}
						if (prop === 'width' || prop === 'height') {
							returnString += ' !important';
						}
						returnString += ';';
					}
				}
				returnString += '}';

			}
		}

		return fontLink + returnString + '</style>';
	}

				
	var demo, component;
	var el, i, options = [], controls,
		configPanel = document.querySelector('cat-config-panel');

	var styleString = buildCssFromObj(styleObj);

	demo = document.createElement('div');
	demo.insertAdjacentHTML('afterbegin', componentString);
	demo.insertAdjacentHTML('afterbegin', styleString);
	component = demo.querySelector(componentName);
	document.body.insertBefore(demo, configPanel);


	var cssDefaults = {
		color: 'rgba(0,0,0,1)',
		borderColor: 'rgba(0,0,0,1)',
		backgroundColor: 'rgba(0,0,0,0)',
		borderStyle: 'none',
		borderWidth: 3,
		fontFamily: 'Times New Roman',
		fontWeight: 400
	};

	configPanel.addEventListener('localDomLoaded', function() {

		//Populate the CSS properties with the default values first
		controls = configPanel.getControls();
		forEach(controls, function(control) {
			if(control.cssProperty) {
				configPanel.setControlValue(control.name, cssDefaults[control.name]);
			}
		});

		//Populate CSS properties with the ones from styleObj
		for (var selector in styleObj) {
			if (styleObj.hasOwnProperty(selector)) {
				for (var prop in styleObj[selector]) {
					if (styleObj[selector].hasOwnProperty(prop)) {
						configPanel.setControlValue(prop, styleObj[selector][prop]);
					}
				}
			}
		}

		// Populate Config Panel's controls with the initial property values of the component
		for (var key in component.properties) {
			if (component.properties.hasOwnProperty(key)) {
				if (typeof(component.properties[key]) === 'object') {
					configPanel.setControlValue(key, component[key]);
				}
			}
		}


	});



	configPanel.addEventListener('controlChanged', function(e, v) {

		var styleObj = {};

		// For every value change on the Config Panel's controls, remove and create back the component,
		// giving it the new values from the Config Panel

		// component.remove();
		// demo.remove();
		// in fact, IE hack:
		if (component.parentNode) component.parentNode.removeChild(component);
		if (demo.parentNode) demo.parentNode.removeChild(demo);
		
		demo = document.createElement('div');
		demo.insertAdjacentHTML('afterbegin', componentString);				
		component = demo.querySelector(componentName);

		controls = configPanel.getControls();
		forEach(controls, function(control) {
			if(!control.cssProperty) {
				component[control.name] = control.value;
			} else {
				if (!styleObj[control.cssProperty]) {
					styleObj[control.cssProperty] = {};
				}
				styleObj[control.cssProperty][control.name] = control.value;
			}
		});
		
		var styleString = buildCssFromObj(styleObj);
		demo.insertAdjacentHTML('afterbegin', styleString);

		document.body.insertBefore(demo, configPanel);
			
		
	});
}