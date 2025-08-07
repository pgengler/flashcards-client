import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import onKey from 'ember-keyboard/modifiers/on-key';
import MarkdownToHtml from 'ember-showdown/components/markdown-to-html';

export default class FlippableCard extends Component {
  <template>
    <div
      class="flip-container {{if this.isFlipped 'flipped'}}"
      role="button"
      {{on "click" this.flipCard}}
      {{onKey "Space" this.flipCard}}
      ...attributes
    >
      <div class="flipper">
        <div class="flashcard front" data-test-card-front>
          <MarkdownToHtml @markdown={{@card.front}} />
        </div>

        <div class="flashcard back" data-test-card-back>
          <MarkdownToHtml @markdown={{@card.back}} />
        </div>
      </div>
    </div>
  </template>
  get isFlipped() {
    return this.side === 'back';
  }

  get side() {
    return this.args.side || 'front';
  }

  @action flipCard() {
    this.args.flip(this.side === 'back' ? 'front' : 'back');
  }
}
