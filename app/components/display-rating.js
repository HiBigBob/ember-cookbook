import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
	classNames: ['rating'],

	lists: Ember.computed('rating', function(){
		let rating = this.get('rating').toString();
		let num = parseFloat(rating.replace(',', '.'));
		let total = Math.ceil(num);
		let entier = num | 0;
		let decimal = num % 1;
		let lists = [];

		for (let i = 1; i < entier + 1; i++) { 
		    lists.push('fa fa-star');
		}

		if (decimal !== 0) {
			lists.push('fa fa-star-half-full');
		}

		for (let i = 1; i < (5 - total + 1); i++) { 
		    lists.push('fa fa-star-o');
		}

		return lists;
	}),	

});
