export default function () {
  this.namespace = 'api';
  this.logging = true;

  this.get('/cards');
  this.get('/cards/:id');
}
