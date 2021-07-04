import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  front: () => faker.lorem.words(),
  back: () => faker.lorem.words(),
});
