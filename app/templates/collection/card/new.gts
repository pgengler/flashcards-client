import { Input } from '@ember/component';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import CardForm from 'flashcards/components/card-form';
import Card from 'flashcards/models/card';
import type { CollectionNewCardRouteModel } from 'flashcards/routes/collection/card/new';

interface CollectionCardNewSignature {
  Args: {
    model: CollectionNewCardRouteModel;
  };
}

export default class extends Component<CollectionCardNewSignature> {
  @service declare router: RouterService;

  @tracked addAnother = false;

  @action
  onSave(card: Card) {
    if (this.addAnother) {
      this.router.refresh();
    } else {
      this.router.transitionTo('collection.card.show', card.collection.slug, card.id);
    }
  }

  <template>
    <CardForm @card={{@model.card}} @submitLabel="Create" @onSave={{this.onSave}}>
      <div class="ms-2">
        <label for="add-more" class="form-check-label">Add another?</label>
        {{! template-lint-disable no-builtin-form-components }}
        <Input @type="checkbox" @checked={{this.addAnother}} id="add-more" name="add-more" class="form-check-input" />
        {{! template-lint-enable no-builtin-form-components }}
      </div>
    </CardForm>
  </template>
}
