import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  get isFlipped() {
    return this.side === 'back';
  }

  get side() {
    return this.args.side || 'front';
  }

  @action flipCard() {
    this.args.flipped(this.side === 'back' ? 'front' : 'back');
  }
}
