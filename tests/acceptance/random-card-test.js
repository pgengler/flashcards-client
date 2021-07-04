import { module, test } from 'qunit';
import { visit, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | random card', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('visiting /collections/:slug/random displays a card when some exist', async function (assert) {
    this.server.createList('card', 42, { collection: this.collection });

    await visit(`/collections/${this.collection.slug}/random`);

    assert.equal(currentRouteName(), 'collection.card.index');
  });

  test('visiting /collections/:slug/random redirects to new card form when no cards exist', async function (assert) {
    await visit(`/collections/${this.collection.slug}/random`);

    assert.equal(currentRouteName(), 'collection.card.new');
  });
});
