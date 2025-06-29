import { module, test } from 'qunit';
import { click, currentURL, fillIn, findAll, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';
import { Response } from 'miragejs';

module('Acceptance | card set', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  module('adding a new card set', function () {
    test('requires a name to be able to save', async function (assert) {
      this.server.post('/api/card-sets', ({ cardSets }) => {
        assert.step('saved new card set');
        return cardSets.create(this.normalizedRequestAttrs());
      });
      await visit(`/collection/${this.collection.slug}/sets/new`);

      assert.dom('input[name="name"]').hasAttribute('required');

      await click('button[type="submit"]');
      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/sets/new`, 'does not save');
      assert.verifySteps([]);

      await fillIn('input[name="name"]', 'New card set');
      await click('button[type="submit"]');
      assert.verifySteps(['saved new card set']);
    });

    test('redirects to new set on save', async function (assert) {
      let newId;
      this.server.post('/api/card-sets', function ({ cardSets }) {
        let cardSet = cardSets.create(this.normalizedRequestAttrs());
        newId = cardSet.id;
        return cardSet;
      });
      await visit(`/collection/${this.collection.slug}/sets/new`);
      await fillIn('input[name="name"]', 'New card set');
      await click('button[type=submit]');

      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/sets/${newId}`, 'redirects to new set');
    });

    test('can add cards to a set when creating', async function (assert) {
      let cards = this.server.createList('card', 15, { collection: this.collection });
      let cardsToAdd = cards.slice(0, 5);

      let cardIds = [];
      this.server.post('/api/card-sets', function ({ cardSets }) {
        let attrs = this.normalizedRequestAttrs();
        cardIds = attrs.cardIds;
        return cardSets.create(attrs);
      });

      await visit(`/collection/${this.collection.slug}/sets/new`);
      await fillIn('input[name="name"]', 'New card set');

      assert.dom('tr[data-test-card]').exists({ count: 15 }, 'lists all cards in the collection');

      cardsToAdd.forEach(async (card) => {
        await click(`input[value="${card.id}"]`);
      });

      await click('button[type=submit]');

      assert.deepEqual(
        cardIds,
        cardsToAdd.map((x) => x.id),
      );
    });

    test('displays any validation errors inline', async function (assert) {
      this.server.post('/api/card-sets', function () {
        return new Response(
          422,
          {},
          {
            errors: [
              {
                title: 'must be something else',
                detail: 'name - must be something else',
                code: '100',
                source: {
                  pointer: '/data/attributes/name',
                },
                status: 422,
              },
            ],
          },
        );
      });

      await visit(`/collection/${this.collection.slug}/sets/new`);
      await fillIn('input[name="name"]', 'New card set');
      await click('button[type=submit]');

      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/sets/new`, 'does not transition');
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

      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/sets/new`, 'does not transition');
      assert.dom('.flash-message').hasText('Failed to save the new card set');
      assert.dom('[data-test-errors-for="name"]').hasNoText();
    });
  });

  module('editing a card set', function (hooks) {
    hooks.beforeEach(function () {
      this.cardSet = this.server.create('card-set', { collection: this.collection });
    });

    test('name is a required field', async function (assert) {
      assert.expect(2);

      this.server.patch('/api/card-sets/:id', function () {
        assert.ok(false, 'should not have made API request to save');
      });

      await visit(`/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`);

      assert.dom('input[name="name"]').hasAttribute('required');
      await fillIn('input[name="name"]', '');
      await click('button[type=submit]');
      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`,
        'remains on edit form',
      );
    });

    test('can change the name of a card set', async function (assert) {
      this.server.patch('/api/card-sets/:id', function ({ cardSets }, { params }) {
        let cardSet = cardSets.find(params.id);
        let attrs = this.normalizedRequestAttrs();
        assert.step(`changed card set name to "${attrs.name}"`);
        cardSet.update(attrs);
        return cardSet;
      });

      this.cardSet.update({ name: 'Original name' });
      await visit(`/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`);

      await fillIn('input[name="name"]', 'New name');
      await click('button[type="submit"]');
      assert.verifySteps(['changed card set name to "New name"']);
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
      await click('[data-test-manage-cards]');
      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/sets/${cardSet.id}/manage`,
        'link goes to right page',
      );

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

      await click('[data-test-card-set-form] button[type=submit]');
      let expectedCardIds = [cards[1].id, cards[2].id, cards[4].id];
      assert.deepEqual(newCardIds, expectedCardIds);

      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/sets/${cardSet.id}`,
        'returns to set show page when done',
      );
    });

    test('cancelling adding/removing cards leaves set unchanged', async function (assert) {
      assert.expect(3);

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
      await click('[data-test-manage-cards]');

      // uncheck a card
      await click(`input[value="${cardToRemove.id}"]`);

      // check a new card to add
      await click(`input[value="${cardToAdd.id}"]`);

      await click('[data-test-card-set-form] button[data-test-cancel-button]');
      assert.dom('[data-test-card-set-form]').doesNotExist('"manage cards" form is no longer displayed');
      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/sets/${cardSet.id}`,
        'returns to set show page after cancelling',
      );

      await click('[data-test-manage-cards]');
      const checkedCardIds = findAll('input:is(:checked)').map((e) => e.value);
      const expectedCardIds = cardsInSet.map((c) => c.id);
      assert.deepEqual(checkedCardIds, expectedCardIds, 'selection was reverted to cards originally in the set');
    });

    test('displays any validation errors inline', async function (assert) {
      this.server.patch('/api/card-sets/:id', function () {
        return new Response(
          422,
          {},
          {
            errors: [
              {
                title: 'must be something else',
                detail: 'name - must be something else',
                code: '100',
                source: {
                  pointer: '/data/attributes/name',
                },
                status: 422,
              },
            ],
          },
        );
      });

      await visit(`/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`);
      await fillIn('input[name="name"]', 'Duplicate name');
      await click('button[type=submit]');

      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`,
        'does not transition',
      );
      assert.dom('[data-test-errors-for="name"]').hasText('name - must be something else');
      assert.dom('.flash-message').doesNotExist('does not show a flash message');
    });

    test('displays errors (other than validation errors) as a flash message', async function (assert) {
      this.server.patch('/api/card-sets/:id', function () {
        return new Response(500);
      });

      await visit(`/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`);
      await fillIn('input[name="name"]', 'A name so cursed it causes backend errors');
      await click('button[type=submit]');

      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`,
        'does not transition',
      );
      assert.dom('.flash-message').hasText('Failed to save the new card set');
      assert.dom('[data-test-errors-for="name"]').hasNoText();
    });
  });

  module('deleting a card set', function (hooks) {
    hooks.beforeEach(function () {
      this.cardSet = this.server.create('card-set', {
        collection: this.collection,
        name: 'The Set of Cards',
      });
      this.cardSetEditURL = `/collection/${this.collection.slug}/sets/${this.cardSet.id}/manage`;

      this.windowConfirmReturnValue = true;
      this._originalWindowConfirm = window.confirm;
      window.confirm = () => this.windowConfirmReturnValue;
    });
    hooks.afterEach(function () {
      window.confirm = this._originalWindowConfirm;
    });

    test('deletes a card set if user confirms', async function (assert) {
      this.server.del('/api/card-sets/:id', function ({ cardSets }, { params }) {
        let cardSet = cardSets.find(params.id);
        assert.step(`deleted card set "${cardSet.name}"`);
        cardSet.destroy();
        return new Response(204);
      });
      await visit(this.cardSetEditURL);

      this.windowConfirmReturnValue = true;
      await click('button[data-test-action="delete"]');
      assert.verifySteps(['deleted card set "The Set of Cards"']);
      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}`, 'redirects to collection after deleting');
      assert.dom('.flash-message.alert-success').hasText('Card set "The Set of Cards" was removed');
    });

    test('does not delete card set if user cancels', async function (assert) {
      this.server.del('/api/card-sets/:id', function ({ cardSets }, { params }) {
        let cardSet = cardSets.find(params.id);
        assert.step(`deleted card set "${cardSet.name}"`);
        cardSet.destroy();
        return Response(204);
      });
      await visit(this.cardSetEditURL);

      this.windowConfirmReturnValue = false;
      await click('button[data-test-action="delete"]');
      assert.verifySteps([]);
      assert.strictEqual(currentURL(), this.cardSetEditURL, 'does not redirect');
      assert.dom('.flash-message').doesNotExist();
    });

    test('displays a flash message if deleting fails', async function (assert) {
      this.server.del('/api/card-sets/:id', function () {
        return Response(500);
      });

      await visit(this.cardSetEditURL);

      this.windowConfirmReturnValue = true;
      await click('button[data-test-action="delete"]');
      assert.dom('.flash-message.alert-danger').hasText('Could not remove "The Set of Cards"');
      assert.strictEqual(currentURL(), this.cardSetEditURL, 'does not redirect');
    });
  });
});
