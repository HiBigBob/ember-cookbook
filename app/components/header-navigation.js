import Ember from 'ember';

export default Ember.Component.extend({
	authenticate: Ember.inject.service('authentication'),
	openDropDownUser: '',
	openDropDownPin: '',
	router: Ember.inject.service('-routing'),
	bookmark: Ember.inject.service('service-bookmark'),

	actions: {
		toggleDropDownUser() {
			if (this.get('openDropDownUser') === '') {
				this.set('openDropDownUser', 'open');
			} else {
				this.set('openDropDownUser', '');
			}
		},

		toggleDropDownPin() {
			if (this.get('openDropDownPin') === '') {
				this.set('openDropDownPin', 'open');
			} else {
				this.set('openDropDownPin', '');
			}
		},

		logout() {
	        this.get('authenticate').logout();
	        this.get('router').transitionTo('login');
	    }
	},
});
