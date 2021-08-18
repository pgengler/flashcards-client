import { module, test } from 'qunit';
import { setupRenderingTest } from 'flashcards/tests/helpers';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders card content normally', async function (assert) {
    this.card = {
      front: 'Front side content',
      back: 'Back side content',
    };
    await render(hbs`
      <Card @card={{this.card}} />
    `);

    assert.dom('[data-test-card]').exists();
    assert.dom('.front').hasText('Front side content');
    assert.dom('.back').hasText('Back side content');
  });

  test('clicking "Edit" button enters edit mode', async function (assert) {
    this.card = {
      front: 'Front side content',
      back: 'Back side content',
    };
    await render(hbs`
      <Card @card={{this.card}} />
    `);

    await click('[data-test-edit-button]');
    assert.dom('[data-test-card]').doesNotExist('card is not shown in edit mode');
    assert.dom('[data-test-edit-form]').exists();
    assert.dom('textarea[name=front]').hasValue('Front side content', 'textarea is populated with existing front');
    assert.dom('textarea[name=back]').hasValue('Back side content', 'textarea is populated with existing back');
  });

  test('clicking Cancel button on edit form reverts changes and leaves edit mode', async function (assert) {
    this.card = {
      _rollbackAttributesCalled: false,
      rollbackAttributes() {
        this._rollbackAttributesCalled = true;
      },
    };

    await render(hbs`
      <Card @card={{this.card}} />
    `);

    await click('[data-test-edit-button]');
    assert.dom('[data-test-card]').doesNotExist('card is not shown in edit mode');
    assert.dom('[data-test-edit-form]').exists();
    await click('[data-test-cancel-button]');
    assert.ok(this.card._rollbackAttributesCalled, 'changes were reverted');
    assert.dom('[data-test-edit-form]').doesNotExist('form is no longer shown');
  });
});
