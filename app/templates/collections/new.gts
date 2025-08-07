import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionForm from "../../components/collection-form.js";
export default <template><h1>Add new collection</h1>

<CollectionForm @collection={{@model}} @submitLabel="Create" /></template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>