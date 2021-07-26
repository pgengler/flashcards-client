import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';
import { Response } from 'miragejs';

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

  test('displays validation errors when adding a new collection inline, not as a flash message', async function (assert) {
    this.server.post('/api/collections', function () {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              title: 'is already taken',
              detail: 'name - is already taken',
              code: '100',
              source: {
                pointer: '/data/attributes/name',
              },
              status: 422,
            },
          ],
        }
      );
    });

    await visit('/collections/new');
    await fillIn('input[name=name]', 'Already-used collection name');
    await click('button[type=submit]');

    assert.equal(currentRouteName(), 'collections.new', 'remains on the "new collection" page');
    assert.dom('[data-test-errors-for="name"]').hasText('name - is already taken');
    assert.dom('.flash-message').doesNotExist();
  });

  test('displays errors (other than validation errors) when adding a collection as a flash message', async function (assert) {
    this.server.post('/api/collections', function () {
      return new Response(500);
    });

    await visit('/collections/new');
    await fillIn('input[name=name]', 'Collection name');
    await click('button[type=submit]');

    assert.equal(currentRouteName(), 'collections.new', 'remains on the "new collection" page');
    assert.dom('.flash-message').hasText('Failed to save the new collection');
    assert.dom('[data-test-errors-for="name"]').hasNoText();
  });
});
