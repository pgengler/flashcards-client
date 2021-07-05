import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | collections', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('displays the front of a card initially', async function (assert) {
    let card = this.server.create('card', { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    assert.dom('[data-test-card-front]').hasText(card.front);
  });
});
