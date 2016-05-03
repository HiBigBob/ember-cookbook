import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'tr',

	actions: {
		addQuantity() {
			this.get('add')(this.get('item'), this.get('quantity'));
		},
	}
});
