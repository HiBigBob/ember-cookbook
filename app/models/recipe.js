import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  	name: attr(),
	done: attr(),
	minute: attr(),
	baking: attr(),
	degree: attr(),
	score: attr(), 
	type: attr(),
	description: attr(),
	date: attr(),
	bookmarked: attr(),
	element: attr()
});