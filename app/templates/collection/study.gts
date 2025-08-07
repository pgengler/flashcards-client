import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CollectionHeader from "../../components/collection-header.js";
import StudySession from "../../components/study-session.js";
export default <template><CollectionHeader @collection={{@model}} @editable={{true}} />

<StudySession @cards={{@model.cards}} /></template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>