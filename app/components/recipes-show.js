import Ember from 'ember';

export default Ember.Component.extend({
	bookmark: Ember.inject.service('service-bookmark'),
	router: Ember.inject.service('-routing'),

	actions: {
		toggleBookmark(recipe) {
			let current = this.get('router.currentPath');
			this.get('bookmark').set("previousTransition", current);
			this.get('bookmark').toggleBookmark(recipe);
		}
	}
});
