import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TopNav extends Component {
  @service currentCollection;
  @service router;
  @service store;

  get topNavElement() {
    return document.getElementById('top-nav');
  }

  get collections() {
    return this.store.peekAll('collection');
  }

  get collection() {
    return this.currentCollection.currentCollection;
  }

  @action
  randomCard() {
    if (this.router.currentRouteName === 'collection.card.random') {
      // once RouterService#refresh lands in a release, use that instead
      // this.router.refresh();
      this.router._router._routerMicrolib.refresh(); // eslint-disable-line ember/no-private-routing-service
    } else {
      this.router.transitionTo('collection.card.random', this.collection.slug);
    }
  }
}
