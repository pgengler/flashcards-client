import Component from '@glimmer/component';
import TopNav from 'flashcards/components/top-nav';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import FlashMessage from 'ember-cli-flash/components/flash-message';
import { service } from '@ember/service';

export default class extends Component {
  @service declare flashMessages: FlashMessagesService;

  <template>
    <TopNav />

    <div class="container">
      {{#each this.flashMessages.queue as |flash|}}
        <FlashMessage @flash={{flash}} />
      {{/each}}

      {{outlet}}
    </div>
  </template>
}
