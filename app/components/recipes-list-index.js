import Ember from 'ember';

export default Ember.Component.extend({
	filterByElementId: '',
	filterByType: '',
	sortedRecipes: Ember.computed.sort('listRecipes', 'sortDefinition'),
  	sortBy: 'date', 
	reverseSort: true,
	sortDefinition: Ember.computed('sortBy', 'reverseSort', function() {
	  	let sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
	  	return [ `${this.get('sortBy')}:${sortOrder}` ];
	}),
	showPagination: Ember.computed('sortedRecipes', function() {
		return this.get('sortedRecipes').length > 10 ? true : false;
	}),
	filterBy: '',

	_queryChanged: Ember.observer('query', function() {
		Ember.run.debounce(this, function() {
			if (this.get('query').length > 2) {
				this.set('filterBy', this.get('query'));
			} else {
				this.set('filterBy', '');
			}
		}, 200);
	}),

	listRecipes: Ember.computed('recipes', 'filterByElementId', 'filterByType', 'filterBy', function(){
		let recipes = this.get('recipes');
		let elementId = this.get('filterByElementId');
		let type = this.get('filterByType');
		let filter = this.get('filterBy');		
		let results = [];

		if (Ember.isEmpty(elementId) && Ember.isEmpty(type)) {
			return recipes;
		}

		if (!Ember.isEmpty(filter)) {
		    recipes = recipes.filter(function(recipe){
		       	return recipe.get('name').toLowerCase().indexOf(filter) > -1;
		    });
		}

		if (!Ember.isEmpty(elementId)) {
			recipes.forEach(function(recipe, index, recipes) {
				recipe.get('element').forEach(function(elem) {
					if (!Ember.isEmpty(elem._element) && !Ember.isEmpty(elem._element.name)) {
						if (elem._element._id === elementId) {
							results.pushObject(recipes.objectAt(index));	
						}
					}
				});
			});
		}

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

	actions: {
		filterByElementId(id) {
			if (!Ember.isEqual(this.get('filterByElementId'), id)) {
				this.set('filterByElementId', id);
			} else {
				this.set('filterByElementId', '');
			}
		},

		filterByType(type) {
			if (!Ember.isEqual(this.get('filterByType'), type)) {
				this.set('filterByType', type);
			} else {
				this.set('filterByType', '');
			}
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
		}
	}

});
