import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  short_name: DS.attr('string')
});
