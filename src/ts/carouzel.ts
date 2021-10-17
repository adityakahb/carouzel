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
  "use strict";

  interface IRoot {
    [key: string]: any;
  }

  interface ICarouzelCoreBreakpoint {
    _2Scroll: number;
    _2Show: number;
    _arrows: boolean;
    _nav: boolean;
    bp: number | string;
    bpSLen: number;
    cntr: number;
    dots: Node[];
    nDups: Node[];
    pDups: Node[];
    swipe: boolean;
  }
  
  interface ICarouzelCoreSettings {
    _2Scroll: number;
    _2Show: number;
    _arrows: boolean;
    _nav: boolean;
    activeCls: string;
    aFn?: Function;
    auto: boolean;
    autoS: number;
    bFn?: Function;
    cntr: number;
    cntrCls: string;
    disableCls: string;
    dotCls: string;
    dotNcls: string;
    dupCls: string;
    editCls: string;
    effect: string;
    fadCls: string;
    hidCls: string;
    idPrefix?: string;
    inf: boolean;
    isRTL?: boolean;
    kb: boolean;
    pauseHov: boolean;
    res?: ICarouzelCoreBreakpoint[];
    rtlCls?: string;
    speed: number;
    startAt: number;
    swipe: boolean;
    threshold: number;
    timeFn: string;
  }
  
  interface ICarouzelBreakpoint {
    breakpoint: number | string;
    centerBetween: number;
    hasTouchSwipe: boolean;
    showArrows: boolean;
    showNavigation: boolean;
    slidesToScroll: number;
    slidesToShow: number;
  }

  interface ICarouzelSettings {
    activeClass: string;
    afterInit?: Function;
    afterScroll?: Function;
    animationEffect: string;
    animationSpeed: number;
    autoplay: boolean;
    autoplaySpeed: number;
    beforeInit?: Function;
    beforeScroll?: Function;
    centerBetween: number;
    centeredClass: string;
    disabledClass: string;
    dotTitleClass: string;
    dotIndexClass: string;
    duplicateClass: string;
    editClass: string;
    enableKeyboard: boolean;
    fadingClass: string;
    hasTouchSwipe: boolean;
    hiddenClass: string;
    idPrefix: string,
    isInfinite: boolean;
    isRTL?: boolean;
    pauseOnHover: boolean;
    responsive?: ICarouzelBreakpoint[];
    rtlClass?: string;
    showArrows: boolean;
    showNavigation: boolean;
    slidesToScroll: number;
    slidesToShow: number;
    startAtIndex: number;
    timingFunction: string
    touchThreshold: number;
  }

  interface IEventHandler {
    element: Element | Document | Window;
    remove: Function;
  }

  interface IIndexHandler {
    [key: number]: number;
  }

  interface ICore {
    _as: NodeListOf<Element>;
    _ds: NodeListOf<Element>;
    appendSlide: Function;
    arrowN: HTMLElement | null;
    arrowP: HTMLElement | null;
    controlsW: HTMLElement | null;
    autoTimer: any;
    bpall: ICarouzelCoreBreakpoint[];
    bpo_old: ICarouzelCoreBreakpoint;
    bpo: ICarouzelCoreBreakpoint;
    ci: number;
    ct: number;
    eHandlers: any[];
    goToNext: Function;
    goToPrevious: Function;
    goToSlide: Function;
    isLeftAdded: boolean;
    nav: HTMLElement | null;
    navW: HTMLElement | null;
    paused: boolean;
    pi: number;
    prependSlide: Function;
    pts: IIndexHandler;
    rootElem: HTMLElement | null;
    settings: ICarouzelCoreSettings;
    sLength: number;
    sWidth: number;
    track: HTMLElement | null;
    trackO: HTMLElement | null;
    trackW: HTMLElement | null;
  }

  interface ICoreInstance {
    [key: string]: ICore;
  }

  let allLocalInstances: ICoreInstance = {};
  let isWindowEventAttached = false;
  let winResize: any;
  const _animationEffects = ['scroll', 'fade'];
  const _rootSelectorTypeError = 'Element(s) with the provided query do(es) not exist';
  const _optionsParseTypeError = 'Unable to parse the options string';
  const _duplicateBreakpointsTypeError = 'Duplicate breakpoints found';
  const _breakpointsParseTypeError = 'Error parsing breakpoints';
  const _useCapture = false;
  const _Selectors = {
    arrowN: '[data-carouzel-nextarrow]',
    arrowP: '[data-carouzel-previousarrow]',
    controlsW: '[data-carouzel-controlswrapper]',
    dot: '[data-carouzel-navbutton]',
    nav: '[data-carouzel-navigation]',
    navW: '[data-carouzel-navigationwrapper]',
    root: '[data-carouzel]',
    rootAuto: '[data-carouzel-auto]',
    slide: '[data-carouzel-slide]',
    stitle: '[data-carouzel-title]',
    track: '[data-carouzel-track]',
    trackO: '[data-carouzel-trackouter]',
    trackW: '[data-carouzel-trackwrapper]',
  };
  const _Defaults:ICarouzelSettings = {
    activeClass: '__carouzel-active',
    animationEffect: _animationEffects[0],
    animationSpeed: 400,
    autoplay: false,
    autoplaySpeed: 3000,
    centerBetween: 0,
    centeredClass: '__carouzel-centered',
    disabledClass: '__carouzel-disabled',
    dotTitleClass: '__carouzel-pagetitle',
    dotIndexClass: '__carouzel-pageindex',
    duplicateClass: '__carouzel-duplicate',
    editClass: '__carouzel-editmode',
    enableKeyboard: true,
    fadingClass: '__carouzel-fade',
    hasTouchSwipe: true,
    hiddenClass: '__carouzel-hidden',
    idPrefix: '__carouzel',
    isInfinite: true,
    isRTL: false,
    pauseOnHover: false,
    responsive: [],
    rtlClass: '__carouzel-rtl',
    showArrows: true,
    showNavigation: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    startAtIndex: 1,
    timingFunction: 'ease-in-out',
    touchThreshold: 120,
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
    return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
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
    if (element) {
      const clsarr = element.className.split(' ');
      return clsarr.indexOf(cls) > -1 ? true : false;
    }

    return false;
  };

  /**
   * Function to add a string to an element's class attribute
   * 
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const addClass = (element: Element, cls: string) => {
    if (element) {
      let clsarr = cls.split(' ');
      let clsarrLength = clsarr.length;
      for (let i = 0; i < clsarrLength; i++) {
        let thiscls = clsarr[i];
        if (!hasClass(element, thiscls)) {
          element.className += ' ' + thiscls;
        }
      }
      element.className = stringTrim(element.className);
    }
  };

  /**
   * Function to remove a string from an element's class attribute
   * 
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const removeClass = (element: Element, cls: string) => {
    if (element) {
      let clsarr = cls.split(' ');
      let curclass = element.className.split(' ');
      let curclassLength = curclass.length;
      for (let i = 0; i < curclassLength; i++) {
        let thiscls = curclass[i];
        if (clsarr.indexOf(thiscls) > -1) {
          curclass.splice(i, 1);
          i--;
        }
      }
      element.className = stringTrim(curclass.join(' '));
    }
  };

  /**
   * Function to remove all local events assigned to the navigation elements.
   * 
   * @param core - Carouzel instance core object
   * @param element - An HTML Element from which the events need to be removed
   *
   */
  const removeEventListeners = (core: any, element: Element | Document | Window) => {
    if ((core.eventHandlers || []).length > 0) {
      let j = core.eventHandlers.length;
      while (j--) {
        if(core.eventHandlers[j].element.isEqualNode && core.eventHandlers[j].element.isEqualNode(element)) {
          core.eventHandlers[j].remove();
          core.eventHandlers.splice(j, 1);
        }
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
  const eventHandler = (element: Element | Document | Window, type: string, listener: EventListenerOrEventListenerObject) => {
    const eventHandler:IEventHandler = {
      element: element,
      remove: () => {
        element.removeEventListener(type, listener, _useCapture);
      }
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandler;
  };

  /**
   * Function to update CSS classes on all respective elements
   * 
   * @param core - Carouzel instance core object
   *
   */
  const updateAttributes = (core: ICore) => {
    let x;
    for (let i=0; i<core._as.length; i++) {
      removeClass(core._as[i] as Element, core.settings.activeCls);
      core._as[i].setAttribute('aria-hidden', 'true');
    }
    for (let i=core.ci + core.bpo.pDups.length; i<core.ci + core.bpo.pDups.length + core.bpo._2Show; i++) {
      addClass(core._as[i] as Element, core.settings.activeCls);
      core._as[i].removeAttribute('aria-hidden');
    }
    if (!core.settings.inf && core.ci === 0) {
      addClass(core.arrowP as Element, core.settings.disableCls || '');
    } else {
      removeClass(core.arrowP as Element, core.settings.disableCls || '');
    }
    if (!core.settings.inf && core.ci === core.sLength - core.bpo._2Show) {
      addClass(core.arrowN as Element, core.settings.disableCls || '');
    } else {
      removeClass(core.arrowN as Element, core.settings.disableCls || '');
    }
    if (core.bpo.dots.length > 0) {
      for (let i=0; i<core.bpo.dots.length; i++) {
        removeClass(core.bpo.dots[i] as Element, core.settings.activeCls);
      }
      x = Math.floor(core.ci / core.bpo._2Scroll);
      if (x < 0) {
        x = core.bpo.dots.length - 1;
      }
      if (core.bpo.dots[x]) {
        addClass(core.bpo.dots[x] as Element, core.settings.activeCls);
      }
    }
  };

  /**
   * Function to animate the track element based on the calculations
   * 
   * @param core - Carouzel instance core object
   *
   */
  const animateTrack = (core: ICore, isSmooth: boolean) => {
    if (typeof core.settings.bFn === 'function') {
      core.settings.bFn();
    }
    if (core.settings.inf && core.track) {
      core.track.style.transitionProperty = 'none';
      core.track.style.transitionTimingFunction = 'unset';
      core.track.style.transitionDuration = '0ms';
      core.track.style.transform = `translate3d(${-core.pts[core.pi]}px, 0, 0)`;
    } else {
      if (core.ci < 0) {
        core.ci = 0;
      }
      if (core.ci + core.bpo._2Show >= core.sLength) {
        core.ci = core.sLength - core.bpo._2Show;
      }
    }
    if (core.settings.effect === _animationEffects[0]) {
      setTimeout(() => {
        if (core.track) {
          core.track.style.transitionProperty = 'transform';
          if (isSmooth) {
            core.track.style.transitionTimingFunction = core.settings.timeFn;
            core.track.style.transitionDuration = `${core.settings.speed}ms`;
          }
          core.track.style.transform = `translate3d(${-core.pts[core.ci]}px, 0, 0)`;
          core.ct = -core.pts[core.ci];
          updateAttributes(core);
        }
      }, 0);
    }
    if (core.settings.effect === _animationEffects[1]) {
      const postOpacity = () => {
        setTimeout(() => {
          if (core.track) {
            core.track.style.transform = `translate3d(${-core.pts[core.ci]}px, 0, 0)`;
            core.track.style.opacity = '1';
          }
        }, core.settings.speed);
      };
      setTimeout(() => {
        if (core.track) {
          core.track.style.transitionProperty = 'opacity';
          core.track.style.transitionTimingFunction = core.settings.timeFn;
          core.track.style.transitionDuration = `${core.settings.speed}ms`;
          core.track.style.opacity = '0';
          core.ct = -core.pts[core.ci];
          updateAttributes(core);
          postOpacity();
        }
      }, 0);
    }
    setTimeout(() => {
      if (typeof core.settings.aFn === 'function') {
        core.settings.aFn();
      }
    }, core.settings.speed);
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
  const manageDuplicates = (track: HTMLElement, bpo: ICarouzelCoreBreakpoint, duplicateClass: string) => {
    let duplicates = track.querySelectorAll('.' + duplicateClass);
    for (let i=0; i < duplicates.length; i++) {
      track.removeChild(duplicates[i]);
    }
    for (let i=bpo.pDups.length - 1; i >= 0; i--) {
      doInsertBefore(track, bpo.pDups[i]);
    }
    for (let i=0; i < bpo.nDups.length; i++) {
      doInsertAfter(track, bpo.nDups[i]);
    }
  }



  /**
   * Function to find and apply the appropriate breakpoint settings based on the viewport
   * 
   * @param core - Carouzel instance core object
   *
   */
  const applyLayout = (core: ICore) => {
    let viewportWidth = window.innerWidth;
    let bpoptions = core.bpall[0];
    let len = 0;
    let slideWidth = 0;
    let trackWidth = 0;

    while(len < core.bpall.length) {
      if ((core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) || typeof core.bpall[len + 1] === 'undefined') {
        bpoptions = core.bpall[len];
        break;
      }
      len++;
    }
    if (core.rootElem && !hasClass(core.rootElem, core.settings.editCls) && (core.bpo_old || {})._2Show !== bpoptions._2Show && core.track) {
      manageDuplicates(core.track, bpoptions, core.settings.dupCls || '');
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
      addClass(core.controlsW, core.settings.hidCls);
    } else if (core.controlsW) {
      removeClass(core.controlsW, core.settings.hidCls);
    }
    if (!bpoptions._nav && core.navW) {
      addClass(core.navW, core.settings.hidCls);
    } else if (core.navW) {
      removeClass(core.navW, core.settings.hidCls);
    }
    if (core.trackO && core.trackW && core.track) {
      core.pts = {};
      if (bpoptions.cntr > 0) {
        addClass(core.trackO, core.settings.cntrCls);
      } else {
        removeClass(core.trackO, core.settings.cntrCls);
      }
      slideWidth = core.trackO.clientWidth / (bpoptions._2Show + bpoptions.cntr);
      core.sWidth = slideWidth;

      trackWidth = parseFloat(slideWidth + '') * (core.sLength >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show);
      core.track.style.width = trackWidth.toFixed(4) + 'px';
      core.trackW.style.width = (bpoptions._2Show * slideWidth).toFixed(4) + 'px';
      core._as = core.trackW.querySelectorAll(_Selectors.slide);
      for (let i = 0; i < core._as.length; i++) {
        (core._as[i] as HTMLElement).style.width = slideWidth.toFixed(4) + 'px';
      }
      for (let i = bpoptions.pDups.length; i > 0; i--) {
        core.pts[-i] = (-i + bpoptions.pDups.length) * slideWidth;
      }
      for (let i = 0; i < core.sLength; i++) {
        core.pts[i] = (i + bpoptions.pDups.length) * slideWidth;
      }
      for (let i = core.sLength; i < core.sLength + bpoptions.nDups.length; i++) {
        core.pts[i] = (i + bpoptions.pDups.length) * slideWidth;
      }
      animateTrack(core, false);
    }
  };

  /**
   * Function to go to the specific slide number
   * 
   * @param core - Carouzel instance core object
   * @param slidenumber - Slide index to which the carouzel should be scrolled to
   *
   */
  const goToSlide = (core: ICore, slidenumber:number) => {
    if (core.ci !== slidenumber) {
      core.pi = core.ci;
      core.ci = slidenumber * core.bpo._2Scroll;
      animateTrack(core, true);
    }
  };

  /**
   * Function to go to the previous set of slides
   * 
   * @param core - Carouzel instance core object
   *
   */
  const goToPrev = (core: ICore) => {
    core.pi = core.ci;
    core.ci -= core.bpo._2Scroll;
    if (core.settings.inf) {
      if (typeof core.pts[core.ci] === 'undefined') {
        core.pi = core.sLength - 1;
        core.ci = core.pi - core.bpo._2Show;        
      } else {
        core.pi = core.ci + core.bpo._2Scroll;
      }
    }
    animateTrack(core, true);
  };

  /**
   * Function to go to the next set of slides
   * 
   * @param core - Carouzel instance core object
   *
   */
  const goToNext = (core: ICore) => {
    core.pi = core.ci;
    core.ci += core.bpo._2Scroll;
    if (core.settings.inf) {
      if (typeof core.pts[core.ci + core.bpo._2Show] === 'undefined') {
        core.pi = core.pi - core.sLength;
        core.ci = 0;
      } else {
        core.pi = core.ci - core.bpo._2Scroll;
      }
    }
    animateTrack(core, true);
  };

  /**
   * Function to add click events to the arrows
   * 
   * @param core - Carouzel instance core object
   *
   */
  const toggleArrows = (core: ICore) => {
    if (core.arrowP) {
      core.eHandlers.push(eventHandler(core.arrowP, 'click', (event: Event) => {
        event.preventDefault();
        goToPrev(core);
      }));
    }
    if (core.arrowN) {
      core.eHandlers.push(eventHandler(core.arrowN, 'click', (event: Event) => {
        event.preventDefault();
        goToNext(core);
      }));
    }
  };
  
  /**
   * Function to add touch events to the track
   * 
   * @param core - Carouzel instance core object
   *
   */
  const toggleTouchEvents = (core: ICore) => {
    let posX1 = 0;
    let posX2 = 0;
    let posFinal = 0;
    let threshold = core.settings.threshold || 100;
    let dragging = false;

    /**
     * Local function for Touch Start event
     * 
     */
    const touchStart = (thisevent: Event) => {
      thisevent.preventDefault();
      dragging = true;
      if (thisevent.type === 'touchstart') {
        posX1 = (thisevent as TouchEvent).touches[0].clientX;
      } else {
        posX1 = (thisevent as MouseEvent).clientX;
      }
      if (core.track) {
        core.track.style.transitionProperty = core.settings.effect;
        core.track.style.transitionTimingFunction = core.settings.timeFn;
        core.track.style.transitionDuration = `${core.settings.speed}ms`;
      }
    };

    /**
     * Local function for Touch Move event
     *
     */
    const touchMove = (thisevent: Event) => {
      if (dragging && core.track) {
        if (thisevent.type == 'touchmove') {
          posX2 = posX1 - (thisevent as TouchEvent).touches[0].clientX;
        } else {
          posX2 = posX1 - (thisevent as MouseEvent).clientX;
        }
        if (core.settings.effect === _animationEffects[0]) {
          core.track.style.transform = `translate3d(${core.ct - posX2}px, 0, 0)`; 
        }
        posFinal = posX2;
      }
    };

    /**
     * Local function for Touch End event
     *
     */
    const touchEnd = () => {
      if (dragging && core.track) {
        if (posFinal < -threshold) {
          goToPrev(core);
        } else if (posFinal > threshold) {
          goToNext(core);
        } else {
          core.track.style.transform = `translate3d(${core.ct}px, 0, 0)`;
        }
      }
      if (core.track) {
        core.track.style.transitionProperty = 'none';
        core.track.style.transitionTimingFunction = 'unset';
        core.track.style.transitionDuration = '0ms';
      }
      posX1 = posX2 = posFinal = 0;
      dragging = false;
    };

    core.eHandlers.push(eventHandler(core.track as HTMLElement, 'touchstart', function(event: Event) {
      touchStart(event);
    }));
    core.eHandlers.push(eventHandler(core.track as HTMLElement, 'touchmove', function(event: Event) {
      touchMove(event);
    }));
    core.eHandlers.push(eventHandler(core.track as HTMLElement, 'touchend', function() {
      touchEnd();
    }));
    core.eHandlers.push(eventHandler(core.track as HTMLElement, 'mousedown', function(event: Event) {
      touchStart(event);
    }));
    core.eHandlers.push(eventHandler(core.track as HTMLElement, 'mouseup', function() {
      touchEnd();
    }));
    core.eHandlers.push(eventHandler(core.track as HTMLElement, 'mouseleave', function() {
      touchEnd();
    }));
    core.eHandlers.push(eventHandler(core.track as HTMLElement, 'mousemove', function(event: Event) {
      touchMove(event);
    }));
  };

  /**
   * Function to generate duplicate elements and dot navigation before hand for all breakpoints
   * 
   * @param core - Carouzel instance core object
   *
   */
  const generateElements = (core: ICore) => {
    for (let i=0; i<core.bpall.length; i++) {
      core.bpall[i].bpSLen = core.sLength;
      if (core.settings.inf) {
        for (let j=core.sLength - core.bpall[i]._2Show; j<core.sLength; j++) {
          let elem = core._ds[j].cloneNode(true);
          addClass(elem as Element, core.settings.dupCls || '');
          core.bpall[i].bpSLen++;
          core.bpall[i].pDups.push(elem);
        }
        for (let j=0; j<core.bpall[i]._2Show; j++) {
          let elem = core._ds[j].cloneNode(true);
          addClass(elem as Element, core.settings.dupCls || '');
          core.bpall[i].bpSLen++;
          core.bpall[i].nDups.push(elem);
        }
      }
    }
    for (let i=0; i < core.bpall.length; i++) {
      let pageLength = Math.floor(core.sLength / core.bpall[i]._2Scroll);
      let navBtns: Node[] = [];
      let var1 = core.sLength % core.bpall[i]._2Scroll;
      let var2 = core.bpall[i]._2Show - core.bpall[i]._2Scroll;
      if (var2 > var1) {
        pageLength--;
      }
      if (var2 < var1) {
        pageLength++;
      }
      core.bpall[i].dots = [];
      let btnStr = '';
      for (let j=0; j < pageLength; j++) {
        let elem = document.createElement('button');
        elem.setAttribute(_Selectors.dot.slice(1, -1), '');
        elem.setAttribute('type', 'button');
        btnStr = `<div class="${core.settings.dotNcls}">${(j + 1)}</div>`;
        if (core.bpall[i]._2Show === 1 && core._ds[i].getAttribute(_Selectors.stitle.slice(1, -1))) {
          btnStr += core._ds[i].getAttribute(_Selectors.stitle.slice(1, -1));
          addClass(elem, core.settings.dotCls);
        }
        elem.innerHTML = btnStr;
        navBtns.push(elem);
      }
      for (let j=0; j < pageLength; j++) {
        core.eHandlers.push(eventHandler(navBtns[j] as HTMLElement, 'click', function (event: Event) {
          event.preventDefault();
          core.pi = core.ci;
          core.ci = j * core.bpall[i]._2Scroll;
          animateTrack(core, true);
        }));
        core.bpall[i].dots.push(navBtns[j]);
      }
    }
  };

  /**
   * Function to validate all breakpoints to check duplicates
   * 
   * @param breakpoints - Breakpoint settings array
   *
   */
  const validateBreakpoints = (breakpoints: ICarouzelCoreBreakpoint[]) => {
    try {
      let tempArr = [];
      let len = breakpoints.length;
      while(len--) {
        if (tempArr.indexOf(breakpoints[len].bp) === -1) {
          tempArr.push(breakpoints[len].bp);
        }
      }
      if (tempArr.length === breakpoints.length) {
        return {
          val: true,
          bp: breakpoints.sort((a, b) => parseFloat(a.bp as string) - parseFloat(b.bp as string))
        };
      } else {
        throw new TypeError(_duplicateBreakpointsTypeError);
      }
    } catch (e) {
      throw new TypeError(_breakpointsParseTypeError);
    }
  }

  /**
   * Function to update breakpoints to override missing settings from previous breakpoint
   * 
   * @param settings - Core settings object containing merge of default and custom settings
   *
   */
  const updateBreakpoints = (settings: ICarouzelCoreSettings) => {
    const defaultBreakpoint: ICarouzelCoreBreakpoint = {
      _2Scroll: settings._2Scroll,
      _2Show: settings._2Show,
      _arrows: settings._arrows,
      _nav: settings._nav,
      bp: 0,
      bpSLen: 0,
      cntr: settings.cntr,
      dots: [],
      nDups: [],
      pDups: [],
      swipe: settings.swipe,
    };
    let tempArr = [];
    if (settings.res && settings.res.length > 0) {
      let settingsLength = settings.res.length;
      while(settingsLength--) {
        tempArr.push(settings.res[settingsLength]);
      }
    }
    tempArr.push(defaultBreakpoint);
    let updatedArr = validateBreakpoints(tempArr);
    if (updatedArr.val) {
      let bpArr = [updatedArr.bp[0]];
      let bpLen = 1;
      let bp1: ICarouzelCoreBreakpoint;
      let bp2: ICarouzelCoreBreakpoint;
      while(bpLen < updatedArr.bp.length) {
        bp1 = bpArr[bpLen-1];
        bp2 = {...bp1, ...updatedArr.bp[bpLen]};
        if (typeof bp2._arrows === 'undefined') {
          bp2._arrows = bp1._arrows;
        }
        if (typeof bp2._nav === 'undefined') {
          bp2._nav = bp1._nav;
        }
        if (typeof bp2._2Show === 'undefined') {
          bp2._2Show = bp1._2Show;
        }
        if (typeof bp2._2Scroll === 'undefined') {
          bp2._2Scroll = bp1._2Scroll;
        }
        if (typeof bp2.swipe === 'undefined') {
          bp2.swipe = bp1.swipe;
        }
        if (typeof bp2.cntr === 'undefined') {
          bp2.cntr = bp1.cntr;
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
  const mapSettings = (settings: ICarouzelSettings) => {
    let settingsobj: ICarouzelCoreSettings = {
      _2Scroll: settings.slidesToScroll,
      _2Show: settings.slidesToShow,
      _arrows: settings.showArrows,
      _nav: settings.showNavigation,
      activeCls: settings.activeClass,
      aFn: settings.afterScroll,
      auto: settings.autoplay,
      autoS: settings.autoplaySpeed,
      bFn: settings.beforeScroll,
      cntr: settings.centerBetween,
      cntrCls: settings.centeredClass,
      disableCls: settings.disabledClass,
      dotCls: settings.dotTitleClass,
      dotNcls: settings.dotIndexClass,
      dupCls: settings.duplicateClass,
      editCls: settings.editClass,
      effect: settings.animationEffect,
      fadCls: settings.fadingClass,
      hidCls: settings.hiddenClass,
      inf: settings.isInfinite,
      isRTL: settings.isRTL,
      kb: settings.enableKeyboard,
      pauseHov: settings.pauseOnHover,
      res: [],
      rtlCls: settings.rtlClass,
      speed: settings.animationSpeed,
      startAt: settings.animationSpeed,
      swipe: settings.hasTouchSwipe,
      threshold: settings.touchThreshold,
      timeFn: settings.timingFunction,
    }

    if (settings.responsive && settings.responsive.length > 0)  {
      for (let i = 0; i < settings.responsive.length; i++) {
        let obj: ICarouzelCoreBreakpoint = {
          _2Scroll: settings.responsive[i].slidesToScroll,
          _2Show: settings.responsive[i].slidesToShow,
          _arrows: settings.responsive[i].showArrows,
          _nav: settings.responsive[i].showNavigation,
          bp: settings.responsive[i].breakpoint,
          bpSLen: 0,
          cntr: settings.responsive[i].centerBetween,
          dots: [],
          nDups: [],
          pDups: [],
          swipe: settings.responsive[i].hasTouchSwipe,
        }
        if (settingsobj.res) {
          settingsobj.res.push(obj);
        }
      }
    }

    return settingsobj;
  };
  
  /**
   * Function to toggle Autoplay and pause on hover functionalities for the carouzel
   * 
   * @param core - Carouzel instance core object
   *
   */
  const toggleAutoplay = (core: ICore) => {
    if (core.rootElem && core.settings.pauseHov) {
      core.eHandlers.push(eventHandler(core.rootElem, 'mouseenter', function () {
        core.paused = true;
      }));
      core.eHandlers.push(eventHandler(core.rootElem, 'mouseleave', function () {
        core.paused = false;
      }));
    }
    if (!core.settings.pauseHov) {
      core.paused = false;
    }
    core.autoTimer = setInterval(() => {
      if (!core.paused) {
        goToNext(core);
      }
    }, core.settings.autoS);
  };

  /**
   * Function to toggle keyboard navigation with left and right arrows
   * 
   * @param core - Carouzel instance core object
   *
   */
  const toggleKeyboard = (core: ICore) => {
    if (core.rootElem && core.settings.kb) {
      core.rootElem.setAttribute('tabindex', '-1');
      let keyCode = '';
      core.eHandlers.push(eventHandler(core.rootElem, 'keydown', function (event: Event) {
        event = event || window.event;
        keyCode = (event as KeyboardEvent).key.toLowerCase();
        switch (keyCode) {
          case 'arrowleft': goToPrev(core); break;
          case 'arrowright': goToNext(core); break;
          default: keyCode = ''; break;
        }
      }));
    }
  };

  /**
   * Function to initialize the carouzel core object and assign respective events
   * 
   * @param core - Carouzel instance core object
   *
   */
  const init = (core: ICore, rootElem: HTMLElement, settings: ICarouzelSettings) => {
    if (typeof settings.beforeInit === 'function') {
      settings.beforeInit();
    }
    let _core: ICore = {...core};
    _core.rootElem = core.rootElem = rootElem;
    _core.settings = mapSettings(settings);
    
    _core.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
    _core.eHandlers = [];
    _core.arrowN = rootElem.querySelector(`${_Selectors.arrowN}`);
    _core.arrowP = rootElem.querySelector(`${_Selectors.arrowP}`);
    _core.controlsW = rootElem.querySelector(`${_Selectors.controlsW}`);
    _core.nav = rootElem.querySelector(`${_Selectors.nav}`);
    _core.navW = rootElem.querySelector(`${_Selectors.navW}`);
    _core._ds = rootElem.querySelectorAll(`${_Selectors.slide}`);
    _core.track = rootElem.querySelector(`${_Selectors.track}`);
    _core.trackW = rootElem.querySelector(`${_Selectors.trackW}`);
    _core.trackO = rootElem.querySelector(`${_Selectors.trackO}`);
    _core.sLength = _core._ds.length;
    _core.pts = [];
    _core.isLeftAdded = false;

    core.goToNext = () => {
      goToNext(_core);
    };
    core.goToPrevious = () => {
      goToPrev(_core);
    };
    core.goToSlide = (slidenumber: number) => {
      if (!isNaN(slidenumber)) {
        goToSlide(_core, slidenumber - 1);
      }
    };
    core.prependSlide = (slideElem: Node) => {
      if (_core.trackW) {
        doInsertBefore(_core.trackW, slideElem);
      }
    };
    core.appendSlide = (slideElem: Node) => {
      if (_core.trackW) {
        doInsertAfter(_core.trackW, slideElem);
      }
    };
    if (_core.settings.effect === _animationEffects[1]) {
      addClass(core.rootElem as Element, _core.settings.fadCls);
    } else {
      removeClass(core.rootElem as Element, _core.settings.fadCls);
    }
    if (!_core._ds[_core.ci]) {
      _core.ci = settings.startAtIndex = 0;
    }

    if (_core.track && _core.sLength > 0) {
      if (_core.settings.auto) {
        _core.settings.inf = true;
        toggleAutoplay(_core);
      }
      _core.bpall = updateBreakpoints(_core.settings);
      toggleKeyboard(_core);
      generateElements(_core);
      toggleArrows(_core);
      toggleTouchEvents(_core);
      applyLayout(_core);
    }

    addClass(core.rootElem as Element, _core.settings.activeCls);
    if (typeof settings.afterInit === 'function') {
      settings.afterInit();
    }
    return { global: core, local: _core };
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
    protected core: any = {};
    constructor(thisid: string, rootElem: HTMLElement, options?: ICarouzelSettings) {
      let initObj = init(this.core, rootElem, {..._Defaults, ...options});
      this.core = initObj.global;
      allLocalInstances[thisid] = initObj.local;
    }
    protected destroy = (thisid: string) => {
      let allElems = document.querySelectorAll(`#${thisid} *`);
      let core = allLocalInstances[thisid];
      for (let i=0; i<allElems.length; i++) {
        removeEventListeners(core, allElems[i]);
        if (core.track && hasClass(allElems[i] as Element, core.settings.dupCls)) {
          core.track.removeChild(allElems[i]);
        }
        if (core.nav && allElems[i].hasAttribute(_Selectors.dot.slice(1, -1))) {
          core.nav.removeChild(allElems[i]);
        }
        allElems[i].removeAttribute('style');
        removeClass(allElems[i] as HTMLElement, `${core.settings.activeCls} ${core.settings.editCls} ${core.settings.disableCls} ${core.settings.dupCls} ${core.settings.rtlCls}`)
      }
      delete allLocalInstances[thisid];
    };
    protected resize = (thisid: string) => {
      applyLayout(allLocalInstances[thisid]);
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
    private instances: IRoot = {};
    protected static instance: Root | null = null;

    /**
     * Constructor to initiate polyfills
     *
     */
    constructor() {}
    private getInstancesLength = () => {
      let instanceCount = 0;
      for (let e in this.instances) {
        if (this.instances.hasOwnProperty(e)) {
          instanceCount++;
        }
      }
      return instanceCount;
    }
    private winResize = () => {
      if (winResize) {
        clearTimeout(winResize);
      }
      winResize = setTimeout(() => {
        for (let e in this.instances) {
          if (this.instances.hasOwnProperty(e)) {
            this.instances[e].resize(e);
          }
        }
      }, 100);
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
     * Function to initialize the Carouzel plugin for provided query strings.
     * 
     * @param query - The CSS selector for which the Carouzel needs to be initialized.
     * @param options - The optional object to customize every Carouzel instance.
     *
     */
    public init = (query: string, options?: ICarouzelSettings) => {
      const roots = document.querySelectorAll(query);
      const rootsLength = roots.length;
      let instanceLength = 0;
      for (let i in this.instances) {
        if (this.instances.hasOwnProperty(i)) {
          instanceLength++;
        }
      }
      if (rootsLength > 0) {
        for (let i = 0; i < rootsLength; i++) {
          const id = roots[i].getAttribute('id');
          let isElementPresent = false;
          if (id) {
            for (let j = 0; j < instanceLength; j++) {
              if (this.instances[id]) {
                isElementPresent = true;
                break;
              }
            }
          }

          if (!isElementPresent) {
            let newOptions;
            let autoDataAttr = (roots[i] as HTMLElement).getAttribute(_Selectors.rootAuto.slice(1, -1)) || '';
            if (autoDataAttr) {
              try {
                newOptions = JSON.parse(stringTrim(autoDataAttr).replace(/'/g, '"'));
              } catch (e) {
                throw new TypeError(_optionsParseTypeError);
              }
            } else {
              newOptions = options;
            }
            if (id) {
              this.instances[id] = new Core(id, roots[i] as HTMLElement, newOptions);
            } else {
              const thisid = id ? id : {...newOptions, ..._Defaults}.idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
              roots[i].setAttribute('id', thisid);
              this.instances[thisid] = new Core(thisid, roots[i] as HTMLElement, newOptions);
            }
          }
        }
        if (window && this.getInstancesLength() > 0 && !isWindowEventAttached) {
          isWindowEventAttached = true;
          window.addEventListener('resize', this.winResize, true);
        }
      } else {
        if (query !== _Selectors.rootAuto) {
          throw new TypeError(_rootSelectorTypeError);
        }
      }
    };

    public globalInit = () => {
      this.init(_Selectors.rootAuto);
    };

    /**
     * Function to destroy the Carouzel plugin for provided query strings.
     * 
     * @param query - The CSS selector for which the Carouzel needs to be initialized.
     *
     */
    protected destroy = (query: string) => {
      const roots = document.querySelectorAll(query);
      const rootsLength = roots.length;
      if (rootsLength > 0) {
        for (let i = 0; i < rootsLength; i++) {
          const id = roots[i].getAttribute('id');
          if (id && this.instances[id]) {
            this.instances[id].destroy(id);
            delete this.instances[id];
          }
        }
        if (window && this.getInstancesLength() === 0) {
          window.removeEventListener('resize', this.winResize, true);
        }
      } else {
        throw new TypeError(_rootSelectorTypeError);
      }
    };
  }
}
Carouzel.Root.getInstance().globalInit();
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = Carouzel;
}