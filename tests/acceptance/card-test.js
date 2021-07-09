import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | card', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('displays the front of a card initially', async function (assert) {
    let card = this.server.create('card', { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    assert.dom('[data-test-card-front]').hasText(card.front);
  });

  test('clicking a card flips it over', async function (assert) {
    let card = this.server.create('card', { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    assert.dom('[data-test-card]').doesNotHaveClass('flipped');

    await click('[data-test-card-front]');
    assert.dom('[data-test-card]').hasClass('flipped');
  });
});
