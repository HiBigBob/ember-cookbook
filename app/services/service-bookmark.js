import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service(),
	routing: Ember.inject.service('-routing'),
	model: Ember.computed('store', function() {
		return this.get('store').findAll('bookmark');
	}),

	addBookmark(recipe) {
		let bookmark = this.get('store').createRecord('bookmark', {
			_recipe: {
				id: recipe.get('id'),
				name: recipe.get('name'),
				type: recipe.get('type'),
			}
		});

      	let self = this;
		bookmark.save().then(function() {
		  	self.get("routing").transitionTo("recipes.index");
		}).catch(function(reason) {
		  	console.log(reason);
		});
	}
});
