import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FlippableCard extends Component {
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
