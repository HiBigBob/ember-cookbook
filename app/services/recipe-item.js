import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service(),
	object: {
		name: '',
		done: '',
		minute: '',
		degree: '',
		score: '', 
		type: '',
		description: '',
		element: []
	},

	clear() {
		this.set('object', {});
	},

	setType(recipe) {
		this.set('object.type', recipe);
	},

	setElement(recipe) {
		this.get('object.element').pushObject(recipe);
	},

	removeElementById(id) {
		let element = this.get('object.element').findBy("id", id);
		this.get('object.element').removeObject(element);
	},

	submit() {
      	let recipe = this.get('store').createRecord('recipe', this.get('object'));

      	var self = this;
		function transitionToList() {
		  self.transitionToRoute('index');
		}
		function failure(reason) {
		  console.log(reason);
		}

		recipe.save().then(transitionToList).catch(failure);
	}
});
