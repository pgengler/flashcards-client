import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionHeader from '../../components/collection-header.js';
import CardImportForm from '../../components/card-import-form.js';
export default <template>
  <CollectionHeader @collection={{@model}} @editable={{true}} />

  <h2>Import cards</h2>
  <CardImportForm @collection={{@model}} />
</template> satisfies TemplateOnlyComponent<{ Args: { model: unknown; controller: unknown } }>;
