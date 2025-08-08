import type { Errors } from '@ember-data/model/-private/errors';

export default function validationErrors(errors: Errors, key: string) {
  if (!errors || !errors.has(key)) return null;
  return errors
    .errorsFor(key)
    .map((e) => e.message)
    .join(', ');
}
