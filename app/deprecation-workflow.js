import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

/**
 * Docs: https://github.com/ember-cli/ember-cli-deprecation-workflow
 */
setupDeprecationWorkflow({
  /**
    false by default, but if a developer / team wants to be more aggressive about being proactive with
    handling their deprecations, this should be set to "true"
  */
  throwOnUnhandled: false,
  workflow: [
    // This seems to be coming from the ember-inspector browser extension.
    // Tests pass in CI (and when running `ember test`) but fail when running via
    // `http://localhost:4200/tests` when the Ember Inspector extension is installed/enabled.
    {
      handler: 'silence',
      matchId: 'deprecate-import-libraries-from-ember',
    },
    // Trying to resolve this deprecation goes down a deep hole of things not working.
    // (Basically, this deprecation isn't actually ready to be deprecated yet.)
    {
      handler: 'silence',
      matchId: 'warp-drive.deprecate-tracking-package',
    },
    {
      handler: 'throw',
      matchId: 'ember-data:deprecate-legacy-imports',
    },
  ],
});
