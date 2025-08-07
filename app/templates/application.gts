import type { TemplateOnlyComponent } from '@ember/component/template-only';
import TopNav from '../components/top-nav.js';
import FlashMessage from 'ember-cli-flash/components/flash-message';
export default <template>
  <TopNav />

  <div class="container">
    {{#each @model.queue as |flash|}}
      <FlashMessage @flash={{flash}} />
    {{/each}}

    {{outlet}}
  </div>
</template> satisfies TemplateOnlyComponent<{ Args: { model: unknown; controller: unknown } }>;
