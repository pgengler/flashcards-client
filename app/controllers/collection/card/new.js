import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import refreshRoute from 'flashcards/utils/refresh-route';

export default class CardNewController extends Controller {
  @service router;

  @tracked addAnother = false;

  @action
  onSave(card) {
    if (this.addAnother) {
      // once RouterService#refresh lands in a release, use that instead:
      // this.router.refresh();
      refreshRoute(this.router);
    } else {
      this.router.transitionTo('collection.card.show', card.collection.get('slug'), card.id);
    }
  }
}
