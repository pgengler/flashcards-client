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

    assert.equal(currentRouteName(), 'collection.index', 'redirects to collection page after creation');
  });

  test('can see a list of all cards in a collection', async function (assert) {
    let collection = this.server.create('collection');
    this.server.createList('card', 11, { collection });

    await visit(`/collection/${collection.slug}/list`);
    assert.dom('[data-test-card-list] [data-test-card]').exists({ count: 11 });
  });

  test('collection page includes list of card sets', async function (assert) {
    let collection = this.server.create('collection');
    this.server.createList('card-set', 6, { collection });

    await visit(`/collection/${collection.slug}`);

    assert.dom('[data-test-card-set-list] [data-test-card-set]').exists({ count: 6 });
  });
});
