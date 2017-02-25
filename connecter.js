function connectComponentWithConfigPanel(componentName, componentString) {
				
	var demo, component;
	var el, i, options = [], controls,
		configPanel = document.querySelector('cat-config-panel');

	demo = document.createElement('div');
	demo.insertAdjacentHTML('afterbegin', componentString);
	component = demo.querySelector(componentName);
	document.body.insertBefore(demo, configPanel);

	// Populate Config Panel's controls with the initial property values of the component
	configPanel.addEventListener('localDomLoaded', function() {


		/*
		// This was used when I was having behaviors containing only properties (in order to have
		// property inheritance) 

		// The component.properties object does not contain the properties added through Polymer Behaviors
		// Because I'm using lists of properties inherited via behaviors, I'm adding below those properties
		// manually to component.properties object

		// if (component.behaviors) {
		// 	for (var i = 0, len = component.behaviors.length; i < len; i++) {
		// 		// if the behavior's object has only one property with the name of 'properties'
		// 		// then this is what we're looking for
		// 		if (Object.keys(component.behaviors[i]).length === 1 &&
		// 			component.behaviors[i].properties &&
		// 			Object.keys(component.behaviors[i].properties).length) {
		// 			for (var attrname in component.behaviors[i].properties) {
		// 				if (component.behaviors[i].properties.hasOwnProperty(attrname))
		// 				component.properties[attrname] = component.behaviors[i].properties[attrname];
		// 			}
		// 		}
		// 	}
		// }
		*/

		for (var key in component.properties) {
			if (component.properties.hasOwnProperty(key)) {
				if (typeof(component.properties[key]) === 'object') {
					
					configPanel.setControlValue(key, component[key]);

				}
			}
		}
	});


	// For every value change on the Config Panel's controls, remove and create back the component,
	// giving it the new values from the Config Panel
	configPanel.addEventListener('controlChanged', function(e, v) {
		
		// component.remove();
		// demo.remove();
		// in fact, IE hack:
		if (component.parentNode) component.parentNode.removeChild(component);
		if (demo.parentNode) demo.parentNode.removeChild(demo);
		
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