import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionHeader from "../../components/collection-header.js";
import { LinkTo } from "@ember/routing";
export default <template><CollectionHeader @collection={{@model}} @editable={{true}} />

{{#if @model.cards}}
  <table class="table" data-test-card-list>
    <thead>
      <tr>
        <th>Front</th>
        <th>Back</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {{#each @model.cards as |card|}}
        <tr data-test-card>
          <td>{{card.front}}</td>
          <td>{{card.back}}</td>
          <td>
            {{!-- TODO: link to edit page for card --}}
          </td>
        </tr>
      {{/each}}
    </tbody>
  </table>
{{else}}
  There are no cards in this collection.
  <LinkTo @route="collection.card.new" @model={{@model.slug}}>
    Add some now!
  </LinkTo>
{{/if}}</template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>