import type { TemplateOnlyComponent } from '@ember/component/template-only';
import CardSetHeader from "../../../components/card-set-header.js";
import StudySession from "../../../components/study-session.js";
export default <template><CardSetHeader @cardSet={{@model}} @editable={{true}} />

<StudySession @cards={{@model.cards}} /></template> satisfies TemplateOnlyComponent<{ Args: { model: unknown, controller: unknown } }>