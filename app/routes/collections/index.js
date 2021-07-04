import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CollectionsIndexRoute extends Route {
  @service router;
  @service store;

  model() {
    return this.modelFor('application');
  }

  redirect(collections) {
    if (collections.length === 0) {
      this.router.transitionTo('collections.new');
    }
  }
}
