import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';

module('Acceptance | card', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.collection = this.server.create('collection');
  });

  test('displays the front of a card initially', async function (assert) {
    let card = this.server.create('card', { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    assert.dom('[data-test-card-front]').hasText(card.front);
  });

  test('can add a new card', async function (assert) {
    assert.expect(4);

    let collectionId = this.collection.id;
    this.server.post('/api/cards', function ({ cards }) {
      let attrs = this.normalizedRequestAttrs();
      assert.equal(
        attrs.front,
        'Front side content',
        'saves with entered front'
      );
      assert.equal(attrs.back, 'Back side content', 'saves with entered back');
      assert.equal(
        attrs.collectionId,
        collectionId,
        'saves to correct collection'
      );

      return cards.create(attrs);
    });
    await visit(`/collection/${this.collection.slug}/card/new`);
    await fillIn('textarea#front', 'Front side content');
    await fillIn('textarea#back', 'Back side content');
    await click('button[type="submit"]');

    assert.equal(
      currentRouteName(),
      'collection.card.show',
      'redirects to show new card'
    );
  });

  test('requires both front and back content to save new card', async function (assert) {
    await visit(`/collection/${this.collection.slug}/card/new`);
    assert
      .dom('button[type="submit"]')
      .isDisabled('submit button is disabled initially');

    await fillIn('textarea#front', 'Front side content');
    assert
      .dom('button[type="submit"]')
      .isDisabled('button remains disabled when only front is filled in');

    await fillIn('textarea#front', '');
    await fillIn('textarea#back', 'Back side content');
    assert
      .dom('button[type="submit"]')
      .isDisabled('button remains disabled when only back is filled in');

    await fillIn('textarea#front', 'Front side content');
    assert
      .dom('button[type="submit"]')
      .isNotDisabled('button is enabled when both sides are filled in');
  });
});
