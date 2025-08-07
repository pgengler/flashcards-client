import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CardForm from "../../../components/card-form.js";
import { Input } from "@ember/component";
export default <template><CardForm @card={{@model}} @submitLabel="Create" @onSave={{@controller.onSave}}>
  <div class="ms-2">
    <label for="add-more" class="form-check-label">Add another?</label>
    {{!-- template-lint-disable no-builtin-form-components --}}
    <Input @type="checkbox" @checked={{@controller.addAnother}} id="add-more" name="add-more" class="form-check-input" />
    {{!-- template-lint-enable no-builtin-form-components --}}
  </div>
</CardForm></template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>