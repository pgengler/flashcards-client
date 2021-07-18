import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | card set', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('adding a new card set to a collection', async function (assert) {
    await visit(`/collection/${this.collection.slug}/sets/new`);

    assert.dom('button[type=submit]').isDisabled('submit button is disabled initially');
    await fillIn('input[name="name"]', 'New card set');

    assert
      .dom('button[type=submit]')
      .isNotDisabled('submit button is not disabled once all required fields are filled');
    await click('button[type=submit]');

    assert.equal(currentRouteName(), 'collection.sets.show', 'redirects to new set');
  });

  test('adding/removing cards from a card set', async function (assert) {
    let cards = this.server.createList('card', 15, { collection: this.collection });
    let cardsInSet = cards.slice(0, 3);
    let cardToRemove = cardsInSet[0];
    let cardToAdd = cards[4];
    let cardSet = this.server.create('card-set', {
      collection: this.collection,
      cards: cardsInSet,
    });

    this.server.patch('/api/card-sets/:id', function ({ cardSets }, { params }) {
      let set = cardSets.find(params.id);
      let attrs = this.normalizedRequestAttrs();
      console.log({ attrs });
      set.update(attrs);
      return set;
    });

    await visit(`/collection/${this.collection.slug}/sets/${cardSet.id}`);
    await click('button[data-test-manage-cards]');

    assert.dom('tr[data-test-card]').exists({ count: 15 }, 'lists all cards in the collection');

    // check that the right number of checkboxes are checked
    assert
      .dom('input[type=checkbox]:is(:checked)')
      .exists({ count: 3 }, 'only checkboxes for cards already in the set are checked');

    // ensure that the checkboxes that are checked are the correct ones
    cardSet.cards.models.forEach((card) => {
      assert.dom(`input[value="${card.id}"]`).isChecked();
    });

    // uncheck a card
    await click(`input[value="${cardToRemove.id}"]`);
    assert.dom(`input[value="${cardToRemove.id}"]`).isNotChecked();

    // check a new card to add
    await click(`input[value="${cardToAdd.id}"]`);
    assert.dom(`input[value="${cardToAdd.id}"]`).isChecked();

    await click('button[type=submit]');
  });
});
