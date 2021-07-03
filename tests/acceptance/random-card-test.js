import { module, test } from 'qunit';
import { visit, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | random card', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /cards/random redirects a card when some exist', async function (assert) {
    this.server.create('card');

    await visit('/cards/random');

    assert.equal(currentRouteName(), 'cards.show');
  });

  test('visiting /cards/random redirects to new card form when no cards exist', async function (assert) {
    await visit('/cards/random');

    assert.equal(currentRouteName(), 'cards.new');
  });
});
