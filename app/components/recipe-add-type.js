import Ember from 'ember';

export default Ember.Component.extend({
	isCheck: Ember.computed('active', 'value', function(){
		return this.get('active') === this.get('value');
	}),

	actions: {
		check() {
			this.toggleProperty('isCheck');
			this.get('onClick')(this.get('value'));
		}
	}
});
