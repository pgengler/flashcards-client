import type { TOC } from '@ember/component/template-only';
import CardImportForm from 'flashcards/components/card-import-form';
import CollectionHeader from 'flashcards/components/collection-header';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

interface CollectionImportSignature {
  Args: {
    model: CollectionRouteModel;
  };
}
export default <template>
  <CollectionHeader @collection={{@model.collection}} @editable={{true}} />

  <h2>Import cards</h2>
  <CardImportForm @collection={{@model.collection}} />
</template> satisfies TOC<CollectionImportSignature>;
