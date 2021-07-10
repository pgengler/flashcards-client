import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | card set', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('adding a new card set to a collection', async function (assert) {
    await visit(`/collection/${this.collection.slug}/sets/new`);

    assert.dom('button[type=submit]').isDisabled('submit button is disabled initially');
    await fillIn('input[name="name"]', 'New card set');

    assert
      .dom('button[type=submit]')
      .isNotDisabled('submit button is not disabled once all required fields are filled');
    await click('button[type=submit]');

    assert.equal(currentRouteName(), 'collection.sets.show', 'redirects to new set');
  });
});
