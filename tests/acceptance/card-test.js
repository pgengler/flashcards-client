import { module, test } from 'qunit';
import { click, currentRouteName, fillIn, triggerKeyEvent, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'flashcards/tests/helpers';
import { Response } from 'miragejs';

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

  test('clicking a card flips it over', async function (assert) {
    let card = this.server.create('card', { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    assert.dom('[data-test-card]').doesNotHaveClass('flipped');

    await click('[data-test-card-front]');
    assert.dom('[data-test-card]').hasClass('flipped');
  });

  test('pressing Space flips a card', async function (assert) {
    let card = this.server.create('card', { collection: this.collection });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    assert.dom('[data-test-card]').doesNotHaveClass('flipped');

    await triggerKeyEvent('[data-test-card-front]', 'keydown', 'Space');
    assert.dom('[data-test-card]').hasClass('flipped');

    await triggerKeyEvent('[data-test-card-front]', 'keydown', 'Space');
    assert.dom('[data-test-card]').doesNotHaveClass('flipped');
  });

  test('editing a card', async function (assert) {
    let card = this.server.create('card', {
      front: 'Front content',
      back: 'Back content',
      collection: this.collection,
    });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    await click('[data-test-edit-button]');

    assert.dom('form[data-test-edit-form]').exists('displays edit form');
    assert.dom('textarea[name=front]').hasValue('Front content');
    assert.dom('textarea[name=back]').hasValue('Back content');
  });

  test('deleting a card', async function (assert) {
    let card = this.server.create('card', { collection: this.collection });

    let deleteRequestMade = false;
    this.server.delete('/api/cards/:id', function ({ cards }, { params }) {
      let c = cards.find(params.id);
      c.destroy();
      deleteRequestMade = true;
      return new Response(204);
    });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    await click('[data-test-edit-button]');
    await click('[data-test-delete-button]');
    assert.ok(deleteRequestMade, 'made API request to delete card');
    assert.equal(currentRouteName(), 'collection.index', 'redirects to collection');
  });

  test('cancelling edits to a card', async function (assert) {
    let card = this.server.create('card', {
      front: 'Front content',
      back: 'Back content',
      collection: this.collection,
    });

    await visit(`/collection/${this.collection.slug}/card/${card.id}`);
    assert.dom('[data-test-card-front]').hasText('Front content');

    await click('[data-test-edit-button]');
    assert.dom('form[data-test-edit-form]').exists('displays edit form');
    await fillIn('textarea[name=front]', 'New content for the front');
    await click('[data-test-cancel-button]');
    assert.dom('form[data-test-edit-form]').doesNotExist('edit form is no longer displayed');
    assert.dom('[data-test-card-front]').hasText('Front content', 'changes were reverted');
  });
});
