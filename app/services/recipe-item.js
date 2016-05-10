import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service(),
	routing: Ember.inject.service('-routing'),
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

      	let self = this;
		function transitionToList() {
		  self.get("routing").transitionTo("index");
		}
		function failure(reason) {
		  console.log(reason);
		}

		recipe.save().then(transitionToList).catch(failure);
	}
});
