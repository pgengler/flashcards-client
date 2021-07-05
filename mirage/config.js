import { dasherize } from '@ember/string';

export default function () {
  this.namespace = 'api';
  this.logging = true;

  this.get('/collections', function ({ collections }, { queryParams }) {
    let result = collections.all();
    if (queryParams['filter[slug]']) {
      let slug = queryParams['filter[slug]'];
      result = result.filter((collection) => collection.slug === slug);
    }
    return result;
  });
  this.post('/collections', function ({ collections }) {
    let collection = collections.create(this.normalizedRequestAttrs());
    collection.slug = dasherize(collection.name);
    collection.save();
    return collection;
  });
  this.get('/collections/:slug', function ({ collections }, { params }) {
    return collections.findBy({ slug: params.slug });
  });

  this.get('/cards');
  this.post('/cards');
  this.get('/cards/:id');

  this.namespace = '';
}
