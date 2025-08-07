import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { InvalidError } from '@ember-data/adapter/error';
import { localCopy } from 'tracked-toolbox';
import { on } from '@ember/modifier';
import preventDefault from '../helpers/prevent-default.ts';
import { Input } from '@ember/component';
import invalidClass from '../helpers/invalid-class.ts';
import autofocus from '../modifiers/autofocus.ts';
import validationErrors from '../helpers/validation-errors.ts';

export default class CollectionForm extends Component {
  <template>
    <form {{on "submit" (preventDefault this.save)}}>
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        {{! template-lint-disable no-builtin-form-components }}
        <Input
          id="name"
          name="name"
          class="form-control {{invalidClass @collection 'name'}}"
          @value={{this.name}}
          required
          {{autofocus}}
        />
        {{! template-lint-enable no-builtin-form-components }}
        <div class="invalid-feedback" data-test-errors-for="name">
          {{validationErrors @collection.errors.name}}
        </div>
      </div>

      <div class="row">
        <div class="col d-flex align-items-center">
          <button class="btn btn-primary" type="submit" disabled={{this.submitButtonDisabled}}>
            {{@submitLabel}}
          </button>

          {{yield}}
        </div>
      </div>
    </form>
  </template>
  @service flashMessages;
  @service router;

  @localCopy('args.collection.name') name;

  get submitButtonDisabled() {
    return isEmpty(this.name);
  }

  @action
  async save() {
    let collection = this.args.collection;
    collection.name = this.name;
    if (!collection.name) return;
    try {
      await collection.save();
      this.router.transitionTo('collection', collection.slug);
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the collection');
      }
      console.error(e);
    }
  }
}
