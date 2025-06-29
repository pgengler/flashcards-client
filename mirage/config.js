import { dasherize } from '@ember/string';
import { discoverEmberDataModels } from 'ember-cli-mirage';
import { createServer } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    models: {
      ...discoverEmberDataModels(config.store),
      ...config.models,
    },
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
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
    const attrs = this.normalizedRequestAttrs();
    attrs.slug = dasherize(attrs.name);
    let collection = collections.create(attrs);
    return collection;
  });
  this.patch('/collections/:id', function ({ collections }, { params }) {
    let collection = collections.find(params.id);
    let attrs = this.normalizedRequestAttrs();
    attrs.slug = dasherize(attrs.name);
    collection.update(attrs);
    return collection;
  });
  this.del('/collections/:id');
  this.get('/collections/:id');
  this.post('/collections/:id/import', function (schema, request) {
    let collection = schema.collections.find(request.params.id);
    let body = request.requestBody;
    // perform naïve CSV parsing; since this is just a dev-and-test-only handler it doesn't need to be fully robust
    let lines = body.split(/\n/);
    lines.forEach((line) => {
      let [front, back] = line.split(',');
      schema.cards.create({ front, back, collection });
    });

    // Add fake "include" query param so mirage serializes the "cards" relationship along with the collection.
    // This makes the response match what the real backend returns.
    request.queryParams['include'] = 'cards';

    let json = this.serialize(collection);
    json.meta = { cards_imported: lines.length };
    return json;
  });

  this.post('/cards');
  this.get('/cards/:id');
  this.patch('/cards/:id');
  this.delete('/cards/:id');

  this.post('/card-sets');
  this.get('/card-sets/:id');
  this.patch('/card-sets/:id');
  this.del('/card-sets/:id');

  this.namespace = '';
}
