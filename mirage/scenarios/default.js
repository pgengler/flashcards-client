export default function (server) {
  server.create('collection', {
    name: 'First collection',
    slug: 'first-collection',
  });
  server.create('collection', {
    name: '2nd collection',
    slug: '2nd-collection',
  });
}
