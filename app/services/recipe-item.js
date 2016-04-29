import Ember from 'ember';

export default Ember.Service.extend({
	recipe: {
		name: '',
		done: '',
		minute: '',
		degree: '',
		score: '', 
		type: '',
		element: []
	},

	clear() {
		this.set('recipe', {});
	},

	setType(recipe) {
		console.log(this.get('recipe'));
		this.set('recipe.type', recipe);
	},

	setElement(recipe) {
		this.get('recipe.element').pushObject(recipe);
		console.log(this.get('recipe.element'));
	},

	removeElementById(id) {
		let element = this.get('recipe.element').findBy("id", id);
		this.get('recipe.element').removeObject(element);
	}
});
