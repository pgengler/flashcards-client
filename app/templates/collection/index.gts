import type { TOC } from '@ember/component/template-only';
import CollectionHeader from 'flashcards/components/collection-header';
import { LinkTo } from '@ember/routing';
import { pluralize } from 'ember-inflector';
import { array } from '@ember/helper';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

interface CollectionIndexSignature {
  Args: {
    model: CollectionRouteModel;
  };
}

export default <template>
  <CollectionHeader @collection={{@model.collection}} @editable={{true}} />

  <h3>Actions</h3>
  <ul class="list-group mb-4">
    <li class="list-group-item">
      <LinkTo @route="collection.card.new" @model={{@model.collection.slug}}>
        Add a new card
      </LinkTo>
    </li>

    {{#if @model.collection.cards}}
      <li class="list-group-item">
        <LinkTo @route="collection.list" @model={{@model.collection.slug}}>
          View a list of all
          {{pluralize @model.collection.cards.length "card"}}.
        </LinkTo>
      </li>

      <li class="list-group-item">
        <LinkTo @route="collection.card.random" @model={{@model.collection.slug}}>
          View a random card
        </LinkTo>
      </li>

      <li class="list-group-item">
        <LinkTo @route="collection.study" @model={{@model.collection.slug}}>
          Start a study session
        </LinkTo>
      </li>
    {{/if}}

    <li class="list-group-item">
      <LinkTo @route="collection.import" @model={{@model.collection.slug}}>
        Bulk import cards
      </LinkTo>
    </li>
  </ul>

  <h3>Card Sets</h3>
  {{#if @model.collection.cardSets}}
    <ul class="list-group" data-test-card-set-list>
      {{#each @model.collection.cardSets as |cardSet|}}
        <li class="list-group-item" data-test-card-set>
          <LinkTo @route="collection.sets.show" @models={{array @model.collection.slug cardSet.id}}>
            {{cardSet.name}}
          </LinkTo>
        </li>
      {{/each}}
    </ul>
  {{else}}
    <p>
      You haven't created any card sets.
      <LinkTo @route="collection.sets.new" @model={{@model.collection.slug}}>
        Add one now.
      </LinkTo>
    </p>
  {{/if}}
</template> satisfies TOC<CollectionIndexSignature>;
