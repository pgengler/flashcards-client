import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import type Collection from 'flashcards/models/collection';

interface CollectionHeaderSignature {
  Args: {
    collection: Collection;
    editable: boolean;
    name?: string;
  };
  Element: HTMLElement;
}

export default class CollectionHeader extends Component<CollectionHeaderSignature> {
  get name(): string {
    return this.args.name ?? this.args.collection.name;
  }

  <template>
    <header class="d-flex align-items-center mb-3" ...attributes>
      <h1>{{this.name}}</h1>
      {{#if @editable}}
        <LinkTo @route="collection.edit" @model={{@collection}} class="btn" data-test-edit>
          <img src="/assets/images/pencil-square.svg" alt="pencil icon" title="Edit" />
        </LinkTo>
      {{/if}}
    </header>
  </template>
}
