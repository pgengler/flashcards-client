import Route from '@ember/routing/route';

export default class CollectionEditRoute extends Route {
  model() {
    let collection = this.modelFor('collection');
    return {
      collection,
      name: collection.name,
    };
  }
}
