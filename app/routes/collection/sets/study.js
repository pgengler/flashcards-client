import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SetsStudyRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('card-set', params.id, {
      include: 'cards',
    });
  }
}
