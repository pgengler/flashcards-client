import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CollectionNewCardController extends Controller {
  @service router;

  @tracked addAnother = false;

  @action
  onSave(card) {
    if (this.addAnother) {
      this.router.refresh();
    } else {
      this.router.transitionTo('collection.card.show', card.collection.get('slug'), card.id);
    }
  }
}
