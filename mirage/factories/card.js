import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  front: () => `FRONT: ${faker.lorem.words()}`,
  back: () => `BACK: ${faker.lorem.words()}`,
});
