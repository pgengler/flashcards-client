import { Factory } from 'ember-cli-mirage';
import faker from 'faker';
import { dasherize } from '@ember/string';

export default Factory.extend({
  name: () => faker.lorem.words(),
  slug() {
    return dasherize(this.name);
  },
});
