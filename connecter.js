function connectComponentWithConfigPanel(componentName, componentString) {
				
	var demo, component;
	var el, i, options = [], controls,
		configPanel = document.querySelector('cat-config-panel');

	demo = document.createElement('div');
	demo.insertAdjacentHTML('afterbegin', componentString);
	component = demo.querySelector(componentName);
	document.body.insertBefore(demo, configPanel);

	// Populate Config Panel's controls with the initial property values of the component
	configPanel.onLocalDomLoaded(function() {
		for (var key in component.properties) {
			if (component.properties.hasOwnProperty(key)) {
				if (typeof(component.properties[key]) === 'object') {
					
					// console.log(key, component[key]);
					configPanel.setControlValue(key, component[key]);

				}
			}
		}
	});


	// For every value change on the Config Panel's controls, remove and create back the component,
	// giving it the new values from the Config Panel
	configPanel.addEventListener('controlChanged', function(e, v) {
		
		component.remove();
		demo.remove();
		demo = document.createElement('div');
		demo.insertAdjacentHTML('afterbegin', componentString);				
		component = demo.querySelector(componentName);

		controls = configPanel.getControls();
		controls.forEach(function(control) {
			component[control.name] = control.value;
		});
		
		document.body.insertBefore(demo, configPanel);
		
	});
}