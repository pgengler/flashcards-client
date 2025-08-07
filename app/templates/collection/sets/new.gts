import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionHeader from "../../../components/collection-header.js";
import CardSetForm from "../../../components/card-set-form.js";
export default <template><CollectionHeader @collection={{@model.collection}} @editable={{true}} class="mb-3" />

<h2>New card set</h2>

<CardSetForm @cardSet={{@model}} @saved={{@controller.redirectToSet}} @cancelled={{@controller.redirectToCollection}} /></template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>