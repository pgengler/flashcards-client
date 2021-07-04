import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | collections', function (hooks) {
  setupApplicationTest(hooks);

  test('index page lists all collections', async function (assert) {
    this.server.createList('collection', 4);

    await visit('/');
    assert.dom('[data-test-collection]').exists({ count: 4 });
  });

  test('redirects to "new collection" page if no collections exist', async function (assert) {
    await visit('/');
    assert.equal(currentRouteName(), 'collections.new');
  });

  test('can create a new collection', async function (assert) {
    await visit('/collections/new');
    await fillIn('input[id="name"]', 'New collection');
    await click('button[type="submit"]');

    assert.equal(
      currentRouteName(),
      'collections.show',
      'redirects to collection page after creation'
    );
  });
});
