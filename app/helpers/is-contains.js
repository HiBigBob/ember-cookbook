import Ember from 'ember';

export function isContains(params/*, hash*/) {
  return params[0].contains(params[1]);
}

export default Ember.Helper.helper(isContains);
