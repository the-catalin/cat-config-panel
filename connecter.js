function connectComponentWithConfigPanel(componentName, styleObj, componentString, includes) {

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
		var returnString = '<style>\n';

		for (var selector in obj) {
			if (obj.hasOwnProperty(selector)) {
			
				returnString += '    ' + selector + ' {\n';
				for (var prop in obj[selector]) {
					if (obj[selector].hasOwnProperty(prop)) {
						returnString += '        ' + dashedLowercase(prop);
						returnString += ': ';
						returnString += obj[selector][prop];

						if (typeof obj[selector][prop] === 'number' &&
							prop !== 'fontWeight') {
							returnString += 'px';
						}
						if (prop === 'fontFamily' && googleFonts.indexOf(obj[selector][prop] !== -1)) {
							fontLink = '<link href="https://fonts.googleapis.com/css?family=' +
								obj[selector][prop].replace(' ','+') +
								(obj[selector].fontWeight ? ':' + obj[selector].fontWeight : '') +
								'" rel="stylesheet">\n\n';
						}
						// if (prop === 'width' || prop === 'height') {
						// 	returnString += ' !important';
						// }
						returnString += ';\n';
					}
				}
				returnString += '    }\n';

			}
		}

		return fontLink + returnString + '</style>\n';
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
		borderRadius: 0,
		fontFamily: 'Times New Roman',
		fontWeight: 400
	};

	configPanel.addEventListener('localDomLoaded', function() {

		controls = configPanel.getControls();

		//Populate the CSS properties with the default values first
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

		controls = configPanel.getControls();
		buildPublishString();
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

		buildPublishString();

	});


	/**
	 * Build Publish tab's string content
	 */
	function buildPublishString() {
		var s = '\n';

		s += '<html>\n<head>\n\n';

		s += includes;
		
		var tempStyleObj = {};
		forEach(controls, function(control) {
			if(control.cssProperty) {
				if (!tempStyleObj[control.cssProperty]) {
					tempStyleObj[control.cssProperty] = {};
				}
				if (control.value !== cssDefaults[control.name]) {
					tempStyleObj[control.cssProperty][control.name] = control.value;
				}
			}
		});
		
		s += buildCssFromObj(tempStyleObj) + '\n';


		s += '</head>\n<body>\n\n';

		var newComponentString = '', attributes = '';

		forEach(controls, function(control) {
			if(!control.cssProperty) {
				if (typeof(component.properties[control.name]) === 'object' &&
					component.properties[control.name].value !== control.value &&
					control.name[0] !== '_') {
					// console.log(component.properties[control.name], control.value);
					attributes += ' ' + dashedLowercase(control.name) + '="' + control.value + '"';
				}
			}
		});

		newComponentString = componentString.insert(componentString.indexOf('>'), attributes);

		s += newComponentString;

		s += '\n\n'+'</body>\n</html>';

		configPanel.setPublishHtml(s);

		// console.log(component.properties);

	}

	String.prototype.insert = function(start, newSubStr) {
    	return this.slice(0, start) + newSubStr + this.slice(start);
    };
}