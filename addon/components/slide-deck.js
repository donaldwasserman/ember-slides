import Ember from 'ember';
import layout from '../templates/components/slide-deck';

const {
  A: array,
  Component,
  computed,
  computed: { reads },
  get,
  run: { scheduleOnce },
  set,
} = Ember;

export default Component.extend({
  layout,

  init() {
    this._super(...arguments);
    this.slides = array();
  },

  /**
   * Create a tagless component so by default we don't interfere
   * with the consuming app's layout.
   *
   * @type {String}
   */
  tagName: '',

  /**
   * The names of registered slides.
   *
   * @type {Array<String>}
   */
  slides: null,

  /**
   * When false:
   *   Clicking "prev" on the first slide will stay on that slide.
   *   Clicking "next" on the last slide will stay on that slide.
   * When true:
   *   Clicking "prev" on the first slide will render the last slide.
   *   Clicking "next" on the last slide will render the first slide.
   *
   * @type {Boolean}
   */
  wrap: false,

  /**
   * The name of the current slide.
   *
   * @type {String}
   */
  currentSlide: reads('slides.firstObject'),

  /**
   * The name of the first slide.
   *
   * @type {String}
   */
  firstSlide: reads('slides.firstObject'),

  /**
   * The name of the last slide.
   *
   * @type {String}
   */
  lastSlide: reads('slides.lastObject'),

  /**
   * Is the first slide rendered?
   *
   * @return {Boolean}
   */
  onFirstSlide: computed('currentSlide', 'firstSlide', function() {
    return get(this, 'currentSlide') === get(this, 'firstSlide');
  }),

  /**
   * Is the last slide rendered?
   *
   * @return {Boolean}
   */
  onLastSlide: computed('currentSlide', 'lastSlide', function() {
    return get(this, 'currentSlide') === get(this, 'lastSlide');
  }),

  /**
   * Method that is called when the currently rendered slide is removed.
   *
   * @return {void}
   */
  'current-slide-removed'() {
    this.send('prev');
  },

  actions: {
    /**
     * @param  {String} name
     * @return {void}
     */
    registerSlide(name) {
      get(this, 'slides').pushObject(name);
    },

    /**
     * @param  {String} name
     * @return {void}
     */
    unregisterSlide(name) {
      const currentSlide = get(this, 'currentSlide');

      if (name === currentSlide) {
        scheduleOnce('actions', () => this['current-slide-removed'](this, currentSlide));
      }

      get(this, 'slides').removeObject(name);
    },

    /**
     * Move to the previous slide.
     *
     * @return {void}
     */
    prev() {
      const wrap = get(this, 'wrap');
      const slides = get(this, 'slides');
      const lastSlide = get(this, 'lastSlide');
      const currentSlide = get(this, 'currentSlide');
      const onFirstSlide = get(this, 'onFirstSlide');
      let prevSlideIndex;

      if (onFirstSlide && wrap) {
        prevSlideIndex = slides.indexOf(lastSlide);
      } else if (!onFirstSlide) {
        prevSlideIndex = slides.indexOf(currentSlide) - 1
      } else {
        return;
      }

      set(this, 'currentSlide', slides.objectAt(prevSlideIndex));
    },

    /**
     * Move to the next slide.
     *
     * @return {void}
     */
    next() {
      const wrap = get(this, 'wrap');
      const slides = get(this, 'slides');
      const firstSlide = get(this, 'firstSlide');
      const currentSlide = get(this, 'currentSlide');
      const onLastSlide = get(this, 'onLastSlide');
      let nextSlideIndex;

      if (onLastSlide && wrap) {
        nextSlideIndex = slides.indexOf(firstSlide);
      } else if (!onLastSlide) {
        nextSlideIndex = slides.indexOf(currentSlide) + 1;
      } else {
        return;
      }

      set(this, 'currentSlide', slides.objectAt(nextSlideIndex));
    },

    /**
     * Go to the slide with the given name.
     *
     * @return {void}
     */
    goToSlide(name) {
      const slides = get(this, 'slides');
      const slideIndex = slides.indexOf(name);

      set(this, 'currentSlide', slides.objectAt(slideIndex));
    }
  }
});