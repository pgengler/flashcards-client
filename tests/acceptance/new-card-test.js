import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | new ard', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('can add a new card', async function (assert) {
    assert.expect(4);

    let collectionId = this.collection.id;
    this.server.post('/api/cards', function ({ cards }) {
      let attrs = this.normalizedRequestAttrs();
      assert.equal(attrs.front, 'Front side content', 'saves with entered front');
      assert.equal(attrs.back, 'Back side content', 'saves with entered back');
      assert.equal(attrs.collectionId, collectionId, 'saves to correct collection');

      return cards.create(attrs);
    });
    await visit(`/collection/${this.collection.slug}/card/new`);
    await fillIn('textarea[name=front]', 'Front side content');
    await fillIn('textarea[name=back]', 'Back side content');
    await click('button[type="submit"]');

    assert.equal(currentRouteName(), 'collection.card.show', 'redirects to show new card');
  });

  test('requires both front and back content to save new card', async function (assert) {
    await visit(`/collection/${this.collection.slug}/card/new`);
    assert.dom('button[type="submit"]').isDisabled('submit button is disabled initially');

    await fillIn('textarea[name=front]', 'Front side content');
    assert.dom('button[type="submit"]').isDisabled('button remains disabled when only front is filled in');

    await fillIn('textarea[name=front]', '');
    await fillIn('textarea[name=back]', 'Back side content');
    assert.dom('button[type="submit"]').isDisabled('button remains disabled when only back is filled in');

    await fillIn('textarea[name=front]', 'Front side content');
    assert.dom('button[type="submit"]').isNotDisabled('button is enabled when both sides are filled in');
  });

  test('when "add another" is checked, saves & resets form instead of redirecting', async function (assert) {
    await visit(`/collection/${this.collection.slug}/card/new`);
    await fillIn('textarea[name=front]', 'Front side content');
    await fillIn('textarea[name=back]', 'Back side content');
    await click('input[name="add-more"]');
    await click('button[type="submit"]');

    assert.equal(currentRouteName(), 'collection.card.new', 'we are still on the new card form');
    assert.dom('textarea[name=front]').hasNoValue('textarea for front is cleared');
    assert.dom('textarea[name=back]').hasNoValue('textarea for back is cleared');
    assert.dom('input[name="add-more"]').isChecked('"add more" checkbox is still checked');
  });
});
