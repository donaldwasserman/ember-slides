import Ember from 'ember';
import layout from '../templates/components/slide-card';

const {
  Component,
  computed,
  guidFor,
  get,
} = Ember;

export default Component.extend({
  layout,

  /**
   * Create a tagless component so by default we don't interfere
   * with the consuming app's layout.
   *
   * @type {String}
   */
  tagName: '',

  /**
   * A provided name for this slide.
   *
   * @type {String|null}
   */
  name: null,

  /**
   * The identifier is a unique identifier for this slide.
   * If not provided, it will default to the guid of this component.
   *
   * @return {String}
   */
  identifier: computed('name', function() {
    return get(this, 'name') || guidFor(this);
  }),

  /**
   * The currently rendered slide. This property is provided
   * by the parent slide deck component.
   *
   * @type {String}
   */
  'current-slide': null,

  /**
   * Is this the currently active slide?
   *
   * @return {Boolean}
   */
  isActive: computed('identifier', 'current-slide', function () {
    return get(this, 'identifier') === get(this, 'current-slide');
  }),

  /**
   * We need to register this slide with the slide deck when it's
   * rendered into the DOM.
   *
   * @return {void}
   */
  didInsertElement() {
    this._super(...arguments);
    this['register-slide'](get(this, 'identifier'));
  },

  /**
   * We need to unregister this slide with the slide deck when it's
   * removed from the DOM.
   *
   * @return {void}
   */
  willDestroyElement() {
    this._super(...arguments);
    this['unregister-slide'](get(this, 'identifier'));
  }
});
