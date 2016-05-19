import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	bookmark: Ember.inject.service('service-bookmark'),
	filterByElementId: [],
	filterByType: '',
	filterByBookmarked: false,
	sortedRecipes: Ember.computed.sort('listRecipes', 'sortDefinition'),
  	sortBy: 'date', 
	reverseSort: true,
	refresh: false,
	sortDefinition: Ember.computed('sortBy', 'reverseSort', function() {
	  	let sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
	  	return [ `${this.get('sortBy')}:${sortOrder}` ];
	}),
	showPagination: Ember.computed('sortedRecipes', function() {
		return this.get('sortedRecipes').length > 10 ? true : false;
	}),
	showFilterType: Ember.computed('types', function() {
		return this.get('types').length > 0 ? true : false;
	}),
	showFilterElement: Ember.computed('elements', function() {
		return this.get('elements').length > 0 ? true : false;
	}),
	showFilterBookmarked: Ember.computed('bookmarks', 'refresh', function() {
		return this.get('bookmarks').nb > 0 ? true : false;
	}),
	filterBy: '',

	_queryChanged: Ember.observer('query', function() {
		Ember.run.debounce(this, function() {
			if (this.get('query').length > 1) {
				this.set('filterBy', this.get('query'));
			} else {
				this.set('filterBy', '');
			}
		}, 200);
	}),

	listRecipes: Ember.computed('recipes', 'filterByElementId.[]', 'filterByType', 'filterBy', 'filterByBookmarked', function(){
		let recipes = this.get('recipes');
		let elementId = this.get('filterByElementId');
		let type = this.get('filterByType');
		let filter = this.get('filterBy');
		let bookmarked = this.get('filterByBookmarked');
		let results = [];

		if (!Ember.isEmpty(filter)) {
		    recipes = recipes.filter(function(recipe){
		       	return recipe.get('name').toLowerCase().indexOf(filter) > -1;
		    });
		}

		if (Ember.isBlank(elementId) && Ember.isEmpty(type)  && !bookmarked) {
			return recipes;
		}

		// Filter on element
		if (!Ember.isBlank(elementId)) {
			recipes.forEach(function(recipe, index, recipes) {
				let tests = elementId.every(function(elem) {
					let test = recipe.get('element').findBy('_element._id', elem);
					return !Ember.isBlank(test);
				});

				if (tests) {
					results.pushObject(recipe);	
				}
			});
		}

		// Filter on type of recipes
		if (!Ember.isEmpty(type)) {
			if (!Ember.isEmpty(elementId)) {
				results.forEach(function(recipe, index, recipes) {
					if (recipe.get('type') !== type) {
						recipes.removeAt(index);
					}
				});
			} else {
				recipes.forEach(function(recipe) {
					if (recipe.get('type') === type) {
						results.pushObject(recipe);	
					}
				});
			}
		}

		// Filter on bookmarked recipes
		if (bookmarked) {
			if (!Ember.isEmpty(elementId) || !Ember.isEmpty(type)) {
				results.forEach(function(recipe, index, recipes) {
					if (recipe.get('bookmarked') !== bookmarked) {
						recipes.removeAt(index);
					}
				});
			} else {
				recipes.forEach(function(recipe) {
					if (recipe.get('bookmarked') === bookmarked) {
						results.pushObject(recipe);	
					}
				});
			}
		}

		return results;
	}),	

	elements: Ember.computed('listRecipes', function(){
		let recipes = this.get('listRecipes');
		let elements = [];

		if (!Ember.isEmpty(recipes)) {
			recipes.forEach(function(recipe) {
				recipe.get('element').forEach(function(elem) {
					if (!Ember.isEmpty(elem._element) && !Ember.isEmpty(elem._element.name)) {
					    let results = elements.findBy("id", elem._element._id);
					    if (results) {
					    	results.nb++;	
					    } else {
					    	elements.pushObject({
								id: elem._element._id,
								nb: 1,
								name: elem._element.name
							});	
					    }
					}
				});
			}, this);
		} else {
			elements = [];
		}

		return elements;
	}),

	types: Ember.computed('listRecipes', function(){
		let recipes = this.get('listRecipes');
		let types = [];

		if (!Ember.isEmpty(recipes)) {
			recipes.forEach(function(recipe) {
				if (!Ember.isEmpty(recipe.get('type'))) {
				    let results = types.findBy("name", recipe.get('type'));
				    if (results) {
				    	results.nb++;	
				    } else {
				    	types.pushObject({
				    		nb: 1,
							name: recipe.get('type')
						});	
				    }
				}
			});
		} else {
			types = [];
		}

		return types;
	}),

	bookmarks: Ember.computed('listRecipes', 'refresh', function(){
		let recipes = this.get('listRecipes');
		let bookmarks = {
			nb: 0
		};
		if (!Ember.isEmpty(recipes)) {
			recipes.forEach(function(recipe) {
				if (!Ember.isEmpty(recipe.get('bookmarked')) && recipe.get('bookmarked')) {
					bookmarks.nb++;	
				}
			});
		}

		return bookmarks;
	}),	

	actions: {
		filterByElementId(id) {
			if (!this.get('filterByElementId').contains(id)) {
				this.get('filterByElementId').pushObject(id);
			} else {
				this.get('filterByElementId').removeObject(id);
			}
		},

		filterByType(type) {
			if (!Ember.isEqual(this.get('filterByType'), type)) {
				this.set('filterByType', type);
			} else {
				this.set('filterByType', '');
			}
		},

		filterByBookmarked() {
			this.toggleProperty('filterByBookmarked');
		},		

		sortByField(field) {
			if (!Ember.isEqual(this.get('sortBy'), field)) {
				this.set('sortBy', field);
			} else {
				this.toggleProperty('reverseSort');
			}
		},

		sortByOrder() {
			this.toggleProperties('reverseSort');
		},

		erasedFilterByElement() {
			this.set('filterByElementId', '');
		},

		erasedFilterByType() {
			this.set('filterByType', '');
		},

		erasedFilterByBookmarked() {
			this.set('filterByBookmarked', false);
		},

		toggleBookmark(recipe) {
			this.get('bookmark').toggleBookmark(recipe);
			this.set('refresh', !this.get('refresh'));
		}
	}

});
