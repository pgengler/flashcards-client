import Route from '@ember/routing/route';

export default class CollectionRandomCardRoute extends Route {
  model({ id }) {
    let collection = this.modelFor('collection');
    return collection.cards.find((card) => card.id === id);
  }
}
