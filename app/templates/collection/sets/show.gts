import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CardSetHeader from "../../../components/card-set-header.js";
import { LinkTo } from "@ember/routing";
import { array } from "@ember/helper";
export default <template><CardSetHeader @cardSet={{@model}} @editable={{true}} />

<ul class="list-group">
  <li class="list-group-item">
    <LinkTo @route="collection.sets.manage" @models={{array @model.collection.slug @model.id}} data-test-manage-cards>
      Manage
    </LinkTo>
  </li>

  {{#if @model.cards}}
    <li class="list-group-item">
      <LinkTo @route="collection.sets.study" @models={{array @model.collection.slug @model.id}}>
        Start a study session
      </LinkTo>
    </li>
  {{/if}}
</ul></template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>