import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import refreshRoute from 'flashcards/utils/refresh-route';

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
  randomCard() {
    if (this.router.currentRouteName === 'collection.card.random') {
      // once RouterService#refresh lands in a release, use that instead:
      // this.router.refresh();
      refreshRoute(this.router);
    } else {
      this.router.transitionTo('collection.card.random', this.collection.slug);
    }
  }
}
