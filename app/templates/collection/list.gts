import type { TOC } from '@ember/component/template-only';
import CollectionHeader from 'flashcards/components/collection-header';
import { LinkTo } from '@ember/routing';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

interface CollectionListSignature {
  Args: {
    model: CollectionRouteModel;
  };
}

export default <template>
  <CollectionHeader @collection={{@model.collection}} @editable={{true}} />

  {{#if @model.collection.cards}}
    <table class="table" data-test-card-list>
      <thead>
        <tr>
          <th>Front</th>
          <th>Back</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {{#each @model.collection.cards as |card|}}
          <tr data-test-card>
            <td>{{card.front}}</td>
            <td>{{card.back}}</td>
            <td>
              {{! TODO: link to edit page for card }}
            </td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  {{else}}
    There are no cards in this collection.
    <LinkTo @route="collection.card.new" @model={{@model.collection.slug}}>
      Add some now!
    </LinkTo>
  {{/if}}
</template> satisfies TOC<CollectionListSignature>;
