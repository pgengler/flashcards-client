import { waitForPromise } from '@ember/test-waiters';

export default function refreshRoute(router) {
  return waitForPromise(router._router._routerMicrolib.refresh()); // eslint-disable-line ember/no-private-routing-service
}
