import { module, test } from 'qunit';
import { dasherize } from '@ember/string';
import { click, currentRouteName, currentURL, fillIn, visit } from '@ember/test-helpers';
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

  test('/collections/:slug redirects to collections page if no collection is found', async function (assert) {
    this.server.create('collection', { name: 'This collection exists' });

    await visit('/collection/non-existent-collection-foo-bar-baz');
    assert.equal(currentRouteName(), 'collections.index');
  });

  module('adding a collection', function () {
    test('can create a new collection', async function (assert) {
      await visit('/collections/new');
      await fillIn('input[id="name"]', 'New collection');
      await click('button[type="submit"]');

      assert.equal(currentRouteName(), 'collection.index', 'redirects to collection page after creation');
    });

    test('displays validation errors inline, not as a flash message', async function (assert) {
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

    test('displays errors (other than validation errors) as a flash message', async function (assert) {
      this.server.post('/api/collections', function () {
        return new Response(500);
      });

      await visit('/collections/new');
      await fillIn('input[name=name]', 'Collection name');
      await click('button[type=submit]');

      assert.equal(currentRouteName(), 'collections.new', 'remains on the "new collection" page');
      assert.dom('.flash-message').hasText('Failed to save the collection');
      assert.dom('[data-test-errors-for="name"]').hasNoText();
    });
  });

  module('editing a collection', function (hooks) {
    hooks.beforeEach(function () {
      this.collection = this.server.create('collection', { name: 'Original name' });
    });

    test('can edit a collection name', async function (assert) {
      this.server.patch('/api/collections/:id', function ({ collections }, { params }) {
        let collection = collections.find(params.id);
        let attrs = this.normalizedRequestAttrs();
        assert.step(`changing collection name to "${attrs.name}"`);
        collection.update({
          ...attrs,
          slug: dasherize(attrs.name),
        });
        return collection;
      });
      await visit(`/collection/${this.collection.slug}`);
      await click('header [data-test-edit]');
      assert.equal(currentRouteName(), 'collection.edit');

      assert.dom('input[name=name]').hasValue('Original name');
      await fillIn('input[name=name]', 'New name');
      assert.dom('header h1').hasText('Original name', 'collection name is header does not change');
      await click('button[type=submit]');
      assert.verifySteps(['changing collection name to "New name"'], 'hit API to update name with correct value');
      assert.equal(currentURL(), '/collection/new-name', 'redirects to collection page, with updated slug');
    });

    test('displays validation errors inline, not as a flash message', async function (assert) {
      this.server.patch('/api/collections/:id', function () {
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

      await visit(`/collection/${this.collection.slug}/edit`);
      await fillIn('input[name=name]', 'Already-used collection name');
      await click('button[type=submit]');

      assert.equal(currentRouteName(), 'collection.edit', 'remains on the "edit collection" page');
      assert.dom('[data-test-errors-for="name"]').hasText('name - is already taken');
      assert.dom('.flash-message').doesNotExist();
    });

    test('displays errors (other than validation errors) as a flash message', async function (assert) {
      this.server.patch('/api/collections/:id', function () {
        return new Response(500);
      });

      await visit(`/collection/${this.collection.slug}/edit`);
      await fillIn('input[name=name]', 'Collection name');
      await click('button[type=submit]');

      assert.equal(currentRouteName(), 'collection.edit', 'remains on the "edit collection" page');
      assert.dom('.flash-message').hasText('Failed to save the collection');
      assert.dom('[data-test-errors-for="name"]').hasNoText();
    });

    test('does not show Edit icon in header when on edit page', async function (assert) {
      await visit(`/collection/${this.collection.slug}/edit`);
      assert.dom('header [data-test-edit]').doesNotExist();
    });
  });
});
