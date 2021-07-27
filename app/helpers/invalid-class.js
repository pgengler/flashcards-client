import { helper } from '@ember/component/helper';
import { get } from '@ember/object';

export default helper(function invalidClass([model, field]) {
  if (model.errors && get(model.errors, field)) {
    return 'is-invalid';
  }
  return null;
});
