import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionHeader from '../../components/collection-header.js';
import CollectionForm from '../../components/collection-form.js';
import { on } from '@ember/modifier';
export default <template>
  {{! @model isn't a Collection but it's got a `name` property so it works just as well here. Quack quack. }}
  <CollectionHeader @collection={{@model}} @editable={{false}} />

  <CollectionForm @collection={{@model.collection}} @submitLabel="Save">
    <button
      type="button"
      class="btn btn-outline-secondary ms-3"
      {{on "click" @controller.redirectToCollection}}
      data-test-action="cancel"
    >
      Cancel
    </button>
    <div class="flex-grow-1"></div>
    <button type="button" class="btn btn-danger" {{on "click" @controller.deleteCollection}} data-test-action="delete">
      Delete
    </button>
  </CollectionForm>
</template> satisfies TemplateOnlyComponent<{ Args: { model: unknown; controller: unknown } }>;
