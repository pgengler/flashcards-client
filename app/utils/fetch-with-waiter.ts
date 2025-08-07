import { buildWaiter } from '@ember/test-waiters';

let waiter = buildWaiter('flashcards:fetch-waiter');

export default async function _fetch(resource: RequestInfo | URL, options?: RequestInit) {
  let token = waiter.beginAsync();
  try {
    let response = await fetch(resource, options);
    return response;
  } finally {
    waiter.endAsync(token);
  }
}
