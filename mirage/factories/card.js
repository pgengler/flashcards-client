import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  front: () => faker.lorem.words(),
  back: () => faker.lorem.words(),
});
