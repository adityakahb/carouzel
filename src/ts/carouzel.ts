/***
 *     ██████  █████  ██████   ██████  ██    ██ ███████ ███████ ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██    ███  ██      ██
 *    ██      ███████ ██████  ██    ██ ██    ██   ███   █████   ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██  ███    ██      ██
 *     ██████ ██   ██ ██   ██  ██████   ██████  ███████ ███████ ███████
 *
 *
 */
namespace Carouzel {
  `use strict`;

  interface IRoot {
    [key: string]: any;
  }

  interface ICoreBreakpoint {
    _2Scroll: number;
    _2Show: number;
    _arrows: boolean;
    _nav: boolean;
    bp: number | string;
    bpSLen: number;
    cntr: number;
    dots: Node[];
    nav: HTMLElement | null;
    gutr: number;
    nDups: Node[];
    pDups: Node[];
    swipe: boolean;
  }

  interface ICoreSettings {
    _2Scroll: number;
    _2Show: number;
    _arrows: boolean;
    _nav: boolean;
    _urlH: boolean;
    activeCls: string;
    aFn?: Function;
    auto: boolean;
    autoS: number;
    bFn?: Function;
    cntr: number;
    disableCls: string;
    dotCls: string;
    dotNcls: string;
    dupCls: string;
    easeFn: string;
    editCls: string;
    effect: string;
    gutr: number;
    hidCls: string;
    idPrefix?: string;
    inf: boolean;
    kb: boolean;
    pauseHov: boolean;
    res: ICoreBreakpoint[];
    rtl: boolean;
    speed: number;
    startAt: number;
    swipe: boolean;
    threshold: number;
    useTitle: boolean;
  }

  interface IBreakpoint {
    atWidth: number | string;
    centerBetween: number;
    enableTouchSwipe: boolean;
    showArrows: boolean;
    showNavigation: boolean;
    slideGutter: number;
    slidesToScroll: number;
    slidesToShow: number;
  }

  interface ISettings {
    activeClass: string;
    afterInitFn?: Function;
    afterScrollFn?: Function;
    animationEffect: string;
    animationSpeed: number;
    appendUrlHash: boolean;
    autoplay: boolean;
    autoplaySpeed: number;
    beforeInitFn?: Function;
    beforeScrollFn?: Function;
    breakpoints?: IBreakpoint[];
    centerBetween: number;
    disabledClass: string;
    dotIndexClass: string;
    dotTitleClass: string;
    duplicateClass: string;
    easingFunction: string;
    editModeClass: string;
    enableKeyboard: boolean;
    enableTouchSwipe: boolean;
    hiddenClass: string;
    idPrefix: string;
    isInfinite: boolean;
    isRTL: boolean;
    pauseOnHover: boolean;
    showArrows: boolean;
    showNavigation: boolean;
    slideGutter: number;
    slidesToScroll: number;
    slidesToShow: number;
    startAtIndex: number;
    touchThreshold: number;
    trackUrlHash: boolean;
    useTitlesAsDots: boolean;
  }

  interface IEventHandler {
    element: Element | Document | Window;
    remove: Function;
  }

  interface IIndexHandler {
    [key: number]: number;
  }

  interface ITimer {
    id: any;
    elapsed: number;
    nextX: number;
    o: number;
    position: number;
    prevX: number;
    progress: number;
    start: number;
    total: number;
  }

  interface ICore {
    _as: NodeListOf<Element>;
    _ds: NodeListOf<Element>;
    _t: ITimer;
    arrowN: HTMLElement | null;
    arrowP: HTMLElement | null;
    autoT: any;
    bpall: ICoreBreakpoint[];
    bPause: HTMLElement | null;
    bPlay: HTMLElement | null;
    bpo_old: ICoreBreakpoint;
    bpo: ICoreBreakpoint;
    ci: number;
    controlsW: HTMLElement | null;
    ct: number;
    eHandlers: any[];
    nav: HTMLElement | null;
    navW: HTMLElement | null;
    opts: ICoreSettings;
    pauseClk: boolean;
    paused: boolean;
    pi: number;
    pts: IIndexHandler;
    root: HTMLElement | null;
    sLen: number;
    sWid: number;
    trk: HTMLElement | null;
    trkM: HTMLElement | null;
    trkO: HTMLElement | null;
    trkW: HTMLElement | null;
  }

  interface ICoreInstance {
    [key: string]: ICore;
  }

  interface ICarouzelEasing {
    [key: string]: Function;
  }

  let allLocalInstances: ICoreInstance = {};
  let isWindowEventAttached = false;
  let windowResizeAny: any;
  let hashSlide: HTMLElement | null;

  /*
   * Easing Functions - inspired from http://gizma.com/easing/
   * only considering the t value for the range [0, 1] => [0, 1]
   */
  const _easingFunctions: ICarouzelEasing = {
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
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
    // elastic bounce effect at the beginning
    easeInElastic: (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
    // elastic bounce effect at the end
    easeOutElastic: (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t),
    // elastic bounce effect at the beginning and end
    easeInOutElastic: (t: number) =>
      (t -= 0.5) < 0
        ? (0.02 + 0.01 / t) * Math.sin(50 * t)
        : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
  };

  const _animationDirections = [`previous`, `next`];
  const _animationEffects = [`scroll`, `fade`];
  const _rootSelectorTypeError = `Element(s) with the provided query do(es) not exist`;
  const _optionsParseTypeError = `Unable to parse the options string`;
  const _duplicateBreakpointsTypeError = `Duplicate breakpoints found`;
  const _breakpointsParseTypeError = `Error parsing breakpoints`;
  const _noEffectFoundError = `Animation effect function not found in presets. Try using one from (${_animationEffects.join(
    ', '
  )}). Setting the animation effect to ${_animationEffects[0]}.`;
  const _noEasingFoundError = `Easing function not found in presets. Try using one from [${Object.keys(
    _easingFunctions
  ).join(', ')}]. Setting the easing function to ${
    Object.keys(_easingFunctions)[0]
  }.`;
  const _useCapture = false;
  const _Selectors = {
    arrowN: `[data-carouzel-nextarrow]`,
    arrowP: `[data-carouzel-previousarrow]`,
    cntr: `[data-carouzel-centered]`,
    controlsW: `[data-carouzel-controlswrapper]`,
    dot: `[data-carouzel-dot]`,
    nav: `[data-carouzel-navigation]`,
    navW: `[data-carouzel-navigationwrapper]`,
    pauseBtn: `[data-carouzel-pause]`,
    playBtn: `[data-carouzel-play]`,
    root: `[data-carouzel]`,
    rootAuto: `[data-carouzel-auto]`,
    rtl: `[data-carouzel-rtl]`,
    slide: `[data-carouzel-slide]`,
    stitle: `[data-carouzel-title]`,
    trk: `[data-carouzel-track]`,
    trkM: `[data-carouzel-trackMask]`,
    trkO: `[data-carouzel-trackOuter]`,
    trkW: `[data-carouzel-trackWrapper]`,
  };
  const _Defaults: ISettings = {
    activeClass: `__carouzel-active`,
    animationEffect: _animationEffects[0],
    animationSpeed: 500,
    appendUrlHash: false,
    autoplay: false,
    autoplaySpeed: 5000,
    breakpoints: [],
    centerBetween: 0,
    disabledClass: `__carouzel-disabled`,
    dotIndexClass: `__carouzel-pageindex`,
    dotTitleClass: `__carouzel-pagetitle`,
    duplicateClass: `__carouzel-duplicate`,
    easingFunction: `linear`,
    editModeClass: `__carouzel-editmode`,
    enableKeyboard: true,
    enableTouchSwipe: true,
    hiddenClass: `__carouzel-hidden`,
    idPrefix: `__carouzel`,
    isInfinite: true,
    isRTL: false,
    pauseOnHover: false,
    showArrows: true,
    showNavigation: true,
    slideGutter: 0,
    slidesToScroll: 1,
    slidesToShow: 1,
    startAtIndex: 1,
    touchThreshold: 125,
    trackUrlHash: false,
    useTitlesAsDots: false,
  };

  /**
   * Function to trim whitespaces from a string
   *
   * @param str - The string which needs to be trimmed
   *
   * @returns The trimmed string.
   *
   */
  const stringTrim = (str: string) => {
    return str.replace(/^\s+|\s+$|\s+(?=\s)/g, ``);
  };

  /**
   * Function to check wheather an element has a string in its class attribute
   *
   * @param element - An HTML Element
   * @param cls - A string
   *
   * @returns `true` if the string exists in class attribute, otherwise `false`
   *
   */
  const hasClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      const clsarr = element.className.split(` `);
      return clsarr.indexOf(cls) > -1 ? true : false;
    }

    return false;
  };

  /**
   * Function to add a string to an element`s class attribute
   *
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const addClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      let clsarr = cls.split(` `);
      let clsarrLength = clsarr.length;
      for (let i = 0; i < clsarrLength; i++) {
        let thiscls = clsarr[i];
        if (!hasClass(element, thiscls)) {
          element.className += ` ` + thiscls;
        }
      }
      element.className = stringTrim(element.className);
    }
  };

  /**
   * Function to remove a string from an element`s class attribute
   *
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const removeClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      let clsarr = cls.split(` `);
      let curclass = element.className.split(` `);
      let curclassLen = curclass.length;
      for (let i = 0; i < curclassLen; i++) {
        let thiscls = curclass[i];
        if (clsarr.indexOf(thiscls) > -1) {
          curclass.splice(i, 1);
          i--;
        }
      }
      element.className = stringTrim(curclass.join(` `));
    }
  };

  /**
   * Function to fix the decimal places to 4
   *
   * @param num - A number
   *
   * @returns A string converted by applying toFixed function with decimal places 4
   *
   */
  const toFixed4 = (num: number) => {
    return num.toFixed(4);
  };

  /**
   * Function to apply the settings to all the instances w.r.t. applicable breakpoint
   *
   */
  const winResizeFn = () => {
    if (typeof windowResizeAny !== `undefined`) {
      clearTimeout(windowResizeAny);
    }
    windowResizeAny = setTimeout(() => {
      for (let e in allLocalInstances) {
        if (allLocalInstances.hasOwnProperty(e)) {
          applyLayout(allLocalInstances[e], false);
        }
      }
    }, 0);
  };

  /**
   * Function to return the number of Instances created
   *
   */
  const getCoreInstancesLength = () => {
    return Object.keys(allLocalInstances).length;
  };

  /**
   * Function to remove all local events assigned to the navigation elements.
   *
   * @param core - Carouzel instance core object
   * @param element - An HTML Element from which the events need to be removed
   *
   */
  const removeEventListeners = (
    core: any,
    element: Element | Document | Window
  ) => {
    let j = core.eHandlers.length;
    while (j--) {
      if (
        core.eHandlers[j].element.isEqualNode &&
        core.eHandlers[j].element.isEqualNode(element)
      ) {
        core.eHandlers[j].remove();
        core.eHandlers.splice(j, 1);
      }
    }
  };

  /**
   * Function to remove all local events assigned to the navigation elements.
   *
   * @param element - An HTML Element which needs to be assigned an event
   * @param type - Event type
   * @param listener - The Event handler function
   *
   * @returns The event handler object
   *
   */
  const eventHandler = (
    element: Element | Document | Window,
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => {
    const eventHandler: IEventHandler = {
      element: element,
      remove: () => {
        element.removeEventListener(type, listener, _useCapture);
      },
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandler;
  };

  /**
   * Function to take care of active slides before and after animation
   *
   * @param core - Carouzel instance core object
   *
   */
  const manageActiveSlides = (core: ICore) => {
    let x: number | null = null;
    for (let i = 0; i < core._as.length; i++) {
      if (core._as[i]) {
        removeClass(core._as[i] as Element, core.opts.activeCls);
        core._as[i].setAttribute(`aria-hidden`, `true`);
      }
    }
    for (
      let i = core.ci + core.bpo.pDups.length;
      i < core.ci + core.bpo.pDups.length + core.bpo._2Show;
      i++
    ) {
      if (core.opts.rtl) {
        x = core.ci + core.bpo.pDups.length + core.bpo._2Show - i - 1;
        if (core._as[x]) {
          addClass(core._as[x] as Element, core.opts.activeCls);
          core._as[x].removeAttribute(`aria-hidden`);
        }
        x = null;
      } else {
        x = null;
        if (core._as[i]) {
          addClass(core._as[i] as Element, core.opts.activeCls);
          core._as[i].removeAttribute(`aria-hidden`);
        }
      }
    }
  };

  /**
   * Function to update CSS classes on all respective elements
   *
   * @param core - Carouzel instance core object
   *
   */
  const updateAttributes = (core: ICore) => {
    let x;
    if (!core.opts.inf && core.ci === 0) {
      addClass(core.arrowP as Element, core.opts.disableCls || ``);
    } else {
      removeClass(core.arrowP as Element, core.opts.disableCls || ``);
    }
    if (!core.opts.inf && core.ci === core.sLen - core.bpo._2Show) {
      addClass(core.arrowN as Element, core.opts.disableCls || ``);
    } else {
      removeClass(core.arrowN as Element, core.opts.disableCls || ``);
    }
    if (core.bpo.dots.length > 0) {
      for (let i = 0; i < core.bpo.dots.length; i++) {
        removeClass(core.bpo.dots[i] as Element, core.opts.activeCls);
      }
      x = Math.floor(core.ci / core.bpo._2Scroll);
      if (core.opts.rtl) {
        x = core.bpo.dots.length - x - 1;
      }
      if (x < 0) {
        x = core.bpo.dots.length - 1;
      }
      if (x >= core.bpo.dots.length) {
        x = 0;
      }
      if (core.bpo.dots[x]) {
        addClass(
          core.bpo.dots[x] as HTMLElement as Element,
          core.opts.activeCls
        );
      }
    }
  };

  /**
   * Function to animate the track element based on the calculations
   *
   * @param core - Carouzel instance core object
   *
   */
  const animateTrack = (core: ICore, touchedPixel?: number) => {
    touchedPixel = touchedPixel ? touchedPixel : 0;
    if (typeof core.opts.bFn === `function`) {
      core.opts.bFn();
    }

    if (!core.pi) {
      core.pi = 0;
    }

    if (core.opts.inf && core.trk) {
      core.trk.style.transform = `translate3d(${-core.pts[core.pi]}px, 0, 0)`;
    } else {
      if (core.ci < 0) {
        core.ci = 0;
      }
      if (core.ci + core.bpo._2Show >= core.sLen) {
        core.ci = core.sLen - core.bpo._2Show;
      }
    }

    /**
     * Local function to perform post operations after slide animation
     *
     */
    const postAnimation = () => {
      if (core.ci >= core.sLen) {
        core.ci = core.sLen - core.ci;
      }
      if (core.ci < 0) {
        core.ci = core.sLen + core.ci;
      }
      if (core.trk) {
        core.trk.style.transform = `translate3d(${-core.pts[core.ci]}px, 0, 0)`;
      }
      core.ct = -core._t.nextX;
      // updateAttributes(core);
      manageActiveSlides(core);
      setTimeout(() => {
        if (core.opts._urlH && core.root) {
          hashSlide = core.root.querySelector(`.${core.opts.activeCls}`);
          if (hashSlide && window?.location) {
            window.location.hash = hashSlide.getAttribute(`id`) || ``;
          }
          hashSlide = null;
        }
        if (typeof core.opts.aFn === `function`) {
          core.opts.aFn();
        }
      }, 0);
    };

    manageActiveSlides(core);
    updateAttributes(core);

    core._t.start = (performance as Performance)
      ? performance.now()
      : Date.now();
    core._t.prevX = core.pts[core.pi];
    core._t.nextX = core.pts[core.ci];

    /**
     * Local function to perform scroll animation
     *
     */
    const scrollThisTrack = (now: number) => {
      core._t.elapsed = now - core._t.start;
      core._t.progress = _easingFunctions[core.opts.easeFn](
        core._t.elapsed / core._t.total
      );

      if (core.ci > core.pi) {
        core._t.position =
          core._t.prevX +
          (touchedPixel ? touchedPixel : 0) +
          core._t.progress * (core._t.nextX - core._t.prevX);
        if (core._t.position > core._t.nextX) {
          core._t.position = core._t.nextX;
        }
      }
      if (core.ci < core.pi) {
        core._t.position =
          core._t.prevX +
          (touchedPixel ? touchedPixel : 0) -
          core._t.progress * (core._t.prevX - core._t.nextX);
        if (core._t.position < core.pts[core.ci]) {
          core._t.position = core.pts[core.ci];
        }
      }

      if (core._t.position && core.trk) {
        core._t.position = Math.round(core._t.position);
        core.trk.style.transform = `translate3d(${-core._t.position}px, 0, 0)`;
      }
      if (core._t.progress < 1 && core._t.position !== core.pts[core.ci]) {
        core._t.id = requestAnimationFrame(scrollThisTrack);
      } else {
        postAnimation();
      }
    };

    if (core.opts.effect === _animationEffects[0] && core.trk) {
      if (core._t.start && core._t.total && core.ci !== core.pi) {
        core._t.id = requestAnimationFrame(scrollThisTrack);
      }
    }

    /**
     * Local function to perform fade animation
     *
     */
    const fadeThisTrack = (now: number) => {
      core._t.elapsed = now - core._t.start;
      core._t.progress = _easingFunctions[core.opts.easeFn](
        core._t.elapsed / core._t.total
      );
      core._t.progress = core._t.progress > 1 ? 1 : core._t.progress;
      for (let i = 0; i < core._as.length; i++) {
        if (i < core.ci + core.bpo._2Show && core.pi < core.ci) {
          (core._as[i] as HTMLElement).style.visibility = `visible`;
        }
        if (i > core.ci + core.bpo._2Show && core.pi > core.ci) {
          (core._as[i] as HTMLElement).style.visibility = `visible`;
        }
        if (hasClass(core._as[i], core.opts.activeCls)) {
          (core._as[i] as HTMLElement).style.opacity = `` + core._t.progress;
        } else {
          (core._as[i] as HTMLElement).style.opacity =
            `` + (1 - core._t.progress);
        }
      }
      if (core._t.progress < 1) {
        core._t.id = requestAnimationFrame(fadeThisTrack);
      } else {
        postAnimation();
        for (let i = 0; i < core._as.length; i++) {
          (core._as[i] as HTMLElement).style.transform = `translate3d(0, 0, 0)`;
          if (hasClass(core._as[i], core.opts.activeCls)) {
            (core._as[i] as HTMLElement).style.opacity = `1`;
          } else {
            (core._as[i] as HTMLElement).style.visibility = `hidden`;
            (core._as[i] as HTMLElement).style.opacity = `0`;
          }
        }
      }
    };

    if (core.opts.effect === _animationEffects[1] && core.trk) {
      core.trk.style.transform = `translate3d(${-core._t.nextX}px, 0, 0)`;
      for (let i = 0; i < core._as.length; i++) {
        if (hasClass(core._as[i], core.opts.activeCls)) {
          (core._as[i] as HTMLElement).style.visibility = `visible`;
          (core._as[i] as HTMLElement).style.opacity = `1`;
          (core._as[i] as HTMLElement).style.transform = `translate3d(0, 0, 0)`;
        } else {
          (core._as[i] as HTMLElement).style.visibility = `hidden`;
          (core._as[i] as HTMLElement).style.opacity = `0`;
          if (i < core.ci + core.bpo._2Show) {
            (core._as[i] as HTMLElement).style.transform = `translate3d(${
              core.pts[0] - core.bpo.gutr
            }px, 0, 0)`;
          }
          if (i > core.ci + core.bpo._2Show) {
            (core._as[i] as HTMLElement).style.transform = `translate3d(${-(
              core.pts[0] - core.bpo.gutr
            )}px, 0, 0)`;
          }
        }
      }
      if (core._t.start && core._t.total && core.ci !== core.pi) {
        core._t.id = requestAnimationFrame(fadeThisTrack);
      }
    }
  };

  /**
   * Function to prepend the duplicate or new elements in the track
   *
   * @param parent - Track element in which duplicates need to be prepended
   * @param child - The child element to be prepended
   *
   */
  const doInsertBefore = (parent: Element, child: Node) => {
    const first = parent.querySelectorAll(_Selectors.slide)[0];
    if (first) {
      parent.insertBefore(child, first);
    }
  };

  /**
   * Function to append the duplicate or new elements in the track
   *
   * @param parent - Track element in which duplicates need to be prepended
   * @param child - The child element to be prepended
   *
   */
  const doInsertAfter = (parent: Element, child: Node) => {
    parent.appendChild(child);
  };

  /**
   * Function to manage the duplicate slides in the track based on the breakpoint
   *
   * @param track - Track element in which duplicates need to be deleted and inserted
   * @param bpo - The appropriate breakpoint based on the device width
   * @param duplicateClass - the class name associated with duplicate elements
   *
   */
  const manageDuplicates = (
    track: HTMLElement,
    bpo: ICoreBreakpoint,
    duplicateClass: string
  ) => {
    let duplicates = track.querySelectorAll(`.` + duplicateClass);
    for (let i = 0; i < duplicates.length; i++) {
      track.removeChild(duplicates[i]);
    }
    for (let i = bpo.pDups.length - 1; i >= 0; i--) {
      doInsertBefore(track, bpo.pDups[i]);
    }
    for (let i = 0; i < bpo.nDups.length; i++) {
      doInsertAfter(track, bpo.nDups[i]);
    }
  };

  /**
   * Function to find and apply the appropriate breakpoint settings based on the viewport
   *
   * @param core - Carouzel instance core object
   *
   */
  const applyLayout = (core: ICore, isRTLFirstLoad: boolean) => {
    let viewportWidth = window?.innerWidth;
    let bpoptions = core.bpall[0];
    let len = 0;
    let slideWidth = 0;
    let trkWidth = 0;
    let temp = 0;

    while (len < core.bpall.length) {
      if (
        (core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) ||
        typeof core.bpall[len + 1] === `undefined`
      ) {
        bpoptions = core.bpall[len];
        break;
      }
      len++;
    }
    if (
      core.root &&
      !hasClass(core.root, core.opts.editCls) &&
      (core.bpo_old || {})._2Show !== bpoptions._2Show &&
      core.trk
    ) {
      manageDuplicates(core.trk, bpoptions, core.opts.dupCls || ``);
    }
    if ((core.bpo_old || {}).bp !== bpoptions.bp) {
      core.bpo = bpoptions;
      core.bpo_old = bpoptions;
    }

    if (core.nav) {
      let dots = core.nav.querySelectorAll(_Selectors.dot);
      for (let i = 0; i < dots.length; i++) {
        core.nav.removeChild(dots[i]);
      }
      for (let i = 0; i < bpoptions.dots.length; i++) {
        core.nav.appendChild(bpoptions.dots[i]);
      }
    }
    if (!bpoptions._arrows && core.controlsW) {
      addClass(core.controlsW, core.opts.hidCls);
    } else if (core.controlsW) {
      removeClass(core.controlsW, core.opts.hidCls);
    }
    if (!bpoptions._nav && core.navW) {
      addClass(core.navW, core.opts.hidCls);
    } else if (core.navW) {
      removeClass(core.navW, core.opts.hidCls);
    }
    if (isRTLFirstLoad) {
      core.ci = core.opts.startAt = core.sLen - bpoptions._2Scroll;
    }
    if (core.root && core.trkW && core.trkO && core.trk) {
      core.pts = {};
      slideWidth =
        (core.trkW.clientWidth - (bpoptions._2Show - 1) * bpoptions.gutr) /
        (bpoptions._2Show + bpoptions.cntr);
      core.sWid = slideWidth;
      temp =
        core.sLen >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show;
      trkWidth = slideWidth * temp + bpoptions.gutr * (temp + 1);
      core.trk.style.width = toFixed4(trkWidth) + `px`;
      core.trkO.style.width =
        toFixed4(
          bpoptions._2Show * slideWidth +
            bpoptions.gutr * (bpoptions._2Show - 1)
        ) + `px`;
      core._as = core.trkO.querySelectorAll(_Selectors.slide);
      for (let i = 0; i < core._as.length; i++) {
        (core._as[i] as HTMLElement).style.width = toFixed4(slideWidth) + `px`;
        if (i === 0) {
          (core._as[i] as HTMLElement).style.marginLeft =
            toFixed4(bpoptions.gutr) + `px`;
          (core._as[i] as HTMLElement).style.marginRight =
            toFixed4(bpoptions.gutr / 2) + `px`;
        } else if (i === core._as.length - 1) {
          (core._as[i] as HTMLElement).style.marginLeft =
            toFixed4(bpoptions.gutr / 2) + `px`;
          (core._as[i] as HTMLElement).style.marginRight =
            toFixed4(bpoptions.gutr) + `px`;
        } else {
          (core._as[i] as HTMLElement).style.marginLeft =
            toFixed4(bpoptions.gutr / 2) + `px`;
          (core._as[i] as HTMLElement).style.marginRight =
            toFixed4(bpoptions.gutr / 2) + `px`;
        }
      }
      for (let i = bpoptions.pDups.length; i > 0; i--) {
        core.pts[-i] =
          (-i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
          bpoptions.gutr;
      }
      for (let i = 0; i < core.sLen; i++) {
        core.pts[i] =
          (i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
          bpoptions.gutr;
      }
      for (let i = core.sLen; i < core.sLen + bpoptions.nDups.length; i++) {
        core.pts[i] =
          (i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
          bpoptions.gutr;
      }
      animateTrack(core);
    }
  };

  /**
   * Function to go to the specific slide number
   *
   * @param core - Carouzel instance core object
   * @param slidenumber - Slide index to which the carouzel should be scrolled to
   *
   */
  const go2Slide = (core: ICore, slidenumber: number) => {
    if (core.ci !== slidenumber) {
      if (slidenumber >= core._ds.length) {
        slidenumber = core._ds.length - 1;
      } else if (slidenumber <= -1) {
        slidenumber = 0;
      }
      core.pi = core.ci;
      core.ci = slidenumber * core.bpo._2Scroll;
      if (core._t.id) {
        cancelAnimationFrame(core._t.id);
      }
      animateTrack(core);
    }
  };

  /**
   * Function to go to the previous set of slides
   *
   * @param core - Carouzel instance core object
   *
   */
  const go2Prev = (core: ICore, touchedPixel?: number) => {
    core.pi = core.ci;
    core.ci -= core.bpo._2Scroll;
    if (core._t.id) {
      cancelAnimationFrame(core._t.id);
    }
    if (core.opts.inf) {
      if (typeof core.pts[core.ci] === `undefined`) {
        core.pi =
          core.sLen -
          (core.sLen % core.bpo._2Scroll > 0
            ? core.sLen % core.bpo._2Scroll
            : core.bpo._2Scroll);
        core.ci = core.pi - core.bpo._2Scroll;
      } else {
        core.pi = core.ci + core.bpo._2Scroll;
      }
    }
    animateTrack(core, touchedPixel);
  };

  /**
   * Function to go to the next set of slides
   *
   * @param core - Carouzel instance core object
   *
   */
  const go2Next = (core: ICore, touchedPixel?: number) => {
    core.pi = core.ci;
    core.ci += core.bpo._2Scroll;
    if (core._t.id) {
      cancelAnimationFrame(core._t.id);
    }
    if (core.opts.inf) {
      if (typeof core.pts[core.ci + core.bpo._2Show] === `undefined`) {
        core.pi = core.pi - core.sLen;
        core.ci = 0;
      } else {
        core.pi = core.ci - core.bpo._2Scroll;
      }
    }
    animateTrack(core, touchedPixel);
  };

  /**
   * Function to toggle keyboard navigation with left and right arrows
   *
   * @param core - Carouzel instance core object
   *
   */
  const toggleKeyboard = (core: ICore) => {
    if (core.root && core.opts.kb) {
      core.root.setAttribute(`tabindex`, `-1`);
      let keyCode = ``;
      core.eHandlers.push(
        eventHandler(core.root, `keydown`, function (event: Event) {
          event = event || window?.event;
          keyCode = (event as KeyboardEvent).key.toLowerCase();
          switch (keyCode) {
            case `arrowleft`:
              go2Prev(core, 0);
              break;
            case `arrowright`:
              go2Next(core, 0);
              break;
            default:
              break;
          }
        })
      );
    }
  };

  /**
   * Function to toggle Play and Pause buttons when autoplaying carouzel is played or paused
   *
   * @param core - Carouzel instance core object
   * @param shouldPlay - A boolean value determining if the carouzel is being played or is paused
   *
   */
  const togglePlayPause = (core: ICore, shouldPlay: boolean) => {
    if (core && core.bPause && core.bPlay) {
      if (shouldPlay) {
        addClass(core.bPlay, core.opts.hidCls);
        removeClass(core.bPause, core.opts.hidCls);
      } else {
        addClass(core.bPause, core.opts.hidCls);
        removeClass(core.bPlay, core.opts.hidCls);
      }
    }
  };

  /**
   * Function to toggle Autoplay and pause on hover functionalities for the carouzel
   *
   * @param core - Carouzel instance core object
   *
   */
  const toggleAutoplay = (core: ICore) => {
    if (core.root && core.opts.pauseHov) {
      core.eHandlers.push(
        eventHandler(core.root, `mouseenter`, function () {
          core.paused = true;
          togglePlayPause(core, false);
        })
      );
      core.eHandlers.push(
        eventHandler(core.root, `mouseleave`, function () {
          core.paused = false;
          togglePlayPause(core, true);
        })
      );
    }
    if (!core.opts.pauseHov) {
      core.paused = false;
    }
    core.autoT = setInterval(() => {
      if (!core.paused && !core.pauseClk) {
        go2Next(core, 0);
      }
    }, core.opts.autoS);
  };

  /**
   * Function to add click events to the arrows
   *
   * @param core - Carouzel instance core object
   *
   */
  const toggleControlButtons = (core: ICore) => {
    if (core.arrowP) {
      core.eHandlers.push(
        eventHandler(core.arrowP, `click`, (event: Event) => {
          event.preventDefault();
          go2Prev(core, 0);
        })
      );
    }
    if (core.arrowN) {
      core.eHandlers.push(
        eventHandler(core.arrowN, `click`, (event: Event) => {
          event.preventDefault();
          go2Next(core, 0);
        })
      );
    }
    if (core.opts.inf && core.bPause) {
      core.eHandlers.push(
        eventHandler(core.bPause, `click`, (event: Event) => {
          event.preventDefault();
          core.pauseClk = true;
          togglePlayPause(core, false);
        })
      );
    }
    if (core.opts.inf && core.bPlay) {
      core.eHandlers.push(
        eventHandler(core.bPlay, `click`, (event: Event) => {
          event.preventDefault();
          core.pauseClk = false;
          togglePlayPause(core, true);
        })
      );
    }
  };

  /**
   * Function to add touch events to the track
   *
   * @param core - Carouzel instance core object
   *
   */
  const toggleTouchEvents = (core: ICore) => {
    let diffX = 0;
    let diffY = 0;
    let dragging = false;
    let endX = 0;
    let endY = 0;
    let posFinal = 0;
    let posX1 = 0;
    let posX2 = 0;
    let ratioX = 0;
    let ratioY = 0;
    let startX = 0;
    let startY = 0;
    let threshold = core.opts.threshold || 100;
    let canFiniteAnimate = false;

    /**
     * Function to be triggered when the carouzel is touched the cursor is down on it
     *
     */
    const touchStart = (e: Event) => {
      dragging = true;
      if (e.type === `touchstart`) {
        startX = (e as TouchEvent).changedTouches[0].screenX;
        startY = (e as TouchEvent).changedTouches[0].screenY;
        posX1 = (e as TouchEvent).changedTouches[0].screenX;
      } else {
        startX = (e as MouseEvent).clientX;
        startY = (e as MouseEvent).clientY;
        posX1 = (e as MouseEvent).clientX;
      }
    };

    /**
     * Function to be triggered when the carouzel is dragged through touch or cursor
     *
     */
    const touchMove = (e: Event) => {
      if (dragging) {
        if (e.type === `touchmove`) {
          endX = (e as TouchEvent).changedTouches[0].screenX;
          endY = (e as TouchEvent).changedTouches[0].screenY;
          posX2 = posX1 - (e as TouchEvent).changedTouches[0].screenX;
        } else {
          endX = (e as MouseEvent).clientX;
          endY = (e as MouseEvent).clientY;
          posX2 = posX1 - (e as MouseEvent).clientX;
        }
        diffX = endX - startX;
        diffY = endY - startY;
        ratioX = Math.abs(diffX / diffY);
        ratioY = Math.abs(diffY / diffX);

        if (!core.ct) {
          core.ct = -core.pts[core.ci];
        }
        if (ratioX > ratioY) {
          if (core.trk && core.opts.effect === _animationEffects[0]) {
            core.trk.style.transform = `translate3d(${
              core.ct - posX2
            }px, 0, 0)`;
          }
          if (core.trk && core.opts.effect === _animationEffects[1]) {
            for (let k = 0; k < core._as.length; k++) {
              (core._as[k] as HTMLElement).style.opacity = `1`;
            }
          }
        }
        posFinal = posX2;
      }
    };

    /**
     * Function to be triggered when the touch is ended or cursor is released
     *
     */
    const touchEnd = (e: Event) => {
      if (dragging && core.trk) {
        if (e.type === `touchend`) {
          endX = (e as TouchEvent).changedTouches[0].screenX;
          endY = (e as TouchEvent).changedTouches[0].screenY;
        } else {
          endX = (e as MouseEvent).clientX;
          endY = (e as MouseEvent).clientY;
        }
        diffX = endX - startX;
        diffY = endY - startY;
        ratioX = Math.abs(diffX / diffY);
        ratioY = Math.abs(diffY / diffX);

        if (
          !isNaN(ratioX) &&
          !isNaN(ratioY) &&
          ratioY !== Infinity &&
          ratioX !== Infinity &&
          ratioX !== ratioY
        ) {
          canFiniteAnimate = false;
          if (!core.opts.inf) {
            if (diffX > 0) {
              if (Math.abs(core.ct) <= 0) {
                core.trk.style.transform = `translate3d(${core.ct}px, 0, 0)`;
              } else {
                canFiniteAnimate = true;
              }
            } else if (diffX < 0) {
              if (
                Math.abs(core.ct) + core.sWid * core.bpo._2Show >=
                core.sWid * core._as.length
              ) {
                core.trk.style.transform = `translate3d(${core.ct}px, 0, 0)`;
              } else {
                canFiniteAnimate = true;
              }
            }
          }
          if (core.opts.effect === _animationEffects[1]) {
            for (let k = 0; k < core._as.length; k++) {
              (core._as[k] as HTMLElement).style.opacity = `0`;
            }
          }
          if (posFinal < -threshold) {
            if (
              core.opts.effect === _animationEffects[0] &&
              (canFiniteAnimate || core.opts.inf)
            ) {
              go2Prev(core, posFinal);
            }
            if (
              core.opts.effect === _animationEffects[1] &&
              (canFiniteAnimate || core.opts.inf)
            ) {
              go2Prev(core, 1);
            }
          } else if (posFinal > threshold) {
            if (
              core.opts.effect === _animationEffects[0] &&
              (canFiniteAnimate || core.opts.inf)
            ) {
              go2Next(core, posFinal);
            }
            if (
              core.opts.effect === _animationEffects[1] &&
              (canFiniteAnimate || core.opts.inf)
            ) {
              go2Next(core, 1);
            }
          } else {
            if (core.opts.effect === _animationEffects[0]) {
              core.trk.style.transform = `translate3d(${core.ct}px, 0, 0)`;
            }
            if (core.opts.effect === _animationEffects[1]) {
              for (let k = 0; k < core._as.length; k++) {
                (core._as[k] as HTMLElement).style.opacity = `1`;
              }
            }
          }
        }
        posX1 = posX2 = posFinal = 0;
        dragging = false;
      }
    };

    core.eHandlers.push(
      eventHandler(
        core.trk as HTMLElement,
        `touchstart`,
        function (event: Event) {
          touchStart(event);
        }
      )
    );
    core.eHandlers.push(
      eventHandler(
        core.trk as HTMLElement,
        `touchmove`,
        function (event: Event) {
          touchMove(event);
        }
      )
    );
    core.eHandlers.push(
      eventHandler(core.trk as HTMLElement, `touchend`, function (e: Event) {
        touchEnd(e);
      })
    );
    core.eHandlers.push(
      eventHandler(
        core.trk as HTMLElement,
        `mousedown`,
        function (event: Event) {
          touchStart(event);
        }
      )
    );
    core.eHandlers.push(
      eventHandler(core.trk as HTMLElement, `mouseup`, function (e: Event) {
        touchEnd(e);
      })
    );
    core.eHandlers.push(
      eventHandler(core.trk as HTMLElement, `mouseleave`, function (e: Event) {
        touchEnd(e);
      })
    );
    core.eHandlers.push(
      eventHandler(
        core.trk as HTMLElement,
        `mousemove`,
        function (event: Event) {
          touchMove(event);
        }
      )
    );
  };

  /**
   * Function to generate duplicate elements and dot navigation before hand for all breakpoints
   *
   * @param core - Carouzel instance core object
   *
   */
  const generateElements = (core: ICore) => {
    for (let i = 0; i < core.bpall.length; i++) {
      core.bpall[i].bpSLen = core.sLen;
      if (core.opts.inf) {
        for (
          let j =
            core.sLen -
            core.bpall[i]._2Show -
            Math.ceil(core.bpall[i].cntr / 2);
          j < core.sLen;
          j++
        ) {
          if (core._ds[j]) {
            let elem = core._ds[j].cloneNode(true);
            addClass(elem as Element, core.opts.dupCls || ``);
            core.bpall[i].bpSLen++;
            core.bpall[i].pDups.push(elem);
          }
        }
        for (
          let j = 0;
          j < core.bpall[i]._2Show + Math.ceil(core.bpall[i].cntr / 2);
          j++
        ) {
          if (core._ds[j]) {
            let elem = core._ds[j].cloneNode(true);
            addClass(elem as Element, core.opts.dupCls || ``);
            core.bpall[i].bpSLen++;
            core.bpall[i].nDups.push(elem);
          }
        }
      }
    }
    for (let i = 0; i < core.bpall.length; i++) {
      let pageLength = Math.floor(core.sLen / core.bpall[i]._2Scroll);
      let navBtns: Node[] = [];
      let var1 = core.sLen % core.bpall[i]._2Scroll;
      let var2 = core.bpall[i]._2Show - core.bpall[i]._2Scroll;
      if (var2 > var1) {
        pageLength--;
      }
      if (var2 < var1) {
        pageLength++;
      }
      core.bpall[i].dots = [];
      let btnStr = ``;

      for (let j = 0; j < pageLength; j++) {
        let liElem = document?.createElement(`li`);
        let btnElem = document?.createElement(`button`);
        liElem.setAttribute(_Selectors.dot.slice(1, -1), ``);
        btnElem.setAttribute(`type`, `button`);
        btnStr = `<div class="${core.opts.dotNcls}">${j + 1}</div>`;
        if (
          core.opts.useTitle &&
          core.bpall[i]._2Show === 1 &&
          core._ds[j].getAttribute(_Selectors.stitle.slice(1, -1))
        ) {
          btnStr += core._ds[j].getAttribute(_Selectors.stitle.slice(1, -1));
          addClass(liElem as HTMLElement, core.opts.dotCls);
        }
        btnElem.innerHTML = btnStr;
        liElem.appendChild(btnElem);
        navBtns.push(liElem);

        core.eHandlers.push(
          eventHandler(
            btnElem as HTMLElement,
            `click`,
            function (event: Event) {
              event.preventDefault();
              core.pi = core.ci;
              core.ci = j * core.bpall[i]._2Scroll;
              if (core.opts.rtl) {
                core.ci = (pageLength - j - 1) * core.bpall[i]._2Scroll;
              } else {
                core.ci = j * core.bpall[i]._2Scroll;
              }
              animateTrack(core);
            }
          )
        );
        core.bpall[i].dots.push(navBtns[j]);
      }
    }
  };

  /**
   * Function to remove ghost dragging from images
   *
   * @param core - Carouzel instance core object
   *
   */
  const makeStuffUndraggable = (core: ICore) => {
    if (core.root) {
      const images = core.root.querySelectorAll(`img`);
      for (let img = 0; img < images.length; img++) {
        core.eHandlers.push(
          eventHandler(
            images[img] as HTMLElement,
            `dragstart`,
            function (event: Event) {
              event.preventDefault();
            }
          )
        );
      }
    }
  };

  /**
   * Function to validate all breakpoints to check duplicates
   *
   * @param breakpoints - Breakpoint settings array
   *
   */
  const validateBreakpoints = (breakpoints: ICoreBreakpoint[]) => {
    try {
      let tempArr = [];
      let len = breakpoints.length;
      while (len--) {
        if (tempArr.indexOf(breakpoints[len].bp) === -1) {
          tempArr.push(breakpoints[len].bp);
        }
      }
      if (tempArr.length === breakpoints.length) {
        return {
          val: true,
          bp: breakpoints.sort(
            (a, b) => parseFloat(a.bp as string) - parseFloat(b.bp as string)
          ),
        };
      } else {
        // throw new TypeError(_duplicateBreakpointsTypeError);
        console.error(_duplicateBreakpointsTypeError);
        return {};
      }
    } catch (e) {
      // throw new TypeError(_breakpointsParseTypeError);
      console.error(_breakpointsParseTypeError);
      return {};
    }
  };

  /**
   * Function to update breakpoints to override missing settings from previous breakpoint
   *
   * @param settings - Core settings object containing merge of default and custom settings
   *
   */
  const updateBreakpoints = (settings: ICoreSettings) => {
    const defaultBreakpoint: ICoreBreakpoint = {
      _2Scroll: settings._2Scroll,
      _2Show: settings._2Show,
      _arrows: settings._arrows,
      _nav: settings._nav,
      bp: 0,
      bpSLen: 0,
      cntr: settings.cntr,
      dots: [],
      gutr: settings.gutr,
      nav: null,
      nDups: [],
      pDups: [],
      swipe: settings.swipe,
    };
    let tempArr = [];
    if (settings.res && settings.res.length > 0) {
      let settingsLen = settings.res.length;
      while (settingsLen--) {
        tempArr.push(settings.res[settingsLen]);
      }
    }
    tempArr.push(defaultBreakpoint);
    let updatedArr = validateBreakpoints(tempArr);

    if (updatedArr.val) {
      let bpArr = [updatedArr.bp[0]];
      let bpLen = 1;
      let bp1: ICoreBreakpoint;
      let bp2: ICoreBreakpoint;
      while (bpLen < updatedArr.bp.length) {
        bp1 = bpArr[bpLen - 1];
        bp2 = { ...bp1, ...updatedArr.bp[bpLen] };
        if (typeof bp2._arrows === `undefined`) {
          bp2._arrows = bp1._arrows;
        }
        if (typeof bp2._nav === `undefined`) {
          bp2._nav = bp1._nav;
        }
        if (typeof bp2._2Show === `undefined`) {
          bp2._2Show = bp1._2Show;
        }
        if (typeof bp2._2Scroll === `undefined`) {
          bp2._2Scroll = bp1._2Scroll;
        }
        if (typeof bp2.swipe === `undefined`) {
          bp2.swipe = bp1.swipe;
        }
        if (typeof bp2.cntr === `undefined`) {
          bp2.cntr = bp1.cntr;
        }
        if (typeof bp2.gutr === `undefined`) {
          bp2.gutr = bp1.gutr;
        }
        bpArr.push(bp2);
        bpLen++;
      }
      return bpArr;
    }
    return [];
  };

  /**
   * Function to map default and custom settings to Core settings with shorter names
   *
   * @param settings - Settings object containing merge of default and custom settings
   *
   */
  const mapSettings = (settings: ISettings) => {
    let settingsobj: ICoreSettings = {
      _2Scroll: settings.slidesToScroll,
      _2Show: settings.slidesToShow,
      _arrows: settings.showArrows,
      _nav: settings.showNavigation,
      _urlH: settings.appendUrlHash,
      activeCls: settings.activeClass,
      aFn: settings.afterScrollFn,
      auto: settings.autoplay,
      autoS: settings.autoplaySpeed,
      bFn: settings.beforeScrollFn,
      cntr: settings.centerBetween,
      disableCls: settings.disabledClass,
      dotCls: settings.dotTitleClass,
      dotNcls: settings.dotIndexClass,
      dupCls: settings.duplicateClass,
      editCls: settings.editModeClass,
      effect: (() => {
        if (_animationEffects.indexOf(settings.animationEffect) > -1) {
          return settings.animationEffect;
        }
        console.warn(_noEffectFoundError);
        return _animationEffects[0];
      })(),
      gutr: settings.slideGutter,
      hidCls: settings.hiddenClass,
      inf: settings.isInfinite,
      rtl: settings.isRTL,
      kb: settings.enableKeyboard,
      pauseHov: settings.pauseOnHover,
      res: [],
      speed: settings.animationSpeed,
      startAt: settings.animationSpeed,
      swipe: settings.enableTouchSwipe,
      threshold: settings.touchThreshold,
      easeFn: (() => {
        if (_easingFunctions[settings.easingFunction]) {
          return settings.easingFunction;
        }
        console.warn(_noEasingFoundError);
        return Object.keys(_easingFunctions)[0];
      })(),
      useTitle: settings.useTitlesAsDots,
    };

    if (settings.breakpoints && settings.breakpoints.length > 0) {
      for (let i = 0; i < settings.breakpoints.length; i++) {
        let obj: ICoreBreakpoint = {
          _2Scroll: settings.breakpoints[i].slidesToScroll,
          _2Show: settings.breakpoints[i].slidesToShow,
          _arrows: settings.breakpoints[i].showArrows,
          _nav: settings.breakpoints[i].showNavigation,
          bp: settings.breakpoints[i].atWidth,
          bpSLen: 0,
          cntr: settings.breakpoints[i].centerBetween,
          dots: [],
          gutr: settings.breakpoints[i].slideGutter,
          nav: null,
          nDups: [],
          pDups: [],
          swipe: settings.breakpoints[i].enableTouchSwipe,
        };
        if (settingsobj.res) {
          settingsobj.res.push(obj);
        }
      }
    }

    return settingsobj;
  };

  /**
   * Function to initialize the carouzel core object and assign respective events
   *
   * @param core - Carouzel instance core object
   *
   */
  const init = (root: HTMLElement, settings: ISettings) => {
    if (typeof settings.beforeInitFn === `function`) {
      settings.beforeInitFn();
    }
    // let _core: ICore = { ...core };
    let _core = <ICore>{};
    _core.root = root;
    _core.opts = mapSettings(settings);

    _core._ds = root.querySelectorAll(`${_Selectors.slide}`);
    _core.arrowN = root.querySelector(`${_Selectors.arrowN}`);
    _core.arrowP = root.querySelector(`${_Selectors.arrowP}`);
    _core.bPause = root.querySelector(`${_Selectors.pauseBtn}`);
    _core.bPlay = root.querySelector(`${_Selectors.playBtn}`);
    _core.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
    _core.controlsW = root.querySelector(`${_Selectors.controlsW}`);
    _core.eHandlers = [];
    _core.nav = root.querySelector(`${_Selectors.nav}`);
    _core.navW = root.querySelector(`${_Selectors.navW}`);
    _core.pts = [];
    _core.sLen = _core._ds.length;
    _core.trk = root.querySelector(`${_Selectors.trk}`);
    _core.trkM = root.querySelector(`${_Selectors.trkM}`);
    _core.trkO = root.querySelector(`${_Selectors.trkO}`);
    _core.trkW = root.querySelector(`${_Selectors.trkW}`);
    _core.opts.rtl = false;

    if (_core.root.hasAttribute(_Selectors.rtl.slice(1, -1))) {
      _core.opts.rtl = true;
    }
    _core._t = <ITimer>{};
    _core._t.total = _core.opts.speed;

    if (!_core._ds[_core.ci]) {
      _core.ci = settings.startAtIndex = 0;
    }

    if (_core.trk && _core.sLen > 0) {
      if (_core.opts.auto) {
        _core.opts.inf = true;
        toggleAutoplay(_core);
      }
      _core.bpall = updateBreakpoints(_core.opts);
      if (_core.bpall.length > 0) {
        makeStuffUndraggable(_core);
        toggleKeyboard(_core);
        generateElements(_core);
        toggleControlButtons(_core);
        toggleTouchEvents(_core);
        applyLayout(_core, _core.opts.rtl);
      }
    }

    addClass(_core.root as HTMLElement, _core.opts.activeCls);

    if (!isNaN(_core.opts.cntr) && _core.opts.cntr > 0) {
      _core.root.setAttribute(_Selectors.cntr.slice(1, -1), ``);
    }
    for (let r = 0; r < _core.opts.res.length; r++) {
      if (!isNaN(_core.opts.res[r].cntr) && _core.opts.res[r].cntr > 0) {
        _core.root.setAttribute(_Selectors.cntr.slice(1, -1), ``);
      }
    }

    if (typeof settings.afterInitFn === `function`) {
      settings.afterInitFn();
    }
    if (settings.trackUrlHash && window?.location?.hash) {
      let windowHash = window.location.hash || ``;
      if (windowHash.charAt(0) === `#`) {
        windowHash = windowHash.slice(1, windowHash.length);
      }
      if ((windowHash || '').length > 0) {
        const thisSlides = _core.root.querySelectorAll(`${_Selectors.slide}`);
        let foundSlideIndex: number = -1;
        for (let s = 0; s < thisSlides.length; s++) {
          if (thisSlides[s].getAttribute(`id`) === windowHash) {
            foundSlideIndex = s;
            break;
          }
        }
        if (foundSlideIndex !== -1) {
          go2Slide(_core, foundSlideIndex);
        }
      }
    }
    return _core;
  };

  /**
   * Function to get the Carouzel based on the query string provided.
   *
   * @param query - The CSS selector for which the Carouzel needs to be initialized.
   *
   * @returns an array of all available core instances on page
   */
  const getCores = (query: string) => {
    const roots = document?.querySelectorAll(query);
    const rootsLen = roots.length;
    let tempArr = <IRoot>[];
    if (rootsLen > 0) {
      for (let i = 0; i < rootsLen; i++) {
        const id = roots[i].getAttribute(`id`);
        if (id && allLocalInstances[id]) {
          tempArr.push(allLocalInstances[id]);
        }
      }
    }
    return tempArr;
  };

  /**
   * Function to destroy the carouzel core and delete it from the root instance
   *
   * @param core - The carouzel core which needs to be deleted
   *
   */
  const destroy = (core: ICore) => {
    const id = core.root?.getAttribute('id');
    const allElems = (core.root as HTMLElement).querySelectorAll(`*`);
    for (let i = 0; i < allElems.length; i++) {
      removeEventListeners(core, allElems[i]);
      if (core.trk && hasClass(allElems[i] as Element, core.opts.dupCls)) {
        core.trk.removeChild(allElems[i]);
      }
      if (core.nav && allElems[i].hasAttribute(_Selectors.dot.slice(1, -1))) {
        core.nav.removeChild(allElems[i]);
      }
      allElems[i].removeAttribute(`style`);
      removeClass(
        allElems[i] as HTMLElement,
        `${core.opts.activeCls} ${core.opts.editCls} ${core.opts.disableCls} ${core.opts.dupCls}`
      );
    }

    removeClass(
      core.root as HTMLElement,
      `${core.opts.activeCls} ${core.opts.editCls} ${core.opts.disableCls} ${core.opts.dupCls}`
    );

    if (id) {
      delete allLocalInstances[id];
    }
  };

  /**
   *  ██████  ██████  ██████  ███████
   * ██      ██    ██ ██   ██ ██
   * ██      ██    ██ ██████  █████
   * ██      ██    ██ ██   ██ ██
   *  ██████  ██████  ██   ██ ███████
   *
   * Class for every Carouzel instance.
   *
   */
  class Core {
    constructor(thisid: string, root: HTMLElement, options?: ISettings) {
      allLocalInstances[thisid] = init(root, { ..._Defaults, ...options });
    }
  }

  /**
   * ██████   ██████   ██████  ████████
   * ██   ██ ██    ██ ██    ██    ██
   * ██████  ██    ██ ██    ██    ██
   * ██   ██ ██    ██ ██    ██    ██
   * ██   ██  ██████   ██████     ██
   *
   * Exposed Singleton Class for global usage.
   *
   */

  export class Root {
    protected static instance: Root | null = null;

    /**
     * Constructor to initiate polyfills
     *
     */
    constructor() {}
    /**
     * Function to return single instance
     *
     * @returns Single Carouzel Instance
     *
     */
    public static getInstance(): Root {
      if (!Root.instance) {
        Root.instance = new Root();
      }
      return Root.instance;
    }

    /**
     * Function to return count of all available carouzel objects
     *
     * @returns count of all available carouzel objects
     *
     */
    protected getLength = () => getCoreInstancesLength();

    /**
     * Function to initialize the Carouzel plugin for provided query strings.
     *
     * @param query - The CSS selector for which the Carouzel needs to be initialized.
     * @param options - The optional object to customize every Carouzel instance.
     *
     */
    public init = (query: string, options?: ISettings) => {
      const elements = document?.querySelectorAll(query);
      const elementsLength = elements.length;
      const instanceLength = getCoreInstancesLength();

      if (elementsLength > 0) {
        for (let i = 0; i < elementsLength; i++) {
          const id = elements[i].getAttribute(`id`);
          let isElementPresent = false;
          if (id) {
            for (let j = 0; j < instanceLength; j++) {
              if (allLocalInstances[id]) {
                isElementPresent = true;
                break;
              }
            }
          }

          if (!isElementPresent) {
            let newOptions;
            let autoDataAttr =
              (elements[i] as HTMLElement).getAttribute(
                _Selectors.rootAuto.slice(1, -1)
              ) || ``;
            if (autoDataAttr) {
              try {
                newOptions = JSON.parse(
                  stringTrim(autoDataAttr).replace(/'/g, `"`)
                );
              } catch (e) {
                // throw new TypeError(_optionsParseTypeError);
                console.error(_optionsParseTypeError);
              }
            } else {
              newOptions = options;
            }
            if (id) {
              new Core(id, elements[i] as HTMLElement, newOptions);
            } else {
              const thisid = id
                ? id
                : { ...newOptions, ..._Defaults }.idPrefix +
                  `_` +
                  new Date().getTime() +
                  `_root_` +
                  (i + 1);
              elements[i].setAttribute(`id`, thisid);
              new Core(thisid, elements[i] as HTMLElement, newOptions);
            }
          }
        }
        if (getCoreInstancesLength() > 0 && !isWindowEventAttached) {
          isWindowEventAttached = true;
          window?.addEventListener(`resize`, winResizeFn, false);
        }
      } else {
        if (query !== _Selectors.rootAuto) {
          // throw new TypeError(_rootSelectorTypeError);
          console.error(`"${query}": ${_rootSelectorTypeError}`);
        }
      }
    };

    /**
     * Function to initialize all the carouzel which have `data-carouzelauto` set
     *
     */
    public globalInit = () => {
      this.init(_Selectors.rootAuto);
    };

    /**
     * Function to animate to a certain slide based on a provided direction or number
     *
     * @param query - The CSS selector for which the Carouzels need to be animated
     * @param target - Either the direction `previous` or `next`, or the slide index
     *
     */
    protected goToSlide = (query: string, target: string) => {
      const cores = getCores(query);
      if (cores.length > 0) {
        for (let i = 0; i < cores.length; i++) {
          if (_animationDirections.indexOf(target) !== -1) {
            target === _animationDirections[0]
              ? go2Prev(cores[i])
              : go2Next(cores[i]);
          } else if (!isNaN(parseInt(target))) {
            go2Slide(cores[i], parseInt(target) - 1);
          }
        }
      } else {
        // throw new TypeError(_rootSelectorTypeError);
        console.error(`"${query}": ${_rootSelectorTypeError}`);
      }
    };

    /**
     * Function to destroy the Carouzel plugin for provided query strings.
     *
     * @param query - The CSS selector for which the Carouzel needs to be destroyed.
     *
     */
    protected destroy = (query: string) => {
      const cores = getCores(query);
      if (cores.length > 0) {
        for (let i = 0; i < cores.length; i++) {
          destroy(cores[i]);
        }
        if (getCoreInstancesLength() === 0) {
          window?.removeEventListener(`resize`, winResizeFn, false);
        }
      } else {
        // throw new TypeError(_rootSelectorTypeError);
        console.error(`"${query}": ${_rootSelectorTypeError}`);
      }
    };

    // TODO: FUTURE IMPLEMENTATION
    // protected prependSlide = (slideElem: Node) => {
    //   if (_core.trk) {
    //     doInsertBefore(_core.trk, slideElem);
    //   }
    // };
    // protected appendSlide = (slideElem: Node) => {
    //   if (_core.trk) {
    //     doInsertAfter(_core.trk, slideElem);
    //   }
    // };
  }
}
Carouzel.Root.getInstance().globalInit();
if (typeof exports === `object` && typeof module !== `undefined`) {
  module.exports = Carouzel;
}
