import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel(transition) {
		if (!this.controllerFor('login').get('authenticate').get('userIsLoggedIn')) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
  			this.transitionTo('login');
		}
	},

	model(params) {
    	return this.store.findRecord('recipe', params.recipe_id);
  	}
});