import Ember from 'ember';

export default Ember.Controller.extend({
	recipe: Ember.inject.service('recipe-item'),
	filterBy: '',
	query: null,

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
		let results = this.get('model');

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
			console.log(id)
			this.get('recipe').removeElementById(id);
		},
		submit() {
		    this.transitionToRoute('recipes.add.detail');
		}
	}
});
