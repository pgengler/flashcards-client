import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { InvalidError } from '@ember-data/adapter/error';
import { on } from "@ember/modifier";
import preventDefault from "../helpers/prevent-default.ts";
import { Textarea } from "@ember/component";
import invalidClass from "../helpers/invalid-class.ts";
import autofocus from "../modifiers/autofocus.ts";
import validationErrors from "../helpers/validation-errors.ts";

export default class CardForm extends Component {<template><form class="card-form" {{on "submit" (preventDefault this.save)}} ...attributes>
  <div class="container mb-4">
    <div class="row">
      <div class="col">
        <label for="front" class="form-label">Front</label>
        {{!-- template-lint-disable no-builtin-form-components --}}
        <Textarea id="front" name="front" class="form-control {{invalidClass @card "front"}}" @value={{@card.front}} required {{autofocus}} />
        {{!-- template-lint-enable no-builtin-form-components --}}
        <div class="invalid-feedback" data-test-errors-for="front">
          {{validationErrors @card.errors.front}}
        </div>
      </div>

      <div class="col">
        <label for="back" class="form-label">Back</label>
        {{!-- template-lint-disable no-builtin-form-components --}}
        <Textarea @value={{@card.back}} id="back" name="back" class="form-control {{invalidClass @card "back"}}" required />
        {{!-- template-lint-enable no-builtin-form-components --}}
        <div class="invalid-feedback" data-test-errors-for="front">
          {{validationErrors @card.errors.back}}
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col d-flex align-items-center">
      <button type="submit" class="btn btn-primary" disabled={{this.submitButtonDisabled}}>
        {{@submitLabel}}
      </button>

      {{yield}}
    </div>
  </div>
</form></template>
  @service flashMessages;

  get submitButtonDisabled() {
    let card = this.args.card;
    return isEmpty(card.front) || isEmpty(card.back);
  }

  @action
  async save() {
    let card = this.args.card;
    try {
      await card.save();
      this.args.onSave(card);
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new card');
      }
      console.error(e);
    }
  }
}
