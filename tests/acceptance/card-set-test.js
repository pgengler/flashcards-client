import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, findAll, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';
import { Response } from 'miragejs';

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

    let newCardIds = [];
    this.server.patch('/api/card-sets/:id', function ({ cardSets }, { params }) {
      let set = cardSets.find(params.id);
      let attrs = this.normalizedRequestAttrs();
      newCardIds = attrs.cardIds;
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

    await click('[data-test-manage-cards-form] button[type=submit]');
    let expectedCardIds = [cards[1].id, cards[2].id, cards[4].id];
    assert.deepEqual(newCardIds, expectedCardIds);
  });

  test('cancelling adding/removing cards leaves set unchanged', async function (assert) {
    assert.expect(2);

    let cards = this.server.createList('card', 15, { collection: this.collection });
    let cardsInSet = cards.slice(0, 3);
    let cardToRemove = cardsInSet[0];
    let cardToAdd = cards[4];
    let cardSet = this.server.create('card-set', {
      collection: this.collection,
      cards: cardsInSet,
    });

    this.server.patch('/api/card-sets/:id', function () {
      assert.ok(false, 'card set should not have been saved');
    });

    await visit(`/collection/${this.collection.slug}/sets/${cardSet.id}`);
    await click('button[data-test-manage-cards]');

    // uncheck a card
    await click(`input[value="${cardToRemove.id}"]`);

    // check a new card to add
    await click(`input[value="${cardToAdd.id}"]`);

    await click('[data-test-manage-cards-form] button[data-test-cancel-button]');
    assert.dom('[data-test-manage-cards-form]').doesNotExist('"manage cards" form is no longer displayed');

    await click('button[data-test-manage-cards]');
    const checkedCardIds = findAll('input:is(:checked)').map((e) => e.value);
    const expectedCardIds = cardsInSet.map((c) => c.id);
    assert.deepEqual(checkedCardIds, expectedCardIds, 'selection was reverted to cards originally in the set');
  });

  test('displays any validation errors while saving a new set', async function (assert) {
    this.server.post('/api/card-sets', function () {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              title: 'must be awesome',
              detail: 'name - must be something else',
              code: '100',
              source: {
                pointer: '/data/attributes/name',
              },
              status: 422,
            },
          ],
        }
      );
    });

    await visit(`/collection/${this.collection.slug}/sets/new`);
    await fillIn('input[name="name"]', 'New card set');
    await click('button[type=submit]');

    assert.equal(currentRouteName(), 'collection.sets.new', 'does not transition');
    assert.dom('[data-test-errors-for="name"]').hasText('name - must be something else');
    assert.dom('.flash-message').doesNotExist('does not show a flash message');
  });

  test('displays errors (other than validation errors) as a flash message', async function (assert) {
    this.server.post('/api/card-sets', function () {
      return new Response(500);
    });

    await visit(`/collection/${this.collection.slug}/sets/new`);
    await fillIn('input[name="name"]', 'New card set');
    await click('button[type=submit]');

    assert.equal(currentRouteName(), 'collection.sets.new', 'does not transition');
    assert.dom('.flash-message').hasText('Failed to save the new card set');
    assert.dom('[data-test-errors-for="name"]').hasNoText();
  });
});
