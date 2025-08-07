import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('flashcards:fetch-waiter');

export default async function _fetch(resource: RequestInfo | URL, options?: RequestInit) {
  const token = waiter.beginAsync();
  try {
    const response = await fetch(resource, options);
    return response;
  } finally {
    waiter.endAsync(token);
  }
}
