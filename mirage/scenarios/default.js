export default function (server) {
  let collection = server.create('collection', {
    name: 'First collection',
    slug: 'first-collection',
  });
  server.createList('card', 10, { collection });

  server.create('collection', {
    name: '2nd collection',
    slug: '2nd-collection',
  });
}
