import { get } from '@ember/object';
import type Model from '@ember-data/model';

export default function invalidClass(model: Model, field: string) {
  if (model.errors && get(model.errors, field)) {
    return 'is-invalid';
  }
  return null;
}
