import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TopNav extends Component {
  @service('currentCollection') currentCollectionService;
  @service store;

  get topNavElement() {
    return document.getElementById('top-nav');
  }

  get collections() {
    return this.store.peekAll('collection');
  }

  get currentCollection() {
    return this.currentCollectionService.currentCollection;
  }
}
