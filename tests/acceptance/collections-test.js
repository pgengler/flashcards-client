import { module, test } from 'qunit';
import { dasherize } from '@ember/string';
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
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
    assert.strictEqual(currentURL(), '/collections/new');
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
    assert.strictEqual(currentURL(), '/collections');
  });

  module('adding a collection', function () {
    test('can create a new collection', async function (assert) {
      await visit('/collections/new');
      await fillIn('input[id="name"]', 'New collection');
      await click('button[type="submit"]');

      assert.strictEqual(currentURL(), `/collection/new-collection`, 'redirects to collection page after creation');
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
          },
        );
      });

      await visit('/collections/new');
      await fillIn('input[name=name]', 'Already-used collection name');
      await click('button[type=submit]');

      assert.strictEqual(currentURL(), '/collections/new', 'remains on the "new collection" page');
      assert.dom('[data-test-errors-for="name"]').hasText('name - is already taken');
      assert.dom('.flash-message.alert-danger').doesNotExist();
    });

    test('displays errors (other than validation errors) as a flash message', async function (assert) {
      this.server.post('/api/collections', function () {
        return new Response(500);
      });

      await visit('/collections/new');
      await fillIn('input[name=name]', 'Collection name');
      await click('button[type=submit]');

      assert.strictEqual(currentURL(), '/collections/new', 'remains on the "new collection" page');
      assert.dom('.flash-message.alert-danger').hasText('Failed to save the collection');
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
      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/edit`);

      assert.dom('input[name=name]').hasValue('Original name');
      await fillIn('input[name=name]', 'New name');
      assert.dom('header h1').hasText('Original name', 'collection name is header does not change');
      await click('button[type=submit]');
      assert.verifySteps(['changing collection name to "New name"'], 'hit API to update name with correct value');
      assert.strictEqual(currentURL(), '/collection/new-name', 'redirects to collection page, with updated slug');
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
          },
        );
      });

      await visit(`/collection/${this.collection.slug}/edit`);
      await fillIn('input[name=name]', 'Already-used collection name');
      await click('button[type=submit]');

      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/edit`,
        'remains on the "edit collection" page',
      );
      assert.dom('[data-test-errors-for="name"]').hasText('name - is already taken');
      assert.dom('.flash-message.alert-danger').doesNotExist();
    });

    test('displays errors (other than validation errors) as a flash message', async function (assert) {
      this.server.patch('/api/collections/:id', function () {
        return new Response(500);
      });

      await visit(`/collection/${this.collection.slug}/edit`);
      await fillIn('input[name=name]', 'Collection name');
      await click('button[type=submit]');

      assert.strictEqual(
        currentURL(),
        `/collection/${this.collection.slug}/edit`,
        'remains on the "edit collection" page',
      );
      assert.dom('.flash-message.alert-danger').hasText('Failed to save the collection');
      assert.dom('[data-test-errors-for="name"]').hasNoText();
    });

    test('does not show Edit icon in header when on edit page', async function (assert) {
      await visit(`/collection/${this.collection.slug}/edit`);
      assert.dom('header [data-test-edit]').doesNotExist();
    });
  });

  module('deleting a collection', function (hooks) {
    hooks.beforeEach(function () {
      this.collection = this.server.create('collection', { name: 'A Collection' });
      this.server.create('collection', { name: 'Another collection' }); // so that collections.index renders instead of redirects

      this._originalWindowConfirm = window.confirm;
      window.confirm = () => true;
    });
    hooks.afterEach(function () {
      window.confirm = this._originalWindowConfirm;
    });

    test('requires confirmation before deleting collection', async function (assert) {
      this.server.del('/api/collections/:id', function ({ collections }, { params }) {
        let collection = collections.find(params.id);
        collection.destroy();
        assert.step('made API request to delete collection');
        return new Response(204);
      });

      window.confirm = () => {
        assert.step('required confirmation to delete collection');
        return true;
      };

      await visit(`/collection/${this.collection.slug}/edit`);
      await click('button[data-test-action="delete"]');
      assert.verifySteps(['required confirmation to delete collection', 'made API request to delete collection']);
    });

    test('does not delete collection is user does not confirm', async function (assert) {
      this.server.del('/api/collections/:id', function () {
        assert.step('made API request to delete collection');
      });

      window.confirm = () => false;

      await visit(`/collection/${this.collection.slug}/edit`);
      await click('button[data-test-action="delete"]');
      assert.verifySteps([], 'should not make API request to delete collection');
      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/edit`, 'remains on "edit" page');
    });

    test('redirects to collections.index after deleting a collection', async function (assert) {
      await visit(`/collection/${this.collection.slug}/edit`);
      await click('button[data-test-action="delete"]');
      assert.strictEqual(currentURL(), '/collections');
    });

    test('shows a flash message after deleting a collection', async function (assert) {
      await visit(`/collection/${this.collection.slug}/edit`);
      await click('button[data-test-action="delete"]');
      assert.dom('.flash-message.alert-success').hasText('Deleted "A Collection"');
    });

    test('shows an error as a flash message if deletion fails', async function (assert) {
      this.server.del('/api/collections/:id', function () {
        return new Response(500);
      });

      await visit(`/collection/${this.collection.slug}/edit`);
      await click('button[data-test-action="delete"]');
      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/edit`, 'remains on "edit" page');
      assert.dom('.flash-message.alert-danger').hasText('Failed to delete "A Collection"');
    });
  });

  module('bulk-importing cards', function (hooks) {
    hooks.beforeEach(function () {
      this.collection = this.server.create('collection', { name: 'A Collection' });
    });

    test('can import cards', async function (assert) {
      this.server.post('/api/collections/:id/import', function (schema, request) {
        assert.step(`imported cards into collection ID ${request.params.id}`);
        // create three new cards and return them to simulate what the real backend does
        let collection = schema.collections.find(request.params.id);
        [
          schema.cards.create({ collection }),
          schema.cards.create({ collection }),
          schema.cards.create({ collection }),
        ].map((c) => c.id);
        collection.reload();
        // Add fake "include" query param so mirage serializes the "cards" relationship along with the collection.
        // This makes the response match what the real backend returns.
        request.queryParams['include'] = 'cards';

        let json = this.serialize(collection);
        json.meta = { cards_imported: 3.14159 };
        return json;
      });

      this.server.createList('card', 5, { collection: this.collection });

      await visit(`/collection/${this.collection.slug}/import`);
      await fillIn('textarea[name="csv"]', 'a,b\nc,d\ne,f');

      let store = this.owner.lookup('service:store');
      assert.strictEqual(store.peekAll('card').length, 5, 'store contains the cards for the collection');
      await click('button[type=submit]');

      assert.verifySteps([`imported cards into collection ID ${this.collection.id}`]);
      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}`, 'redirects to collection page');
      assert
        .dom('.flash-message.alert-success')
        .hasText('Imported 3.14159 cards', 'displays flash message with count returned from backend');
      assert.strictEqual(store.peekAll('card').length, 8, 'new cards are added to the store');
    });

    test('displays a flash message if import fails', async function (assert) {
      this.server.post('/api/collections/:id/import', function () {
        return new Response(500);
      });
      await visit(`/collection/${this.collection.slug}/import`);
      await fillIn('textarea[name="csv"]', 'a,b\nc,d\ne,f');
      await click('button[type=submit]');

      assert.strictEqual(currentURL(), `/collection/${this.collection.slug}/import`, 'remains on import page');
      assert.dom('.flash-message.alert-danger').hasText('Failed to import cards');
    });
  });
});
