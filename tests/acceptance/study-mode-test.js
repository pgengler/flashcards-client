import { module, test } from 'qunit';
import { click, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | study mode', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
    this.cards = this.server.createList('card', 15, { collection: this.collection });
  });

  module('for an entire collection', function () {
    test('it shows every card in the collection once', async function (assert) {
      await visit(`/collection/${this.collection.slug}/study`);

      let displayedCards = [];
      for (let i = 1; i <= this.cards.length; i++) {
        assert.dom('[data-test-progress]').hasText(`${i} / ${this.cards.length}`, 'updates progess indicator');
        displayedCards.push(find('[data-test-card]').getAttribute('data-test-id'));

        if (i < this.cards.length) {
          await click('[data-test-next]');
        } else {
          assert.dom('[data-test-next]').isDisabled('"next" button is not enabled on last card');
        }
      }

      let expectedCardIds = this.cards.map((c) => c.id).sort();
      let actualCardIds = displayedCards.sort();
      assert.deepEqual(actualCardIds, expectedCardIds, 'displayed all cards in the collection once');
    });

    test('can navigate back and forth between cards', async function (assert) {
      let cardsShown = [];
      let currentCardId = () => find('[data-test-card]').getAttribute('data-test-id');

      await visit(`/collection/${this.collection.slug}/study`);
      cardsShown.push(currentCardId());

      await click('[data-test-next]');
      assert.false(cardsShown.includes(currentCardId()), 'moving "next" displays a different card');
      cardsShown.push(currentCardId());

      await click('[data-test-next]');
      assert.false(cardsShown.includes(currentCardId()), 'moving "next" displays a different card');
      cardsShown.push(currentCardId());

      await click('[data-test-previous]');
      assert.strictEqual(cardsShown[1], currentCardId(), 'moving "previous" displays last-shown card');
    });

    test('cannot navigate back and forth while editing a card', async function (assert) {
      await visit(`/collection/${this.collection.slug}/study`);

      // advance to not be on the first card, so we can check both "Back" and "Next" states
      await click('[data-test-next]');

      // enter "edit" mode for the current card
      await click('[data-test-edit-button]');

      assert.dom('[data-test-next]').isDisabled('"next" button is disabled while in edit mode');
      assert.dom('[data-test-previous]').isDisabled('"back" button is disabled while in edit mode');
    });
  });

  module('for a card set', function (hooks) {
    hooks.beforeEach(function () {
      this.cardSet = this.server.create('card-set', {
        collection: this.collection,
        cards: this.cards.slice(0, 7),
      });
    });

    test('it shows only the cards in the set, once each', async function (assert) {
      await visit(`/collection/${this.collection.slug}/sets/${this.cardSet.id}/study`);

      let displayedCards = [];
      for (let i = 1; i <= this.cardSet.cards.length; i++) {
        assert.dom('[data-test-progress]').hasText(`${i} / ${this.cardSet.cards.length}`, 'updates progress indicator');
        displayedCards.push(find('[data-test-card]').getAttribute('data-test-id'));

        if (i < this.cardSet.cards.length) {
          await click('[data-test-next]');
        } else {
          assert.dom('[data-test-next]').isDisabled('"next" button is not enabled on last card');
        }
      }

      let expectedCardIds = this.cardSet.cards.models.map((c) => c.id).sort();
      let actualCardIds = displayedCards.sort();
      assert.deepEqual(actualCardIds, expectedCardIds, 'displayed all cards in the set once');
    });
  });
});
