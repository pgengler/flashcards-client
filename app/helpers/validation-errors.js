import { helper } from '@ember/component/helper';

export default helper(function validationErrors([errors]) {
  if (!errors) return null;
  return errors.map((e) => e.message).join(', ');
});
