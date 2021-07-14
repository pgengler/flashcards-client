import { module, skip, test } from 'qunit';
import { click, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | study mode', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
    this.cards = this.server.createList('card', 15, { collection: this.collection });
  });

  module('entire collection', function () {
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

    skip('can navigate back and forth between cards', async function (/* assert */) {});
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
