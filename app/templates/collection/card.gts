import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionHeader from 'flashcards/components/collection-header';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

interface CollectionCardSignature {
  Args: {
    model: CollectionRouteModel;
  };
}

export default <template>
  <CollectionHeader @collection={{@model.collection}} @editable={{true}} />

  {{outlet}}
</template> satisfies TemplateOnlyComponent<CollectionCardSignature>;
