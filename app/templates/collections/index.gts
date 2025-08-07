import type { TemplateOnlyComponent } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';
export default <template>
  <h1>Choose a collection:</h1>

  <ul>
    {{#each @model as |collection|}}
      <li data-test-collection>
        <LinkTo @route="collection" @model={{collection.slug}}>
          {{collection.name}}
        </LinkTo>
      </li>
    {{/each}}
  </ul>
</template> satisfies TemplateOnlyComponent<{ Args: { model: unknown; controller: unknown } }>;
