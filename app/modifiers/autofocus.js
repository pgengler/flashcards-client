import { setModifierManager, capabilities } from '@ember/modifier';

export default setModifierManager(
  () => ({
    capabilities: capabilities('3.13', { disableAutoTracking: true }),

    createModifier() {},

    installModifier(_state, element) {
      element.focus();
    },

    updateModifier() {},
    destroyModifier() {},
  }),
  class AutofocusModifier {}
);
