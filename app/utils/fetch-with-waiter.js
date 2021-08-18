import { buildWaiter } from '@ember/test-waiters';

let waiter = buildWaiter('ember-friendz:friend-waiter');

export default async function _fetch() {
  let token = waiter.beginAsync();
  try {
    let response = await fetch(...arguments);
    return response;
  } finally {
    waiter.endAsync(token);
  }
}
