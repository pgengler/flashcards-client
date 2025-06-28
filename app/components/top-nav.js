import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

function isInput(element) {
  let tagName = element.tagName;
  if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
    return true;
  }
  return false;
}

export default class TopNav extends Component {
  @service currentCollection;
  @service router;
  @service store;

  get topNavElement() {
    return document.getElementById('top-nav');
  }

  get collections() {
    return this.store.peekAll('collection').filter((collection) => !collection.isNew);
  }

  get collection() {
    return this.currentCollection.currentCollection;
  }

  @action
  randomCard(event) {
    if (isInput(event.target)) {
      return;
    }

    if (this.router.currentRouteName === 'collection.card.random') {
      // once RouterService#refresh lands in a release, use that instead:
      this.router.refresh();
    } else {
      this.router.transitionTo('collection.card.random', this.collection.slug);
    }
  }
}
