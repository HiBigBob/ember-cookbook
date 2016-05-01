import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
    	return Ember.RSVP.hash({
			elements: this.store.findAll('element'),
			measures: this.store.findAll('measure')
		});
  	}
});
