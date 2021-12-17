/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'warn', matchId: 'ember.built-in-components.import' },
    { handler: 'throw', matchId: 'manager-capabilities.modifiers-3-13' },
    { handler: 'throw', matchId: 'ember-global' },
    { handler: 'throw', matchId: 'deprecated-run-loop-and-computed-dot-access' },
  ],
};
