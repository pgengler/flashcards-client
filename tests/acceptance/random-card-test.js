import { module, test } from 'qunit';
import { click, currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | random card', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('visiting /collections/:slug/random displays a card when some exist', async function (assert) {
    this.server.createList('card', 42, { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/random`);

    assert.equal(currentURL(), `/collection/${this.collection.slug}/card/random`);
  });

  test('visiting /collections/:slug/random redirects to new card form when no cards exist', async function (assert) {
    await visit(`/collection/${this.collection.slug}/card/random`);

    assert.equal(currentURL(), `/collection/${this.collection.slug}/card/new`);
  });

  test('getting a new random card resets view to the front', async function (assert) {
    this.server.createList('card', 7, { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/random`);
    assert.dom('[data-test-card]').doesNotHaveClass('flipped', 'displays front of card initially');

    await click('[data-test-card]');
    assert.dom('[data-test-card]').hasClass('flipped', 'card is flipped');

    await click('[data-test-random-card] button');
    assert.dom('[data-test-card]').doesNotHaveClass('flipped', 'card resets to displaying front');
  });
});
