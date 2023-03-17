/***
 *     ██████  █████  ██████   ██████  ██    ██ ███████ ███████ ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██    ███  ██      ██
 *    ██      ███████ ██████  ██    ██ ██    ██   ███   █████   ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██  ███    ██      ██
 *     ██████ ██   ██ ██   ██  ██████   ██████  ███████ ███████ ███████
 *
 *
 */
/**
 * v-2.0.0
 */
export namespace Carouzel {
  const __version = `2.0.0`;

  const $$ = (str: string) => {
    return document.querySelectorAll(str) || [];
  };

  interface IInstances {
    [key: string]: any;
  }

  interface IBreakpoint {
    minWidth: number | string;
    centerBetween: number;
    enableTouchSwipe: boolean;
    showArrows: boolean;
    showNavigation: boolean;
    slideGutter: number;
    slidesToScroll: number;
    slidesToShow: number;
    verticalHeight: number;
  }

  interface ISettings {
    activeClass: string;
    afterInit?: () => void;
    afterScroll?: () => void;
    animationEffect: string;
    animationSpeed: number;
    appendUrlHash: boolean;
    autoplay: boolean;
    autoplaySpeed: number;
    beforeInit?: () => void;
    beforeScroll?: () => void;
    breakpoints?: IBreakpoint[];
    centerBetween: number;
    disabledClass: string;
    dotIndexClass: string;
    dotTitleClass: string;
    duplicateClass: string;
    easingFunction: string;
    editModeClass: string;
    enableKeyboard: boolean;
    // enableScrollbar: boolean;
    enableTouchSwipe: boolean;
    hiddenClass: string;
    idPrefix: string;
    isInfinite: boolean;
    isRtl: boolean;
    isVertical: boolean;
    nextDirectionClass: string;
    pauseOnHover: boolean;
    previousDirectionClass: string;
    showArrows: boolean;
    showNavigation: boolean;
    slideGutter: number;
    slidesToScroll: number;
    slidesToShow: number;
    startAtIndex: number;
    syncWith: string;
    touchThreshold: number;
    trackUrlHash: boolean;
    useTitlesAsDots: boolean;
    verticalHeight: number;
  }

  interface IEventHandler {
    element: Element | Document | Window;
    remove: () => void;
  }

  interface ICarouzelEasing {
    [key: string]: (t: number) => number;
  }
  /*
   * Easing Functions - inspired from http://gizma.com/easing/
   * only considering the t value for the range [0, 1] => [0, 1]
   */
  const cEasingFunctions: ICarouzelEasing = {
    // no easing, no acceleration
    linear: (t: number) => t,
    // accelerating from zero velocity
    easeInQuad: (t: number) => t * t,
    // decelerating to zero velocity
    easeOutQuad: (t: number) => t * (2 - t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    // accelerating from zero velocity
    easeInCubic: (t: number) => t * t * t,
    // decelerating to zero velocity
    easeOutCubic: (t: number) => --t * t * t + 1,
    // acceleration until halfway, then deceleration
    easeInOutCubic: (t: number) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // accelerating from zero velocity
    easeInQuart: (t: number) => t * t * t * t,
    // decelerating to zero velocity
    easeOutQuart: (t: number) => 1 - --t * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    // accelerating from zero velocity
    easeInQuint: (t: number) => t * t * t * t * t,
    // decelerating to zero velocity
    easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuint: (t: number) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
  };

  const cAnimationDirections = [`previous`, `next`];
  const cAnimationEffects = [`scroll`, `slide`, `fade`];
  const cRootSelectorTypeError = `Element(s) with the provided query do(es) not exist`;
  const cOptionsParseTypeError = `Unable to parse the options string`;
  const cDuplicateBreakpointsTypeError = `Duplicate breakpoints found`;
  const cBreakpointsParseTypeError = `Error parsing breakpoints`;
  const cNoEffectFoundError = `Animation effect function not found in presets. Try using one from (${cAnimationEffects.join(
    `, `
  )}). Setting the animation effect to ${cAnimationEffects[0]}.`;
  const cNoEasingFoundError = `Easing function not found in presets. Try using one from [${Object.keys(
    cEasingFunctions
  ).join(`, `)}]. Setting the easing function to ${
    Object.keys(cEasingFunctions)[0]
  }.`;
  const cUseCapture = false;
  const cSelectors = {
    arrowN: `[data-carouzel-nextarrow]`,
    arrowP: `[data-carouzel-previousarrow]`,
    auto: `[data-carouzel-auto]`,
    cntr: `[data-carouzel-centered]`,
    ctrlW: `[data-carouzel-ctrlWrapper]`,
    curp: `[data-carouzel-currentpage]`,
    dot: `[data-carouzel-dot]`,
    nav: `[data-carouzel-navigation]`,
    navW: `[data-carouzel-navigationwrapper]`,
    opts: `[data-carouzel-options]`,
    pauseBtn: `[data-carouzel-pause]`,
    playBtn: `[data-carouzel-play]`,
    root: `[data-carouzel]`,
    rtl: `[data-carouzel-rtl]`,
    scbar: `[data-carouzel-hasscrollbar]`,
    scbarB: `[data-carouzel-scrollbarthumb]`,
    scbarT: `[data-carouzel-scrollbartrack]`,
    scbarW: `[data-carouzel-scrollbarwrapper]`,
    slide: `[data-carouzel-slide]`,
    stitle: `[data-carouzel-title]`,
    totp: `[data-carouzel-totalpages]`,
    trk: `[data-carouzel-track]`,
    trkM: `[data-carouzel-trackMask]`,
    trkO: `[data-carouzel-trackOuter]`,
    trkW: `[data-carouzel-trackWrapper]`,
    ver: `[data-carouzel-vertical]`
  };
  const cDefaults: ISettings = {
    activeClass: `__carouzel-active`,
    animationEffect: cAnimationEffects[0],
    animationSpeed: 1000,
    appendUrlHash: false,
    autoplay: false,
    autoplaySpeed: 2000,
    breakpoints: [],
    centerBetween: 0,
    disabledClass: `__carouzel-disabled`,
    dotIndexClass: `__carouzel-pageindex`,
    dotTitleClass: `__carouzel-pagetitle`,
    duplicateClass: `__carouzel-duplicate`,
    easingFunction: `linear`,
    editModeClass: `__carouzel-editmode`,
    enableKeyboard: true,
    // enableScrollbar: false,
    enableTouchSwipe: true,
    hiddenClass: `__carouzel-hidden`,
    idPrefix: `__carouzel`,
    isInfinite: true,
    isRtl: false,
    isVertical: false,
    nextDirectionClass: `__carouzel-next`,
    pauseOnHover: false,
    previousDirectionClass: `__carouzel-previous`,
    showArrows: true,
    showNavigation: true,
    slideGutter: 0,
    slidesToScroll: 1,
    slidesToShow: 1,
    startAtIndex: 1,
    syncWith: ``,
    touchThreshold: 125,
    trackUrlHash: false,
    useTitlesAsDots: false,
    verticalHeight: 480
  };

  const allGlobalInstances: IInstances = {};
  const allLocalInstances: IInstances = {};
  let instanceIndex = 0;

  const start = (el: HTMLElement, settings: ISettings) => {
    if (typeof settings.beforeInit === `function`) {
      settings.beforeInit();
    }
  };

  class __slider {
    public element: HTMLElement;
    constructor(el: HTMLElement, settings: ISettings) {
      this.element = el;
      start(el, settings);
    }
    public getInstance() {}
    public goToNext() {}
    public goToPrevious() {}
    public goToSlide() {}
    public destroy() {}
  }

  const instantiate = (el: Node, options: ISettings) => {
    const element = el as HTMLElement;
    const opts = { ...cDefaults, ...options };
    let elementId = element.getAttribute(`id`);

    if (!elementId) {
      elementId = `${
        opts.idPrefix
      }_${new Date().getTime()}_root_${instanceIndex++}`;
      element.setAttribute(`id`, elementId);
    }

    if (!allGlobalInstances[elementId]) {
      allGlobalInstances[elementId] = new __slider(element, opts);
    }

    return allGlobalInstances[elementId];
  };

  const initGlobal = () => {
    $$(cSelectors.auto).forEach((el: Node) => {
      const element = el as HTMLElement;
      let newOptions;
      const optionsDataAttr =
        element.getAttribute(cSelectors.opts.slice(1, -1)) || ``;
      if (optionsDataAttr) {
        try {
          newOptions = JSON.parse(optionsDataAttr.trim().replace(/'/g, `"`));
        } catch (e) {
          console.error(cOptionsParseTypeError);
        }
      } else {
        newOptions = {};
      }
      instantiate(el, newOptions);
    });
  };

  export const init = (selector: string, settings?: ISettings) => {
    const instanceArr: IInstances[] = [];
    $$(selector).forEach((el: Node) => {
      const element = el as HTMLElement;
      instanceArr.push(instantiate(element, settings || ({} as ISettings)));
    });
    return instanceArr;
  };

  export const getVersion = () => {
    return __version;
  };

  initGlobal();
}
