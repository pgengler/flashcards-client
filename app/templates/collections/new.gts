import type { TOC } from '@ember/component/template-only';
import CollectionForm from 'flashcards/components/collection-form';
import type { CollectionsNewRouteModel } from 'flashcards/routes/collections/new';

interface CollectionsNewSignature {
  Args: {
    model: CollectionsNewRouteModel;
  };
}

export default <template>
  <h1>Add new collection</h1>

  <CollectionForm @collection={{@model.collection}} @submitLabel="Create" />
</template> satisfies TOC<CollectionsNewSignature>;
