import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service(),
	routing: Ember.inject.service('-routing'),
	previousTransition: null,
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
			if (self.get("previousTransition")) {
				self.get("routing").transitionTo(self.get("previousTransition"));
				self.set("previousTransition", null);
			} else {
				self.get("routing").transitionTo("recipes.index");	
			}
		}).catch(function(reason) {
		  	console.log(reason);
		});
	},

	removeBookmark(recipe) {
		let bookmarks = this.get('store').peekAll('bookmark');
		let bookmark = bookmarks.findBy('_recipe._id', recipe.get('id'));
		bookmark.deleteRecord();
		bookmark.save();
	},

	toggleBookmark(recipe) {
		let model = this.get('store').peekRecord('recipe', recipe.get('id'));
		model.set('bookmarked', !model.get('bookmarked'));
		model.save();
		if (model.get('bookmarked')) {
			this.addBookmark(recipe);
		} else {
			this.removeBookmark(recipe);
		}
	}
});
