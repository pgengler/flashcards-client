import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CardNewController extends Controller {
  @service router;

  @tracked addAnother = false;

  @action
  onSave(card) {
    if (this.addAnother) {
      // someday this will be possible:
      // this.router.refresh();
      // until then, here's a hack:
      this.router._router._routerMicrolib.refresh(); // eslint-disable-line ember/no-private-routing-service
    } else {
      this.router.transitionTo('collection.card.show', card.collection.get('slug'), card.id);
    }
  }
}
