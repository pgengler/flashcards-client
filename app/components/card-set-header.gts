import Component from '@glimmer/component';
import { LinkTo } from '@ember/routing';
import { array } from '@ember/helper';
import type CardSet from 'flashcards/models/card-set';

interface CardSetHeaderSignature {
  Args: {
    cardSet: CardSet;
    editable?: boolean;
  };
}

export default class CardSetHeader extends Component<CardSetHeaderSignature> {
  name = this.args.cardSet.name;

  <template>
    <header class="d-flex align-items-center mb-5">
      <h1 class="d-inline-block">
        {{@cardSet.collection.name}}
      </h1>

      <LinkTo @route="collection.edit" @model={{@cardSet.collection}} class="btn" data-test-edit-collection>
        <img src="/assets/images/pencil-square.svg" alt="pencil icon" title="Edit" />
      </LinkTo>

      <h1 class="d-inline-block">
        &raquo;
        {{this.name}}
      </h1>

      {{#if @editable}}
        <LinkTo
          @route="collection.sets.manage"
          @models={{array @cardSet.collection @cardSet}}
          class="btn"
          data-test-edit-card-set
        >
          <img src="/assets/images/pencil-square.svg" alt="pencil icon" title="Edit" />
        </LinkTo>
      {{/if}}
    </header>
  </template>
}
