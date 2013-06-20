App = Ember.Application.create({});
// http://net.tutsplus.com/tutorials/javascript-ajax/getting-into-ember-js-part-2/

App.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('content', ['red', 'yellow', 'blue']);
  }
});
App.Router.map( function() {
    this.resource( 'index', { path: '/' } ); // Takes us to &quot;/&quot;
});