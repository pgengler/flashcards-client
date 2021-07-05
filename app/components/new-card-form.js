import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class CardsNewController extends Component {
  @service router;
  @service store;

  @tracked front;
  @tracked back;

  get submitButtonDisabled() {
    return isEmpty(this.front) || isEmpty(this.back);
  }

  @action
  async create() {
    let card = this.store.createRecord('card', {
      front: this.front,
      back: this.back,
      collection: this.args.collection,
    });
    try {
      await card.save();
      this.router.transitionTo(
        'collection.card.show',
        this.args.collection.slug,
        card.id
      );
    } catch (e) {
      // alert('Saving failed');
      console.error(e);
    }
  }
}
