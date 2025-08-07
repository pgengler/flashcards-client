import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CardSetHeader from "../../../components/card-set-header.js";
import CardSetForm from "../../../components/card-set-form.js";
import { on } from "@ember/modifier";
export default <template><CardSetHeader @cardSet={{@model}} @editable={{false}} />

<CardSetForm @cardSet={{@model}} @saved={{@controller.redirectToSet}} @cancelled={{@controller.redirectToSet}}>
  <div class="flex-grow-1"></div>
  <button type="button" class="btn btn-danger" data-test-action="delete" {{on "click" @controller.remove}}>
    Delete
  </button>

</CardSetForm></template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>