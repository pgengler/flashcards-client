import { dasherize } from '@ember/string';

export default function () {
  this.namespace = 'api';
  this.logging = true;

  this.get('/collections');
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
