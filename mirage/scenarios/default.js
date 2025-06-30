export default function (server) {
  server.logging = true;

  let collection = server.create('collection', {
    name: 'First collection',
    slug: 'first-collection',
  });
  let cards = server.createList('card', 10, { collection });
  server.create('card-set', {
    collection,
    cards: cards.slice(5),
  });

  server.create('collection', {
    name: '2nd collection',
    slug: '2nd-collection',
  });
}
