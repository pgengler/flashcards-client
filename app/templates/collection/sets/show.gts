import type { TOC } from '@ember/component/template-only';
import { array } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import CardSetHeader from 'flashcards/components/card-set-header';
import type { CollectionSetsShowRouteModel } from 'flashcards/routes/collection/sets/show';

interface CollectionSetsShowSignature {
  Args: {
    model: CollectionSetsShowRouteModel;
  };
}

export default <template>
  <CardSetHeader @cardSet={{@model.cardSet}} @editable={{true}} />

  <ul class="list-group">
    <li class="list-group-item">
      <LinkTo
        @route="collection.sets.manage"
        @models={{array @model.cardSet.collection.slug @model.cardSet.id}}
        data-test-manage-cards
      >
        Manage
      </LinkTo>
    </li>

    {{#if @model.cardSet.cards}}
      <li class="list-group-item">
        <LinkTo @route="collection.sets.study" @models={{array @model.cardSet.collection.slug @model.cardSet.id}}>
          Start a study session
        </LinkTo>
      </li>
    {{/if}}
  </ul>
</template> satisfies TOC<CollectionSetsShowSignature>;
