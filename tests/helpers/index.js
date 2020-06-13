import { setupMirage } from 'ember-cli-mirage/test-support';

import { setupApplicationTest as upstreamSetupApplicationTest } from 'ember-qunit';

export function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);
  setupMirage(hooks);
}
export { setupTest, setupRenderingTest } from 'ember-qunit';
