import Ember from 'ember';

export function classifyElement(params/*, hash*/) {
	let quantity = params[0],
		measure = params[1],
		name = params[2];

	if (!Ember.isEmpty(measure)) {
		name = 'de ' + name;
	} else if (quantity	> 1 && quantity < 10) {
		name = name+ 's';
	}

	return `${quantity} ${measure} ${name}`;
}

export default Ember.Helper.helper(classifyElement);
