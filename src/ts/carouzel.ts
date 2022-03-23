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
    dots: HTMLElement[];
    nav: HTMLElement | null;
    gutr: number;
    nDups: HTMLElement[];
    pDups: HTMLElement[];
    swipe: boolean;
    verH: number;
    verP: number;
  }

  interface ICoreSettings {
    _2Scroll: number;
    _2Show: number;
    _arrows: boolean;
    _nav: boolean;
    _urlH: boolean;
    activeCls: string;
    aFn?: () => void;
    auto: boolean;
    autoS: number;
    bFn?: () => void;
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
    nDirCls: string;
    pauseHov: boolean;
    pDirCls: string;
    res: ICoreBreakpoint[];
    rtl: boolean;
    // scbar: boolean;
    speed: number;
    startAt: number;
    swipe: boolean;
    threshold: number;
    useTitle: boolean;
    ver: boolean;
    verH: number;
    verP: number;
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
    afterInitFn?: () => void;
    afterScrollFn?: () => void;
    animationEffect: string;
    animationSpeed: number;
    appendUrlHash: boolean;
    autoplay: boolean;
    autoplaySpeed: number;
    beforeInitFn?: () => void;
    beforeScrollFn?: () => void;
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

  interface ITimer {
    aElapsed: number;
    aId: any;
    aProgress: number;
    aStart: number;
    aTotal: number;
    elapsed: number;
    id: any;
    nX: number; // nextX
    position: number;
    progress: number;
    pX: number; // prevX
    start: number;
    total: number;
  }

  interface ICore {
    _as: HTMLElement[];
    _ds: HTMLElement[];
    _t: ITimer;
    aLen: number;
    arrowN: HTMLElement | null;
    arrowP: HTMLElement | null;
    autoT: any;
    bpall: ICoreBreakpoint[];
    bPause: HTMLElement | null;
    bPlay: HTMLElement | null;
    bpoOld: ICoreBreakpoint;
    bpo: ICoreBreakpoint;
    ci: number;
    ctrlW: HTMLElement | null;
    ct: number;
    curp: HTMLElement | null;
    eH: any[];
    fLoad: boolean;
    nav: HTMLElement | null;
    navW: HTMLElement | null;
    o: ICoreSettings; // Options
    pauseClk: boolean;
    paused: boolean;
    pi: number;
    pts: {
      [key: string]: number;
    };
    root: HTMLElement | null;
    // scbarB: HTMLElement | null;
    // scbarT: HTMLElement | null;
    // scbarW: HTMLElement | null;
    sLen: number;
    sWid: number;
    sync: string | null;
    totp: HTMLElement | null;
    trk: HTMLElement | null;
    trkM: HTMLElement | null;
    trkO: HTMLElement | null;
    trkW: HTMLElement | null;
  }

  interface ICoreInstance {
    [key: string]: ICore;
  }

  interface ICarouzelEasing {
    [key: string]: (t: number) => number;
  }

  const allLocalInstances: ICoreInstance = {};
  let documentHiddenTime = 0;
  let extraSlideCount: number | null;
  let hashSlide: HTMLElement | null;
  let iloop = 0;
  let isDocumentHidden = false;
  let isWindowEventAttached = false;
  let jloop = 0;
  let newCi: number | null;
  let newPi: number | null;
  let transformBuffer: number | null;
  let transformVal: number | null;
  let windowResizeAny: any;

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
    // elastic bounce effect at the beginning
    // easeInElastic: (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
    // elastic bounce effect at the end
    // easeOutElastic: (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t),
    // elastic bounce effect at the beginning and end
    // easeInOutElastic: (t: number) =>
    //   (t -= 0.5) < 0
    //     ? (0.02 + 0.01 / t) * Math.sin(50 * t)
    //     : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
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
    cntr: `[data-carouzel-centered]`,
    ctrlW: `[data-carouzel-ctrlWrapper]`,
    curp: `[data-carouzel-currentpage]`,
    dot: `[data-carouzel-dot]`,
    nav: `[data-carouzel-navigation]`,
    navW: `[data-carouzel-navigationwrapper]`,
    pauseBtn: `[data-carouzel-pause]`,
    playBtn: `[data-carouzel-play]`,
    root: `[data-carouzel]`,
    rootAuto: `[data-carouzel-auto]`,
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

  /**
   * Function to return the now() value based on the available global `performance` object
   *
   * @returns The now() value.
   *
   */
  const getNow = () =>
    (performance as Performance) ? performance.now() : Date.now();

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
  const hasClass = (element: HTMLElement, cls: string) => {
    if (typeof element?.className === `string`) {
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
  const addClass = (element: HTMLElement, cls: string) => {
    if (typeof element?.className === `string`) {
      const clsarr = cls.split(` `);
      const clsarrLength = clsarr.length;
      for (iloop = 0; iloop < clsarrLength; iloop++) {
        const thiscls = clsarr[iloop];
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
  const removeClass = (element: HTMLElement, cls: string) => {
    if (typeof element?.className === `string`) {
      const clsarr = cls.split(` `);
      const curclass = element.className.split(` `);
      const curclassLen = curclass.length;
      for (iloop = 0; iloop < curclassLen; iloop++) {
        const thiscls = curclass[iloop];
        if (clsarr.indexOf(thiscls) > -1) {
          curclass.splice(iloop, 1);
          iloop--;
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
    return parseFloat(num.toFixed(4));
  };

  /**
   * Function to track the document visibility
   *
   */
  const documentVisibilityFn = () => {
    if (document?.hidden) {
      isDocumentHidden = true;
      documentHiddenTime = getNow();
    } else {
      isDocumentHidden = false;
      documentHiddenTime = (getNow() - documentHiddenTime) / 1000;
    }
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
      for (const e in allLocalInstances) {
        if (allLocalInstances.hasOwnProperty(e)) {
          applyLayout(allLocalInstances[e]);
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
    let j = core.eH.length;
    while (j--) {
      if (
        core.eH[j].element.isEqualNode &&
        core.eH[j].element.isEqualNode(element)
      ) {
        core.eH[j].remove();
        core.eH.splice(j, 1);
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
    const eventHandlerObj: IEventHandler = {
      element,
      remove: () => {
        element.removeEventListener(type, listener, cUseCapture);
      }
    };
    element.addEventListener(type, listener, cUseCapture);
    return eventHandlerObj;
  };

  /**
   * Function to take care of active slides before and after animation
   *
   * @param core - Carouzel instance core object
   *
   */
  const manageActiveSlides = (core: ICore) => {
    let x: number | null = null;
    for (let i = 0; i < core.aLen; i++) {
      if (core._as[i]) {
        removeClass(core._as[i], core.o.activeCls);
        core._as[i].setAttribute(`aria-hidden`, `true`);
      }
    }
    for (
      let i = core.ci + core.bpo.pDups.length;
      i < core.ci + core.bpo.pDups.length + core.bpo._2Show;
      i++
    ) {
      if (core.o.rtl) {
        x = core.ci + core.bpo.pDups.length + core.bpo._2Show - i - 1;
        if (core._as[x]) {
          addClass(core._as[x], core.o.activeCls);
          core._as[x].removeAttribute(`aria-hidden`);
        }
        x = null;
      } else {
        x = null;
        if (core._as[i]) {
          addClass(core._as[i], core.o.activeCls);
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
    if (core.arrowP) {
      if (!core.o.inf && core.ci === 0) {
        addClass(core.arrowP, core.o.disableCls || ``);
        core.arrowP.setAttribute(`disabled`, `disabled`);
      } else {
        removeClass(core.arrowP, core.o.disableCls || ``);
        core.arrowP.removeAttribute(`disabled`);
      }
    }
    if (core.arrowN) {
      if (!core.o.inf && core.ci === core.sLen - core.bpo._2Show) {
        addClass(core.arrowN, core.o.disableCls || ``);
        core.arrowN.setAttribute(`disabled`, `disabled`);
      } else {
        removeClass(core.arrowN, core.o.disableCls || ``);
        core.arrowN.removeAttribute(`disabled`);
      }
    }
    if (core.bpo.dots.length > 0) {
      for (let i = 0; i < core.bpo.dots.length; i++) {
        removeClass(core.bpo.dots[i], core.o.activeCls);
      }
      x = Math.floor(core.ci / core.bpo._2Scroll);
      if (core.o.rtl) {
        x = core.bpo.dots.length - x - 1;
      }
      if (x < 0) {
        x = core.bpo.dots.length - 1;
      }
      if (x >= core.bpo.dots.length) {
        x = 0;
      }
      if (core.curp) {
        core.curp.innerHTML = `${x + 1}`;
      }
      if (core.bpo.dots[x]) {
        addClass(core.bpo.dots[x], core.o.activeCls);
      }
    }
  };

  const proceedWithAnimation = {
    /**
     * Local function to perform post operations after slide animation
     *
     */
    _post: (core: ICore) => {
      if (core.ci >= core.sLen) {
        core.ci = core.sLen - core.ci;
      }
      if (core.ci < 0) {
        core.ci = core.sLen + core.ci;
      }
      if (core.trk) {
        core.trk.style.transform = core.o.ver
          ? `translate3d(0, ${-core.pts[core.ci]}px, 0)`
          : `translate3d(${-core.pts[core.ci]}px, 0, 0)`;
      }
      core.ct = -core._t.nX;
      // updateAttributes(core);
      manageActiveSlides(core);
      if (core.o._urlH && core.root) {
        hashSlide = core.root.querySelector(`.${core.o.activeCls}`);
        if (hashSlide && window?.location) {
          window.location.hash = hashSlide.getAttribute(`id`) || ``;
        }
        hashSlide = null;
      }
      if (typeof core.o.aFn === `function`) {
        core.o.aFn();
      }
      removeClass(
        core.root as HTMLElement,
        `${core.o.nDirCls} ${core.o.pDirCls}`
      );
    },

    /**
     * Local function to perform scroll animation
     *
     */
    scroll: (core: ICore, touchedPixel: number) => {
      const scrollThisTrack = (now: number) => {
        core._t.elapsed = now - core._t.start;
        core._t.progress = cEasingFunctions[core.o.easeFn](
          core._t.elapsed / core._t.total
        );

        if (core.ci > core.pi) {
          core._t.position =
            core._t.pX +
            (touchedPixel ? touchedPixel : 0) +
            core._t.progress * (core._t.nX - core._t.pX);
          if (core._t.position > core._t.nX) {
            core._t.position = core._t.nX;
          }
        }
        if (core.ci < core.pi) {
          core._t.position =
            core._t.pX +
            (touchedPixel ? touchedPixel : 0) -
            core._t.progress * (core._t.pX - core._t.nX);
          if (core._t.position < core.pts[core.ci]) {
            core._t.position = core.pts[core.ci];
          }
        }

        if (core._t.position && core.trk) {
          core._t.position = Math.round(core._t.position);
          core.trk.style.transform = core.o.ver
            ? `translate3d(0, ${-core._t.position}px, 0)`
            : `translate3d(${-core._t.position}px, 0, 0)`;
        }
        if (core._t.progress < 1 && core._t.position !== core.pts[core.ci]) {
          core._t.id = requestAnimationFrame(scrollThisTrack);
        } else {
          proceedWithAnimation._post(core);
        }
      };
      if (core._t.start && core._t.total && core.ci !== core.pi) {
        core._t.id = requestAnimationFrame(scrollThisTrack);
      }
    },
    /**
     * Local function to perform slide animation
     *
     */
    slide: (core: ICore, touchedPixel: number) => {
      const slideThisTrack = (now: number) => {
        core._t.elapsed = now - core._t.start;
        core._t.progress = cEasingFunctions[core.o.easeFn](
          core._t.elapsed / core._t.total
        );

        if (core.ci > core.pi) {
          core._t.position =
            core._t.pX +
            (touchedPixel ? touchedPixel : 0) +
            core._t.progress * (core._t.nX - core._t.pX);
          if (core._t.position > core._t.nX) {
            core._t.position = core._t.nX;
          }
        }
        if (core.ci < core.pi) {
          core._t.position =
            core._t.pX +
            (touchedPixel ? touchedPixel : 0) -
            core._t.progress * (core._t.pX - core._t.nX);
          if (core._t.position < core.pts[core.ci]) {
            core._t.position = core.pts[core.ci];
          }
        }

        if (core._t.position && core.trk && extraSlideCount !== null) {
          core._t.position = Math.round(core._t.position);
          transformBuffer = core._t.position - core.pts[core.pi];
          for (let i = -core.bpo.pDups.length; i < core.aLen; i++) {
            if (
              i >= core.pi &&
              i < core.pi + core.bpo._2Show &&
              core._as[i + extraSlideCount]
            ) {
              (core._as[i + extraSlideCount] as HTMLElement).style.transform =
                core.o.ver
                  ? `translate3d(0, ${transformBuffer}px, 3px)`
                  : `translate3d(${transformBuffer}px, 0, 3px)`;
            }
          }
          core.trk.style.transform = core.o.ver
            ? `translate3d(0, ${-core._t.position}px, 0)`
            : `translate3d(${-core._t.position}px, 0, 0)`;
        }
        if (core._t.progress < 1 && core._t.position !== core.pts[core.ci]) {
          core._t.id = requestAnimationFrame(slideThisTrack);
        } else {
          proceedWithAnimation._post(core);
          for (let i = 0; i < core.aLen; i++) {
            (
              core._as[i] as HTMLElement
            ).style.transform = `translate3d(0, 0, 0)`;
          }
        }
      };
      if (core.trk) {
        extraSlideCount = transformVal = newCi = newPi = transformBuffer = null;
        for (let i = 0; i < core.aLen; i++) {
          (core._as[i] as HTMLElement).style.transform = core.o.ver
            ? `translate3d(0, 0, 5px)`
            : `translate3d(0, 0, 5px)`;
        }

        extraSlideCount = core.o.inf ? core.bpo._2Show : 0;
        transformVal =
          core.ci > core.pi
            ? Math.abs(core.ci - core.pi - extraSlideCount)
            : Math.abs(core.pi - core.ci - extraSlideCount);
        transformVal =
          core.ci > core.pi ? -core.pts[transformVal] : core.pts[transformVal];
        for (let i = 0; i < core.aLen; i++) {
          if (
            i >= core.pi &&
            i < core.pi + core.bpo._2Show &&
            core._as[i + extraSlideCount]
          ) {
            (core._as[i + extraSlideCount] as HTMLElement).style.transform =
              core.o.ver ? `translate3d(0, 0, 3px)` : `translate3d(0, 0, 3px)`;
          }
        }
        if (core._t.start && core._t.total && core.ci !== core.pi) {
          core._t.id = requestAnimationFrame(slideThisTrack);
        }
      }
    },
    /**
     * Local function to perform fade animation
     *
     */
    fade: (core: ICore) => {
      const fadeThisTrack = (now: number) => {
        core._t.elapsed = now - core._t.start;
        core._t.progress = cEasingFunctions[core.o.easeFn](
          core._t.elapsed / core._t.total
        );
        core._t.progress = core._t.progress > 1 ? 1 : core._t.progress;
        for (let i = 0; i < core.aLen; i++) {
          if (
            extraSlideCount !== null &&
            newPi !== null &&
            i >= newPi &&
            i < newPi + core.bpo._2Show
          ) {
            (core._as[i + extraSlideCount] as HTMLElement).style.opacity =
              `` + (1 - core._t.progress);
          }
          if (
            extraSlideCount !== null &&
            newCi !== null &&
            i >= newCi &&
            i < newCi + core.bpo._2Show
          ) {
            (core._as[i + extraSlideCount] as HTMLElement).style.opacity =
              `` + core._t.progress;
          }
        }
        if (core._t.progress < 1) {
          core._t.id = requestAnimationFrame(fadeThisTrack);
        } else {
          proceedWithAnimation._post(core);
          if (newPi !== null && extraSlideCount !== null) {
            for (let i = 0; i < core.aLen; i++) {
              (core._as[i] as HTMLElement).style.opacity = `1`;
            }
            for (let i = 0; i < core.aLen; i++) {
              if (
                i >= newPi &&
                i < newPi + core.bpo._2Show &&
                core._as[i + extraSlideCount]
              ) {
                (
                  core._as[i + extraSlideCount] as HTMLElement
                ).style.transform = `translate3d(0, 0, 0)`;
                (
                  core._as[i + extraSlideCount] as HTMLElement
                ).style.visibility = `hidden`;
              }
            }
          }
        }
      };

      if (core.trk) {
        extraSlideCount = transformVal = newCi = newPi = null;
        core.trk.style.transform = core.o.ver
          ? `translate3d(0, ${-core._t.nX}px, 0)`
          : `translate3d(${-core._t.nX}px, 0, 0)`;

        newCi = core.ci < 0 ? core.sLen + core.ci : core.ci;
        newPi = core.pi < 0 ? core.sLen + core.pi : core.pi;

        extraSlideCount = core.o.inf ? core.bpo._2Show : 0;

        transformVal =
          newCi > newPi
            ? Math.abs(newCi - newPi - extraSlideCount)
            : Math.abs(newPi - newCi - extraSlideCount);
        transformVal =
          newCi > newPi ? core.pts[transformVal] : -core.pts[transformVal];

        for (let i = 0; i < core.aLen; i++) {
          (core._as[i] as HTMLElement).style.opacity = `0`;
          (core._as[i] as HTMLElement).style.transform = `translate3d(0, 0, 0)`;
        }
        for (let i = 0; i < core.aLen; i++) {
          if (
            i >= newPi &&
            i < newPi + core.bpo._2Show &&
            core._as[i + extraSlideCount]
          ) {
            (core._as[i + extraSlideCount] as HTMLElement).style.transform =
              core.o.ver
                ? `translate3d(0, ${transformVal - core.bpo.gutr}px, 0)`
                : `translate3d(${transformVal - core.bpo.gutr}px, 0, 0)`;
            (
              core._as[i + extraSlideCount] as HTMLElement
            ).style.visibility = `visible`;
            (core._as[i + extraSlideCount] as HTMLElement).style.opacity = `1`;
          }
          if (
            i >= newCi &&
            i < newCi + core.bpo._2Show &&
            core._as[i + extraSlideCount]
          ) {
            (
              core._as[i + extraSlideCount] as HTMLElement
            ).style.visibility = `visible`;
          }
        }
        if (core._t.start && core._t.total && core.ci !== core.pi) {
          core._t.id = requestAnimationFrame(fadeThisTrack);
        }
      }
    }
  };

  /**
   * Function to animate the track element based on the calculations
   *
   * @param core - Carouzel instance core object
   * @param touchedPixel - Amount of pixels travelled using touch/cursor drag
   *
   */
  const animateTrack = (core: ICore, touchedPixel: number) => {
    if (typeof core.o.bFn === `function` && !core.fLoad) {
      core.o.bFn();
    }
    addClass(
      core.root as HTMLElement,
      core.ci > core.pi ? core.o.nDirCls : core.o.pDirCls
    );
    if (core.sync && allLocalInstances[core.sync]) {
      if (core.ci < 0) {
        go2Slide(
          allLocalInstances[core.sync],
          core.sLen - core.bpo._2Scroll - 1
        );
      } else if (core.ci >= core.sLen) {
        go2Slide(allLocalInstances[core.sync], 0);
      } else {
        go2Slide(allLocalInstances[core.sync], core.ci);
      }
    }
    if (typeof core.pi === `undefined`) {
      core.pi = core.o.inf ? -core.bpo._2Show : 0;
    }
    if (!core.o.inf) {
      if (core.ci < 0) {
        core.ci = 0;
      }
      if (core.ci + core.bpo._2Show >= core.sLen) {
        core.ci = core.sLen - core.bpo._2Show;
      }
    }

    if (core.trk && core.fLoad) {
      core.trk.style.transform = core.o.ver
        ? `translate3d(0, ${-core.pts[core.ci]}px, 0)`
        : `translate3d(${-core.pts[core.ci]}px, 0, 0)`;
    }

    manageActiveSlides(core);
    updateAttributes(core);

    core._t.start = getNow();
    core._t.pX = core.pts[core.pi];
    core._t.nX = core.pts[core.ci];

    if (core.o.effect === cAnimationEffects[0] && core.trk && !core.fLoad) {
      proceedWithAnimation.scroll(core, touchedPixel);
    }

    if (core.o.effect === cAnimationEffects[1] && core.trk && !core.fLoad) {
      proceedWithAnimation.slide(core, touchedPixel);
    }

    if (core.o.effect === cAnimationEffects[2] && core.ci < 0) {
      core._t.nX = core.pts[core.sLen + core.ci];
    }
    if (core.o.effect === cAnimationEffects[2] && core.trk && !core.fLoad) {
      proceedWithAnimation.fade(core);
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
    const first = parent.querySelectorAll(cSelectors.slide)[0];
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
    const duplicates = track.querySelectorAll(`.` + duplicateClass);
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
  const applyLayout = (core: ICore) => {
    const viewportWidth = window?.innerWidth;
    let bpoptions = core.bpall[0];
    let len = 0;
    let slideWidth = 0;
    let trkWidth = 0;
    let temp = 0;
    let as: any;

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
      !hasClass(core.root, core.o.editCls) &&
      (core.bpoOld || {})._2Show !== bpoptions._2Show &&
      core.trk
    ) {
      manageDuplicates(core.trk, bpoptions, core.o.dupCls || ``);
    }
    if ((core.bpoOld || {}).bp !== bpoptions.bp) {
      core.bpo = bpoptions;
      core.bpoOld = bpoptions;
    }

    if (core.nav) {
      const dots = core.nav.querySelectorAll(cSelectors.dot);
      for (let i = 0; i < dots.length; i++) {
        core.nav.removeChild(dots[i]);
      }
      for (let i = 0; i < bpoptions.dots.length; i++) {
        core.nav.appendChild(bpoptions.dots[i]);
      }
    }
    if (!bpoptions._arrows && core.ctrlW) {
      addClass(core.ctrlW, core.o.hidCls);
    } else if (core.ctrlW) {
      removeClass(core.ctrlW, core.o.hidCls);
    }
    if (!bpoptions._nav && core.navW) {
      addClass(core.navW, core.o.hidCls);
    } else if (core.navW) {
      removeClass(core.navW, core.o.hidCls);
    }
    if (core.fLoad && core.o.rtl) {
      core.ci = core.o.startAt = core.sLen - bpoptions._2Scroll;
    }
    if (core.root && core.trkW && core.trkO && core.trk) {
      core.pts = {};
      if (core.o.ver) {
        slideWidth =
          (bpoptions.verH - (-bpoptions._2Show - 1) * bpoptions.gutr) /
          (bpoptions._2Show + bpoptions.cntr);
      } else {
        slideWidth =
          (core.trkW.clientWidth - (bpoptions._2Show - 1) * bpoptions.gutr) /
          (bpoptions._2Show + bpoptions.cntr);
      }
      core.sWid = slideWidth;
      temp =
        core.sLen >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show;

      as = core.trkO.querySelectorAll(cSelectors.slide);
      core._as = [];
      for (let i = 0; i < as.length; i++) {
        core._as.push(as[i] as HTMLElement);
      }
      core.aLen = core._as.length;
      trkWidth = slideWidth * temp + bpoptions.gutr * (temp + 1);

      if (core.o.ver) {
        core.trk.style.height = toFixed4(trkWidth) + `px`;
        core.trkO.style.height =
          toFixed4(
            bpoptions._2Show * slideWidth +
              bpoptions.gutr * (bpoptions._2Show - 1)
          ) + `px`;
      } else {
        core.trk.style.width = toFixed4(trkWidth) + `px`;
        core.trkO.style.width =
          toFixed4(
            bpoptions._2Show * slideWidth +
              bpoptions.gutr * (bpoptions._2Show - 1)
          ) + `px`;
      }

      for (let i = 0; i < core.aLen; i++) {
        if (core.o.ver) {
          (core._as[i] as HTMLElement).style.height =
            toFixed4(slideWidth) + `px`;
          if (i === 0) {
            (core._as[i] as HTMLElement).style.marginTop =
              toFixed4(bpoptions.gutr) + `px`;
            (core._as[i] as HTMLElement).style.marginBottom =
              toFixed4(bpoptions.gutr / 2) + `px`;
          } else if (i === core.aLen - 1) {
            (core._as[i] as HTMLElement).style.marginTop =
              toFixed4(bpoptions.gutr / 2) + `px`;
            (core._as[i] as HTMLElement).style.marginBottom =
              toFixed4(bpoptions.gutr) + `px`;
          } else {
            (core._as[i] as HTMLElement).style.marginTop =
              toFixed4(bpoptions.gutr / 2) + `px`;
            (core._as[i] as HTMLElement).style.marginBottom =
              toFixed4(bpoptions.gutr / 2) + `px`;
          }
        } else {
          (core._as[i] as HTMLElement).style.width =
            toFixed4(slideWidth) + `px`;
          if (i === 0) {
            (core._as[i] as HTMLElement).style.marginLeft =
              toFixed4(bpoptions.gutr) + `px`;
            (core._as[i] as HTMLElement).style.marginRight =
              toFixed4(bpoptions.gutr / 2) + `px`;
          } else if (i === core.aLen - 1) {
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
      }

      for (let i = bpoptions.pDups.length; i > 0; i--) {
        core.pts[-i] = toFixed4(
          (-i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
            bpoptions.gutr
        );
      }
      for (let i = 0; i < core.sLen; i++) {
        core.pts[i] = toFixed4(
          (i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
            bpoptions.gutr
        );
      }
      for (let i = core.sLen; i < core.sLen + bpoptions.nDups.length; i++) {
        core.pts[i] = toFixed4(
          (i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
            bpoptions.gutr
        );
      }
      if (core.totp) {
        core.totp.innerHTML = `${bpoptions.dots.length}`;
      }
    }
    animateTrack(core, 0);
    // TODO: Scrollbar implementation
    // if (core.o.scbar && core.scbarB && core.scbarT && core.trkO && core.trk) {
    //   transformVal =
    //     (core.trkO.clientWidth / core.trk.clientWidth) * core.trkO.clientWidth;
    //   core.scbarT.style.width = core.trkO.clientWidth - transformVal + `px`;
    //   core.scbarT.style.marginRight = transformVal + `px`;
    //   core.scbarB.style.width = transformVal + `px`;
    //   transformVal = null;
    // } else {
    //   animateTrack(core, 0);
    // }
  };

  /**
   * Function to go to the specific slide number
   *
   * @param core - Carouzel instance core object
   * @param slidenumber - Slide index to which the carouzel should be scrolled to
   *
   */
  const go2Slide = (core: ICore, slidenumber: number) => {
    if (core.ci !== slidenumber * core.bpo._2Scroll) {
      if (slidenumber >= core.sLen) {
        slidenumber = core.sLen - 1;
      } else if (slidenumber <= -1) {
        slidenumber = 0;
      }
      core.pi = core.ci;
      core.ci = slidenumber * core.bpo._2Scroll;
      if (core._t.id) {
        cancelAnimationFrame(core._t.id);
      }
      if (core.fLoad) {
        core.fLoad = false;
      }
      animateTrack(core, 0);
    }
  };

  /**
   * Function to go to the previous set of slides
   *
   * @param core - Carouzel instance core object
   * @param touchedPixel - The amount of pixels moved using touch/cursor drag
   *
   */
  const go2Prev = (core: ICore, touchedPixel: number) => {
    core.pi = core.ci;
    core.ci -= core.bpo._2Scroll;
    if (core._t.id) {
      cancelAnimationFrame(core._t.id);
    }
    if (core.o.inf) {
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
    if (core.fLoad) {
      core.fLoad = false;
    }
    animateTrack(core, touchedPixel);
  };

  /**
   * Function to go to the next set of slides
   *
   * @param core - Carouzel instance core object
   * @param touchedPixel - The amount of pixels moved using touch/cursor drag
   *
   */
  const go2Next = (core: ICore, touchedPixel: number) => {
    core.pi = core.ci;
    core.ci += core.bpo._2Scroll;
    if (core._t.id) {
      cancelAnimationFrame(core._t.id);
    }
    if (core.o.inf) {
      if (typeof core.pts[core.ci + core.bpo._2Show] === `undefined`) {
        core.pi = core.pi - core.sLen;
        core.ci = 0;
      } else {
        core.pi = core.ci - core.bpo._2Scroll;
      }
    }
    if (core.fLoad) {
      core.fLoad = false;
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
    if (core.root && core.o.kb) {
      core.root.setAttribute(`tabindex`, `-1`);
      let keyCode = ``;
      core.eH.push(
        eventHandler(core.root, `keydown`, (event: Event) => {
          keyCode = (event as KeyboardEvent).key.toLowerCase();
          switch (keyCode) {
            case `arrowleft`:
              go2Prev(core, 0);
              break;
            case `arrowright`:
              go2Next(core, 0);
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
  const togglePlayPauseButtons = (core: ICore, shouldPlay: boolean) => {
    if (core && core.bPause && core.bPlay) {
      if (shouldPlay) {
        addClass(core.bPlay, core.o.hidCls);
        removeClass(core.bPause, core.o.hidCls);
      } else {
        addClass(core.bPause, core.o.hidCls);
        removeClass(core.bPlay, core.o.hidCls);
      }
    }
  };

  /**
   * Function to enable pause on hover when autoplay is enabled
   *
   * @param core - Carouzel instance core object
   *
   */
  const togglePauseOnHover = (core: ICore) => {
    if (core.root && core.o.pauseHov) {
      core.eH.push(
        eventHandler(core.root, `mouseenter`, () => {
          core.paused = true;
          togglePlayPauseButtons(core, false);
          if (core._t.aId) {
            cancelAnimationFrame(core._t.aId);
          }
        })
      );
      core.eH.push(
        eventHandler(core.root, `mouseleave`, () => {
          core.paused = false;
          togglePlayPauseButtons(core, true);
          toggleAutoplay(core);
        })
      );
    }
    if (!core.o.pauseHov) {
      core.paused = false;
    }
    core._t.aTotal = core.o.autoS;
  };

  /**
   * Function to toggle Autoplay and pause on hover functionalities for the carouzel
   *
   * @param core - Carouzel instance core object
   *
   */
  const toggleAutoplay = (core: ICore) => {
    const animateAutoplay = (now: number) => {
      core._t.aElapsed = now - core._t.aStart;
      core._t.aProgress = core._t.aElapsed / core._t.aTotal;
      core._t.aProgress = core._t.aProgress > 1 ? 1 : core._t.aProgress;
      if (!core.paused) {
        if (core._t.aProgress >= 1 && !isDocumentHidden) {
          core._t.aStart = getNow();
          go2Next(core, 0);
        }
        core._t.aId = requestAnimationFrame(animateAutoplay);
      }
    };
    core._t.aTotal += core.o.speed;
    if (!core.paused) {
      core._t.aStart = getNow();
      core._t.aId = requestAnimationFrame(animateAutoplay);
    }
  };

  /**
   * Function to add click events to the arrows
   *
   * @param core - Carouzel instance core object
   *
   */
  const toggleControlButtons = (core: ICore) => {
    if (core.arrowP) {
      core.eH.push(
        eventHandler(core.arrowP, `click`, (event: Event) => {
          event.preventDefault();
          go2Prev(core, 0);
        })
      );
    }
    if (core.arrowN) {
      core.eH.push(
        eventHandler(core.arrowN, `click`, (event: Event) => {
          event.preventDefault();
          go2Next(core, 0);
        })
      );
    }
    if (core.o.inf && core.bPause) {
      core.eH.push(
        eventHandler(core.bPause, `click`, (event: Event) => {
          event.preventDefault();
          core.pauseClk = true;
          togglePlayPauseButtons(core, false);
        })
      );
    }
    if (core.o.inf && core.bPlay) {
      core.eH.push(
        eventHandler(core.bPlay, `click`, (event: Event) => {
          event.preventDefault();
          core.pauseClk = false;
          togglePlayPauseButtons(core, true);
        })
      );
    }
  };

  /**
   * Function to add touch events to the track
   *
   * @param core - Carouzel instance core object
   * @param el - Determines if the touch events need to be added to the carousel track or the scrollbar thumb
   *
   */
  const toggleTouchEvents = (core: ICore, el: string) => {
    let diffX = 0;
    let diffY = 0;
    let dragging = false;
    let endX = 0;
    let endY = 0;
    let posFinal = 0;
    let posX1 = 0;
    let posX2 = 0;
    let posY1 = 0;
    let posY2 = 0;
    let ratioX = 0;
    let ratioY = 0;
    let startX = 0;
    let startY = 0;
    let canFiniteAnimate = false;
    const threshold = core.o.threshold || 125;

    /**
     * Function to be triggered when the carouzel is touched the cursor is down on it
     *
     */
    const touchStartTrack = (e: Event) => {
      dragging = true;
      if (e.type === `touchstart`) {
        startX = (e as TouchEvent).changedTouches[0].screenX;
        startY = (e as TouchEvent).changedTouches[0].screenY;
        posX1 = (e as TouchEvent).changedTouches[0].screenX;
        posY1 = (e as TouchEvent).changedTouches[0].screenY;
      } else {
        startX = (e as MouseEvent).clientX;
        startY = (e as MouseEvent).clientY;
        posX1 = (e as MouseEvent).clientX;
        posY1 = (e as MouseEvent).clientY;
      }
    };

    /**
     * Function to be triggered when the carouzel is dragged through touch or cursor
     *
     */
    const touchMoveTrack = (e: Event) => {
      if (dragging) {
        if (e.type === `touchmove`) {
          endX = (e as TouchEvent).changedTouches[0].screenX;
          endY = (e as TouchEvent).changedTouches[0].screenY;
          posX2 = posX1 - (e as TouchEvent).changedTouches[0].screenX;
          posY2 = posY1 - (e as TouchEvent).changedTouches[0].screenY;
        } else {
          endX = (e as MouseEvent).clientX;
          endY = (e as MouseEvent).clientY;
          posX2 = posX1 - (e as MouseEvent).clientX;
          posY2 = posY1 - (e as MouseEvent).clientY;
        }
        diffX = endX - startX;
        diffY = endY - startY;
        ratioX = Math.abs(diffX / diffY);
        ratioY = Math.abs(diffY / diffX);

        if (!core.ct) {
          core.ct = -core.pts[core.ci];
        }
        if (
          core.trk &&
          (core.o.effect === cAnimationEffects[0] ||
            core.o.effect === cAnimationEffects[1])
        ) {
          if (ratioX > ratioY && !core.o.ver) {
            core.trk.style.transform = `translate3d(${
              core.ct - posX2
            }px, 0, 0px)`;
            if (core.o.effect === cAnimationEffects[1]) {
              for (let k = 0; k < core.aLen; k++) {
                core._as[k].style.transform = `translate3d(0, 0, 5px)`;
              }
              for (let k = core.ci; k < core.ci + core.bpo._2Show; k++) {
                if (core._as[k + core.bpo._2Show]) {
                  core._as[
                    k + core.bpo._2Show
                  ].style.transform = `translate3d(${posX2}px, 0, 3px)`;
                }
              }
            }
          }
          if (ratioX < ratioY && core.o.ver) {
            core.trk.style.transform = `translate3d(0, ${
              core.ct - posY2
            }px, 0)`;
            if (core.o.effect === cAnimationEffects[1]) {
              for (let k = 0; k < core.aLen; k++) {
                core._as[k].style.transform = `translate3d(0, 0, 5px)`;
              }
              for (let k = core.ci; k < core.ci + core.bpo._2Show; k++) {
                if (core._as[k + core.bpo._2Show]) {
                  core._as[
                    k + core.bpo._2Show
                  ].style.transform = `translate3d(0, ${posX2}px, 3px)`;
                }
              }
            }
          }
        }
        if (core.trk && core.o.effect === cAnimationEffects[2]) {
          for (let k = 0; k < core.aLen; k++) {
            (core._as[k] as HTMLElement).style.opacity = `1`;
          }
        }
        posFinal = core.o.ver ? posY2 : posX2;
      }
    };

    /**
     * Function to be triggered when the touch is ended or cursor is released
     *
     */
    const touchEndTrack = (e: Event) => {
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
          if (!core.o.inf) {
            if ((core.o.ver ? diffY : diffX) > 0) {
              if (Math.abs(core.ct) <= 0) {
                core.trk.style.transform = core.o.ver
                  ? `translate3d(0, ${core.ct}px, 0)`
                  : `translate3d(${core.ct}px, 0, 0)`;
              } else {
                canFiniteAnimate = true;
              }
            } else if ((core.o.ver ? diffY : diffX) < 0) {
              if (
                Math.abs(core.ct) + core.sWid * core.bpo._2Show >=
                core.sWid * core.aLen
              ) {
                core.trk.style.transform = core.o.ver
                  ? `translate3d(0, ${core.ct}px, 0)`
                  : `translate3d(${core.ct}px, 0, 0)`;
              } else {
                canFiniteAnimate = true;
              }
            }
          }

          if (core.o.effect === cAnimationEffects[2]) {
            for (let k = 0; k < core.aLen; k++) {
              (core._as[k] as HTMLElement).style.opacity = `1`;
            }
          }
          if (posFinal < -threshold) {
            if (
              (core.o.effect === cAnimationEffects[0] ||
                core.o.effect === cAnimationEffects[1]) &&
              (canFiniteAnimate || core.o.inf)
            ) {
              go2Prev(core, posFinal);
            }
            if (
              core.o.effect === cAnimationEffects[2] &&
              (canFiniteAnimate || core.o.inf)
            ) {
              go2Prev(core, 1);
            }
          } else if (posFinal > threshold) {
            if (
              (core.o.effect === cAnimationEffects[0] ||
                core.o.effect === cAnimationEffects[1]) &&
              (canFiniteAnimate || core.o.inf)
            ) {
              go2Next(core, posFinal);
            }
            if (
              core.o.effect === cAnimationEffects[2] &&
              (canFiniteAnimate || core.o.inf)
            ) {
              go2Next(core, 1);
            }
          } else {
            if (
              core.o.effect === cAnimationEffects[0] ||
              core.o.effect === cAnimationEffects[1]
            ) {
              for (let k = 0; k < core.aLen; k++) {
                core._as[k].style.transform = `translate3d(0, 0, 0)`;
              }
              core.trk.style.transform = core.o.ver
                ? `translate3d(0, ${core.ct}px, 0)`
                : `translate3d(${core.ct}px, 0, 0)`;
            }
            if (core.o.effect === cAnimationEffects[2]) {
              for (let k = 0; k < core.aLen; k++) {
                (core._as[k] as HTMLElement).style.opacity = `1`;
              }
            }
          }
        }
        posX1 = posX2 = posY1 = posY2 = posFinal = 0;
        dragging = false;
      }
    };

    // TODO: Scrollbar implementation
    // const touchStartScb = (e: Event) => {
    //   dragging = true;
    //   if (e.type === `touchstart`) {
    //     startX = (e as TouchEvent).changedTouches[0].screenX;
    //     startY = (e as TouchEvent).changedTouches[0].screenY;
    //     posX1 = (e as TouchEvent).changedTouches[0].screenX;
    //     posY1 = (e as TouchEvent).changedTouches[0].screenY;
    //   } else {
    //     startX = (e as MouseEvent).clientX;
    //     startY = (e as MouseEvent).clientY;
    //     posX1 = (e as MouseEvent).clientX;
    //     posY1 = (e as MouseEvent).clientY;
    //   }
    // };
    // const touchMoveScb = (e: Event) => {
    //   if (dragging) {
    //     if (e.type === `touchmove`) {
    //       endX = (e as TouchEvent).changedTouches[0].screenX;
    //       endY = (e as TouchEvent).changedTouches[0].screenY;
    //       posX2 = posX1 - (e as TouchEvent).changedTouches[0].screenX;
    //       posY2 = posY1 - (e as TouchEvent).changedTouches[0].screenY;
    //     } else {
    //       endX = (e as MouseEvent).clientX;
    //       endY = (e as MouseEvent).clientY;
    //       posX2 = posX1 - (e as MouseEvent).clientX;
    //       posY2 = posY1 - (e as MouseEvent).clientY;
    //     }
    //     diffX = endX - startX;
    //     diffY = endY - startY;
    //     ratioX = Math.abs(diffX / diffY);
    //     ratioY = Math.abs(diffY / diffX);

    //     if (
    //       core.scbarB &&
    //       core.scbarT &&
    //       -posX2 >= 0 &&
    //       -posX2 <= core.scbarT.clientWidth
    //     ) {
    //       core.scbarB.style.transform = `translateX(${-posX2}px)`;
    //     }
    //     // if (core.trkO && core.scbarT && core.scbarB && core.trk) {
    //     //   transformVal =
    //     //     (core.trkO.scrollLeft /
    //     //       (core.trk.clientWidth - core.trkO.clientWidth)) *
    //     //     core.scbarT.clientWidth;
    //     //   core.scbarB.style.left = transformVal + `px`;
    //     //   transformVal = null;
    //     // }
    //     posFinal = core.o.ver ? posY2 : posX2;
    //   }
    // };
    // const touchEndScb = (e: Event) => {
    //   if (dragging && core.trk) {
    //     if (e.type === `touchend`) {
    //       endX = (e as TouchEvent).changedTouches[0].screenX;
    //       endY = (e as TouchEvent).changedTouches[0].screenY;
    //     } else {
    //       endX = (e as MouseEvent).clientX;
    //       endY = (e as MouseEvent).clientY;
    //     }
    //     diffX = endX - startX;
    //     diffY = endY - startY;
    //     ratioX = Math.abs(diffX / diffY);
    //     ratioY = Math.abs(diffY / diffX);

    //     if ( !isNaN(ratioX) && !isNaN(ratioY) &&
    //       ratioY !== Infinity &&
    //       ratioX !== Infinity &&
    //       ratioX !== ratioY
    //     ) {
    //       if (core.scbarB && core.scbarT) {
    //         core.scbarB.style.transform = `translateX(${-diffX}px)`;
    //       }
    //     }
    //     posX1 = posX2 = posY1 = posY2 = posFinal = 0;
    //     dragging = false;
    //   }
    // };

    // if (core.o.swipe && !core.o.scbar && el === `sl`) {

    if (core.o.swipe && el === `sl`) {
      core.eH.push(
        eventHandler(core.trk as HTMLElement, `touchstart`, (event: Event) => {
          touchStartTrack(event);
        })
      );
      core.eH.push(
        eventHandler(core.trk as HTMLElement, `touchmove`, (event: Event) => {
          touchMoveTrack(event);
        })
      );
      core.eH.push(
        eventHandler(core.trk as HTMLElement, `touchend`, (event: Event) => {
          touchEndTrack(event);
        })
      );
      core.eH.push(
        eventHandler(core.trk as HTMLElement, `mousedown`, (event: Event) => {
          touchStartTrack(event);
        })
      );
      core.eH.push(
        eventHandler(core.trk as HTMLElement, `mouseup`, (event: Event) => {
          touchEndTrack(event);
        })
      );
      core.eH.push(
        eventHandler(core.trk as HTMLElement, `mouseleave`, (event: Event) => {
          touchEndTrack(event);
        })
      );
      core.eH.push(
        eventHandler(core.trk as HTMLElement, `mousemove`, (event: Event) => {
          touchMoveTrack(event);
        })
      );
    }
    // TODO: Scrollbar implementation
    // if (core.o.scbar && core.scbarB && el === `sb`) {
    //   core.eH.push(
    //     eventHandler(
    //       core.scbarB as HTMLElement,
    //       `touchstart`,
    //       (event: Event) => {
    //         touchStartScb(event);
    //       }
    //     )
    //   );
    //   core.eH.push(
    //     eventHandler(
    //       core.scbarB as HTMLElement,
    //       `touchmove`,
    //       (event: Event) => {
    //         touchMoveScb(event);
    //       }
    //     )
    //   );
    //   core.eH.push(
    //     eventHandler(core.scbarB as HTMLElement, `touchend`, (event: Event) => {
    //       touchEndScb(event);
    //     })
    //   );
    //   core.eH.push(
    //     eventHandler(
    //       core.scbarB as HTMLElement,
    //       `mousedown`,
    //       (event: Event) => {
    //         touchStartScb(event);
    //       }
    //     )
    //   );
    //   core.eH.push(
    //     eventHandler(core.scbarB as HTMLElement, `mouseup`, (event: Event) => {
    //       touchEndScb(event);
    //     })
    //   );
    //   core.eH.push(
    //     eventHandler(
    //       core.scbarB as HTMLElement,
    //       `mouseleave`,
    //       (event: Event) => {
    //         touchEndScb(event);
    //       }
    //     )
    //   );
    //   core.eH.push(
    //     eventHandler(
    //       core.scbarB as HTMLElement,
    //       `mousemove`,
    //       (event: Event) => {
    //         touchMoveScb(event);
    //       }
    //     )
    //   );
    // }
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
      if (core.o.inf) {
        for (
          let j =
            core.sLen -
            core.bpall[i]._2Show -
            Math.ceil(core.bpall[i].cntr / 2);
          j < core.sLen;
          j++
        ) {
          if (core._ds[j]) {
            const elem = core._ds[j].cloneNode(true);
            addClass(elem as HTMLElement, core.o.dupCls || ``);
            core.bpall[i].bpSLen++;
            core.bpall[i].pDups.push(elem as HTMLElement);
          }
        }
        for (
          let j = 0;
          j < core.bpall[i]._2Show + Math.ceil(core.bpall[i].cntr / 2);
          j++
        ) {
          if (core._ds[j]) {
            const elem = core._ds[j].cloneNode(true);
            addClass(elem as HTMLElement, core.o.dupCls || ``);
            core.bpall[i].bpSLen++;
            core.bpall[i].nDups.push(elem as HTMLElement);
          }
        }
      }
    }
    for (let i = 0; i < core.bpall.length; i++) {
      let pageLength = Math.floor(core.sLen / core.bpall[i]._2Scroll);
      const navBtns: HTMLElement[] = [];
      const var1 = core.sLen % core.bpall[i]._2Scroll;
      const var2 = core.bpall[i]._2Show - core.bpall[i]._2Scroll;
      if (var2 > var1) {
        pageLength--;
      }
      if (var2 < var1) {
        pageLength++;
      }

      core.bpall[i].dots = [];
      let btnStr = ``;

      for (let j = 0; j < pageLength; j++) {
        const liElem = document?.createElement(`li`);
        const btnElem = document?.createElement(`button`);
        liElem.setAttribute(cSelectors.dot.slice(1, -1), ``);
        btnElem.setAttribute(`type`, `button`);
        btnStr = `<div class="${core.o.dotNcls}">${j + 1}</div>`;
        if (
          core.o.useTitle &&
          core.bpall[i]._2Show === 1 &&
          core._ds[j].getAttribute(cSelectors.stitle.slice(1, -1))
        ) {
          btnStr += core._ds[j].getAttribute(cSelectors.stitle.slice(1, -1));
          addClass(liElem as HTMLElement, core.o.dotCls);
        }
        btnElem.innerHTML = btnStr;
        liElem.appendChild(btnElem);
        navBtns.push(liElem);

        core.eH.push(
          eventHandler(btnElem as HTMLElement, `click`, (event: Event) => {
            event.preventDefault();
            if (core.o.rtl) {
              go2Slide(core, pageLength - j - 1);
            } else {
              go2Slide(core, j);
            }
          })
        );
        core.bpall[i].dots.push(navBtns[j] as HTMLElement);
      }
    }
  };

  /**
   * Function to remove ghost dragging from images
   *
   * @param core - Carouzel instance core object
   *
   */
  // TODO: FUTURE SCROLLBAR IMPLEMENTATION
  // const generateScrollbar = (core: ICore) => {
  //   if (core.o.scbar && core.root) {
  //     core.scbarW = core.root.querySelector(`${cSelectors.scbarW}`);
  //     core.scbarT = core.root.querySelector(`${cSelectors.scbarT}`);
  //     core.scbarB = core.root.querySelector(`${cSelectors.scbarB}`);
  //     core.root.setAttribute(cSelectors.scbar.slice(1, -1), `true`);
  //   }

  //   const logTrackScroll = () => {
  //     if (core.trkO && core.scbarT && core.scbarB && core.trk) {
  //       transformVal =
  //         (core.trkO.scrollLeft /
  //           (core.trk.clientWidth - core.trkO.clientWidth)) *
  //         core.scbarT.clientWidth;
  //       core.scbarB.style.transform = `translateX(${transformVal}px)`;
  //       transformVal = null;
  //     }
  //   };

  //   if (core.trkO) {
  //     core.eH.push(
  //       eventHandler(core.trkO as HTMLElement, `scroll`, () => {
  //         logTrackScroll();
  //       })
  //     );
  //   }
  //   if (core.scbarB) {
  //     toggleTouchEvents(core, `sb`);
  //   }
  // };

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
        core.eH.push(
          eventHandler(
            images[img] as HTMLElement,
            `dragstart`,
            (event: Event) => {
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
      const tempArr = [];
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
          )
        };
      } else {
        // throw new TypeError(cDuplicateBreakpointsTypeError);
        console.error(cDuplicateBreakpointsTypeError);
        return {};
      }
    } catch (e) {
      // throw new TypeError(cBreakpointsParseTypeError);
      console.error(cBreakpointsParseTypeError);
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
      verH: settings.verH,
      verP: 1
    };
    const tempArr = [];
    if (settings.res && settings.res.length > 0) {
      let settingsLen = settings.res.length;
      while (settingsLen--) {
        tempArr.push(settings.res[settingsLen]);
      }
    }
    tempArr.push(defaultBreakpoint);
    const updatedArr = validateBreakpoints(tempArr);

    if (updatedArr.val) {
      const bpArr = [updatedArr.bp[0]];
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
        if (typeof bp2.verH === `undefined`) {
          bp2.verH = bp1.verH;
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
    const settingsobj: ICoreSettings = {
      // _2Scroll: settings.enableScrollbar ? 1 : settings.slidesToScroll,
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
      gutr: settings.slideGutter,
      hidCls: settings.hiddenClass,
      // inf: settings.enableScrollbar ? false : settings.isInfinite,
      inf: settings.isInfinite,
      kb: settings.enableKeyboard,
      nDirCls: settings.nextDirectionClass,
      pauseHov: settings.pauseOnHover,
      pDirCls: settings.previousDirectionClass,
      res: [],
      rtl: settings.isRtl,
      // scbar: settings.enableScrollbar,
      speed: settings.animationSpeed,
      startAt: settings.animationSpeed,
      swipe: settings.enableTouchSwipe,
      threshold: settings.touchThreshold,
      useTitle: settings.useTitlesAsDots,
      ver: settings.isVertical,
      verH: settings.verticalHeight,
      verP: 1,
      effect: (() => {
        if (cAnimationEffects.indexOf(settings.animationEffect) > -1) {
          return settings.animationEffect;
        }
        console.warn(cNoEffectFoundError);
        return cAnimationEffects[0];
      })(),
      easeFn: (() => {
        if (cEasingFunctions[settings.easingFunction]) {
          return settings.easingFunction;
        }
        console.warn(cNoEasingFoundError);
        return Object.keys(cEasingFunctions)[0];
      })()
    };

    if (settings.breakpoints && settings.breakpoints.length > 0) {
      for (let i = 0; i < settings.breakpoints.length; i++) {
        const obj: ICoreBreakpoint = {
          // _2Scroll: settings.enableScrollbar
          //   ? 1
          //   : settings.breakpoints[i].slidesToScroll,
          _2Scroll: settings.breakpoints[i].slidesToScroll,
          _2Show: settings.breakpoints[i].slidesToShow,
          _arrows: settings.breakpoints[i].showArrows,
          _nav: settings.breakpoints[i].showNavigation,
          bp: settings.breakpoints[i].minWidth,
          bpSLen: 0,
          cntr: settings.breakpoints[i].centerBetween,
          dots: [],
          gutr: settings.breakpoints[i].slideGutter,
          nav: null,
          nDups: [],
          pDups: [],
          swipe: settings.breakpoints[i].enableTouchSwipe,
          verH: settings.breakpoints[i].verticalHeight,
          verP: 1
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
   * @param root - The root element which needs to be initialized as Carouzel slider
   * @param settings - The options applicable to the same Carouzel slider
   *
   */
  const init = (root: HTMLElement, settings: ISettings) => {
    if (typeof settings.beforeInitFn === `function`) {
      settings.beforeInitFn();
    }

    const cCore = {} as ICore;
    cCore.root = root;
    cCore.o = mapSettings(settings);

    const ds = root.querySelectorAll(`${cSelectors.slide}`);
    cCore._ds = [];
    for (let i = 0; i < ds.length; i++) {
      cCore._ds.push(ds[i] as HTMLElement);
    }
    cCore.arrowN = root.querySelector(`${cSelectors.arrowN}`);
    cCore.arrowP = root.querySelector(`${cSelectors.arrowP}`);
    cCore.bPause = root.querySelector(`${cSelectors.pauseBtn}`);
    cCore.bPlay = root.querySelector(`${cSelectors.playBtn}`);
    cCore.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
    cCore.ctrlW = root.querySelector(`${cSelectors.ctrlW}`);
    cCore.eH = [];
    cCore.nav = root.querySelector(`${cSelectors.nav}`);
    cCore.navW = root.querySelector(`${cSelectors.navW}`);
    cCore.pts = {};
    cCore.sLen = cCore._ds.length;
    cCore.trk = root.querySelector(`${cSelectors.trk}`);
    cCore.trkM = root.querySelector(`${cSelectors.trkM}`);
    cCore.trkO = root.querySelector(`${cSelectors.trkO}`);
    cCore.trkW = root.querySelector(`${cSelectors.trkW}`);
    cCore.curp = root.querySelector(`${cSelectors.curp}`);
    cCore.totp = root.querySelector(`${cSelectors.totp}`);
    cCore.fLoad = true;

    if ((settings.syncWith || ``).length > 0) {
      cCore.sync = settings.syncWith;
    }

    if (cCore.o.rtl) {
      cCore.root.setAttribute(cSelectors.rtl.slice(1, -1), `true`);
    }

    cCore._t = {} as ITimer;
    cCore._t.total = cCore.o.speed;

    if (!cCore._ds[cCore.ci]) {
      cCore.ci = settings.startAtIndex = 0;
    }

    if (cCore.trk && cCore.sLen > 0) {
      if (cCore.o.auto) {
        cCore.o.inf = true;
        togglePauseOnHover(cCore);
      }
      cCore.bpall = updateBreakpoints(cCore.o);
      if (cCore.bpall.length > 0) {
        makeStuffUndraggable(cCore);
        toggleKeyboard(cCore);
        generateElements(cCore);
        // generateScrollbar(cCore);
        toggleControlButtons(cCore);
        toggleTouchEvents(cCore, `sl`);
        applyLayout(cCore);
      }
    }

    addClass(cCore.root as HTMLElement, cCore.o.activeCls);

    if (cCore.o.ver) {
      cCore.root.setAttribute(cSelectors.ver.slice(1, -1), `true`);
    }
    if (!isNaN(cCore.o.cntr) && cCore.o.cntr > 0) {
      cCore.root.setAttribute(cSelectors.cntr.slice(1, -1), `true`);
    }
    for (let r = 0; r < cCore.o.res.length; r++) {
      if (!isNaN(cCore.o.res[r].cntr) && cCore.o.res[r].cntr > 0) {
        cCore.root.setAttribute(cSelectors.cntr.slice(1, -1), `true`);
      }
    }

    if (cCore.o.auto) {
      toggleAutoplay(cCore);
    }
    if (typeof settings.afterInitFn === `function`) {
      settings.afterInitFn();
    }
    if (settings.trackUrlHash && window?.location?.hash) {
      let windowHash = window.location.hash || ``;
      if (windowHash.charAt(0) === `#`) {
        windowHash = windowHash.slice(1, windowHash.length);
      }
      if ((windowHash || ``).length > 0) {
        const thisSlides = cCore.root.querySelectorAll(`${cSelectors.slide}`);
        let foundSlideIndex = -1;
        for (let s = 0; s < thisSlides.length; s++) {
          if (thisSlides[s].getAttribute(`id`) === windowHash) {
            foundSlideIndex = s;
            break;
          }
        }
        if (foundSlideIndex !== -1) {
          go2Slide(cCore, foundSlideIndex);
        }
      }
    }
    return cCore;
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
    const tempArr = [] as IRoot;
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
    const id = core.root?.getAttribute(`id`);
    const allElems = (core.root as HTMLElement).querySelectorAll(`*`);
    for (let i = allElems.length - 1; i >= 0; i--) {
      removeEventListeners(core, allElems[i]);
      if (core.trk && hasClass(allElems[i] as HTMLElement, core.o.dupCls)) {
        core.trk.removeChild(allElems[i]);
      }

      if (core.nav && allElems[i].hasAttribute(cSelectors.dot.slice(1, -1))) {
        core.nav.removeChild(allElems[i]);
      }
      allElems[i].removeAttribute(`style`);
      removeClass(
        allElems[i] as HTMLElement,
        `${core.o.activeCls} ${core.o.editCls} ${core.o.disableCls} ${core.o.dupCls}`
      );
      if ((allElems[i] as HTMLElement).hasAttribute(`disabled`)) {
        (allElems[i] as HTMLElement).removeAttribute(`disabled`);
      }
    }

    removeClass(
      core.root as HTMLElement,
      `${core.o.activeCls} ${core.o.editCls} ${core.o.disableCls} ${core.o.dupCls}`
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
    /**
     * Constructor
     * @constructor
     */
    constructor(thisid: string, root: HTMLElement, options?: ISettings) {
      allLocalInstances[thisid] = init(root, { ...cDefaults, ...options });
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
     * Constructor
     * @constructor
     */
    constructor() {
      if (document as Document) {
        document.addEventListener(
          `visibilitychange`,
          documentVisibilityFn,
          false
        );
      }
    }

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
        for (iloop = 0; iloop < elementsLength; iloop++) {
          const id = elements[iloop].getAttribute(`id`);
          let isElementPresent = false;
          if (id) {
            for (jloop = 0; jloop < instanceLength; jloop++) {
              if (allLocalInstances[id]) {
                isElementPresent = true;
                break;
              }
            }
          }

          if (!isElementPresent) {
            let newOptions;
            const autoDataAttr =
              (elements[iloop] as HTMLElement).getAttribute(
                cSelectors.rootAuto.slice(1, -1)
              ) || ``;
            if (autoDataAttr) {
              try {
                newOptions = JSON.parse(
                  stringTrim(autoDataAttr).replace(/'/g, `"`)
                );
              } catch (e) {
                // throw new TypeError(cOptionsParseTypeError);
                console.error(cOptionsParseTypeError);
              }
            } else {
              newOptions = options;
            }
            if (id) {
              new Core(id, elements[iloop] as HTMLElement, newOptions);
            } else {
              const thisid = id
                ? id
                : { ...cDefaults, ...newOptions }.idPrefix +
                  `_` +
                  new Date().getTime() +
                  `_root_` +
                  (iloop + 1);
              elements[iloop].setAttribute(`id`, thisid);
              new Core(thisid, elements[iloop] as HTMLElement, newOptions);
            }
          }
        }
        if (window && getCoreInstancesLength() > 0 && !isWindowEventAttached) {
          isWindowEventAttached = true;
          window.addEventListener(`resize`, winResizeFn, false);
        }
      } else {
        if (query !== cSelectors.rootAuto) {
          // throw new TypeError(cRootSelectorTypeError);
          console.error(`init() "${query}": ${cRootSelectorTypeError}`);
        }
      }
    };

    /**
     * Function to auto-initialize the Carouzel plugin for specific carouzels
     */
    public initGlobal = () => {
      this.init(cSelectors.rootAuto, {} as ISettings);
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
        for (iloop = 0; iloop < cores.length; iloop++) {
          if (cAnimationDirections.indexOf(target) !== -1) {
            target === cAnimationDirections[0]
              ? go2Prev(cores[iloop], 0)
              : go2Next(cores[iloop], 0);
          } else if (!isNaN(parseInt(target, 10))) {
            go2Slide(cores[iloop], parseInt(target, 10) - 1);
          }
        }
      } else {
        // throw new TypeError(cRootSelectorTypeError);
        console.error(`goToSlide() "${query}": ${cRootSelectorTypeError}`);
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
        for (iloop = 0; iloop < cores.length; iloop++) {
          destroy(cores[iloop]);
        }
        if (window && getCoreInstancesLength() === 0) {
          window.removeEventListener(`resize`, winResizeFn, false);
        }
      } else {
        // throw new TypeError(cRootSelectorTypeError);
        console.error(`destroy() "${query}": ${cRootSelectorTypeError}`);
      }
    };

    // TODO: FUTURE APPEND AND PREPEND SLIDE IMPLEMENTATION
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
Carouzel.Root.getInstance().initGlobal();
if (typeof exports === `object` && typeof module !== `undefined`) {
  module.exports = Carouzel;
}
