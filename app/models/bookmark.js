import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
	date: attr(),
	_recipe: attr()
});