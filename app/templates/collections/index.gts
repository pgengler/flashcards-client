import type { TOC } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';
import type { CollectionsIndexRouteModel } from 'flashcards/routes/collections/index';

interface CollectionsIndexSignature {
  Args: {
    model: CollectionsIndexRouteModel;
  };
}

export default <template>
  <h1>Choose a collection:</h1>

  <ul>
    {{#each @model.collections as |collection|}}
      <li data-test-collection>
        <LinkTo @route="collection" @model={{collection.slug}}>
          {{collection.name}}
        </LinkTo>
      </li>
    {{/each}}
  </ul>
</template> satisfies TOC<CollectionsIndexSignature>;
