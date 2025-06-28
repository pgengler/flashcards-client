import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import { dasherize } from '@ember/string';

export default Factory.extend({
  name: () => faker.lorem.words(),
  slug() {
    return dasherize(this.name);
  },
});
