import Ember from 'ember';

export default Ember.Component.extend({
	authenticate: Ember.inject.service('authentication'),
	openDropDown: '',
	router: Ember.inject.service('-routing'),

	actions: {
		toggleDropDown() {
			if (this.get('openDropDown') === '') {
				this.set('openDropDown', 'open');
			} else {
				this.set('openDropDown', '');
			}
		},

		logout() {
	        this.get('authenticate').logout();
	        this.get('router').transitionTo('login');
	    }
	},
});
