import Ember from 'ember';

export default Ember.Service.extend({
	recipe: {
		type: '',
		ingredient: []
	},
	currentId: Ember.computed.alias('recipe.ingredient.length') + 1,

	clear() {
		this.set('recipe', {});
	},

	setType(recipe) {
		this.set('recipe.type', recipe);
		console.log(this.get('recipe'));
	},

	setIngredient(recipe) {
		let ingredient = {
			id: this.get('currentId'), 
			name: recipe
		};
		this.get('recipe.ingredient').addObject(ingredient);
		console.log(this.get('recipe'));
	},
});
