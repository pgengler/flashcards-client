import { module, test } from 'qunit';
import { currentRouteName, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | random card', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('visiting /collections/:slug/random displays a card when some exist', async function (assert) {
    this.server.createList('card', 42, { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/random`);

    assert.equal(currentRouteName(), 'collection.card.random');
  });

  test('visiting /collections/:slug/random redirects to new card form when no cards exist', async function (assert) {
    await visit(`/collection/${this.collection.slug}/card/random`);

    assert.equal(currentRouteName(), 'collection.card.new');
  });
});
