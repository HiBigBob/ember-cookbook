import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('login');
  this.route('register');

  this.route('recipes', function() {
    this.route('index', { path: '/' });
    this.route('add');
    this.route('show', { path: '/show/:recipe_id' });
  });
});

export default Router;
