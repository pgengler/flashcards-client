import { module, skip, test } from 'qunit';
import { click, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | study mode', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
    this.cards = this.server.createList('card', 5, { collection: this.collection });
  });

  module('entire collection', function () {
    test('it shows every card in the collection once', async function (assert) {
      await visit(`/collection/${this.collection.slug}/study`);

      for (let i = 1; i <= 5; i++) {
        assert.dom('[data-test-progress]').hasText(`${i} / 5`);
        assert.step(find('[data-test-card]').getAttribute('data-test-id'));

        if (i < 5) {
          await click('[data-test-next]');
        } else {
          assert.dom('[data-test-next]').isDisabled('"next" button is not enabled on last card');
        }
      }

      assert.verifySteps(this.cards.map((c) => c.id).sort());
    });

    skip('can navigate back and forth between cards', async function (/* assert */) {});
  });

  module('for a card set', function (hooks) {
    hooks.beforeEach(function () {
      this.cardSet = this.server.create('card-set', {
        collection: this.collection,
        cards: [this.cards[0], this.cards[1]],
      });
    });

    skip('it shows only the cards in the set, once each');
  });
});
