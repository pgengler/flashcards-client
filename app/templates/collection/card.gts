import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionHeader from '../../components/collection-header.js';
export default <template>
  <CollectionHeader @collection={{@model}} @editable={{true}} />

  {{outlet}}
</template> satisfies TemplateOnlyComponent<{ Args: { model: unknown; controller: unknown } }>;
