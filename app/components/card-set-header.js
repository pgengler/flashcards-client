import Component from '@glimmer/component';

export default class CardSetHeader extends Component {
  name = this.args.cardSet.name;
}
