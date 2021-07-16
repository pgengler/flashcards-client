import ApplicationSerializer from 'flashcards/serializers/application';

export default class CollectionSerializer extends ApplicationSerializer {
  attrs = {
    slug: { serialize: false },
  };
}
