import type { TemplateOnlyComponent } from '@ember/component/template-only';
import Card from '../../../components/card.js';
export default <template><Card @card={{@model}} /></template> satisfies TemplateOnlyComponent<{
  Args: { model: unknown; controller: unknown };
}>;
