import Ember from 'ember';

export default Ember.Controller.extend({
	recipe: Ember.inject.service('recipe-item'),
	filterBy: '',
	query: null,
	description: '',

	_queryChanged: Ember.observer('query', function() {
		Ember.run.debounce(this, function() {
			if (this.get('query').length > 2) {
				this.set('filterBy', this.get('query'));
			} else {
				this.set('filterBy', '');
			}
		}, 200);
	}),

	results: Ember.computed('model', 'filterBy', function(){
		let filter = this.get('filterBy');
		let results = this.get('model.elements');

		if (!Ember.isEmpty(filter)) {
		    results = results.filter(function(element){
		       	return element.get('name').toLowerCase().indexOf(filter) > -1;
		    });
		} else {
			results = [];
		}

		return results;
	}),

	actions: {
		addElement(element) {
			this.set('query', '');
			let props = this.getProperties(['quantity']);
			this.setProperties({ quantity: '' });
		    this.get('recipe').setElement({
				id: element.get('id'),
				name: element.get('name'),
				quantity: props.quantity,
				measure: {
					id: element.get('measure._id'),
					name: element.get('measure.short_name')
				}
			});
		},
		updateType(value) {
		    this.get('recipe').setType(value);
		},		
		removeElement(id) {
			this.get('recipe').removeElementById(id);
		},
		pasteElement() {
			let string = this.getProperties('paste').paste;
			string = string.split("\n");
			let excludes = ['a','à', 'en', '-'];

			string.forEach(function(str) {
				let arrayTmp = str.split(' ');
				let arrayStrLine = [];
				let arrayIntLine = [];
				let arrayMeasure = [];
				let arrayElement = [];
				let obj = {
					quantity: null,
					measure: {},
					element: {}
				};

				// Get Integer and string array
				arrayTmp.forEach(function(elem) {
				    if (excludes.indexOf(elem.toLowerCase()) === -1) {
				    	if (Number.isInteger(parseInt(elem))) {
				    		arrayIntLine.push(elem);
				    	} else {
				    		arrayStrLine.push(elem);
				    	}
				    }
				});

				// Get measure
				arrayStrLine.forEach(function(string, index) {	
					this.get('model.measures').forEach(function(measure) {
						if (measure.get('short_name').toLowerCase().indexOf(string.toLowerCase()) !== -1) {	
							arrayMeasure.pushObject(measure);
							delete arrayStrLine[index];
						}
					});
				}, this);

				// Format other element
				if (arrayStrLine.length > 1) {
					arrayStrLine.push(arrayStrLine.join(" ").trim());
				}

				arrayStrLine.forEach(function(elem, index) {	
					if (elem.startsWith('de ')) {	
						arrayStrLine[index] = elem.replace(/\bde\b\s/i, '');
					}
				});	

				// Get element
				arrayStrLine.forEach(function(string) {	
					this.get('model.elements').forEach(function(element) {
						if (element.get('name').toLowerCase().endsWith(string.toLowerCase()) && element.get('name').toLowerCase().startsWith(string.toLowerCase())) {	
							if (arrayElement.indexOf(element.get('name')) < 0) {
								arrayElement.pushObject(element);		
							}
						} else if (!element.get('name').toLowerCase().includes(' ') && element.get('name').toLowerCase().includes(string.toLowerCase())) {	
							if (arrayElement.indexOf(element.get('name')) < 0) {
								arrayElement.pushObject(element);		
							}
						}
					});
				}, this);

				arrayIntLine.forEach(function(elem) {	
					obj.quantity = elem;
				});

				arrayMeasure.forEach(function(elem) {	
					obj.measure.id = elem.get('id');
					obj.measure.name = elem.get('name');
				});

				arrayElement.forEach(function(elem) {	
					obj.element.id = elem.get('id');
					obj.element.name = elem.get('name');
				});

				this.get('recipe').setElement({
					id: obj.element.id,
					name: obj.element.name,
					quantity: obj.quantity,
					measure: {
						id: obj.measure.id,
						name: obj.measure.name
					}
				});
			}, this);			
		},
		submit() {
		    this.transitionToRoute('recipes.add.detail');
		}
	}
});
