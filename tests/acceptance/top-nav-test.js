import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | top nav', function (hooks) {
  setupApplicationTest(hooks);

  test('it lists all collections in a dropdown', async function (assert) {
    this.server.createList('collection', 12);

    await visit('/');
    await click('[data-test-collections-toggle]');
    assert
      .dom('[data-test-collections-menu] [data-test-collection-item]')
      .exists({ count: 12 });
    assert
      .dom('[data-test-collections-menu] [data-test-new-collection-item]')
      .exists('includes a link to create a new collection');
  });

  test('it does not display collection-specific items when not viewing a collection', async function (assert) {
    await visit('/collections/new');

    assert.dom('[data-test-random-card]').doesNotExist();
    assert.dom('[data-test-card-sets]').doesNotExist();
  });

  test('it displays collection-specific items when viewing a collection', async function (assert) {
    let collection = this.server.create('collection');

    await visit(`/collections/${collection.slug}`);

    assert.dom('[data-test-random-card]').exists();
    assert.dom('[data-test-card-sets]').exists();
  });
});
