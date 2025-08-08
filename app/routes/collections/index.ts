import type Store from '@ember-data/store';
import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type Collection from 'flashcards/models/collection';

export type CollectionsIndexRouteModel = {
  collections: Collection[];
};

export default class CollectionsIndexRoute extends Route {
  @service declare router: RouterService;
  @service declare store: Store;

  model(): CollectionsIndexRouteModel {
    return {
      collections: <Collection[]>this.store.peekAll('collection'),
    };
  }

  redirect({ collections }: CollectionsIndexRouteModel) {
    if (collections.length === 0) {
      this.router.transitionTo('collections.new');
    }
  }
}
