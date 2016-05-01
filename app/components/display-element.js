import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'tr',
	edit: false,

	actions: {
		editMode() {
			this.toggleProperty('edit');
		},
		remove() {
			this.get('onRemove')();
		}
	}
});
