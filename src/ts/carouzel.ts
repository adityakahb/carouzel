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
  let allLocalInstances: any = {};
  let isWindowEventAttached = false;
  let winResize: any;
  let navIndex = 0;

  interface IRoot {
    [key: string]: any;
  }

  interface ICarouzelCoreBreakpoint {
    _arrows: boolean;
    _nav: boolean;
    _toScroll: number;
    _toShow: number;
    bp: number | string;
    bpSLen: number;
    dots: Node[];
    hasSwipe: boolean;
    nextDupes: Node[];
    prevDupes: Node[];
  }
  
  interface ICarouzelCoreSettings {
    _arrows: boolean;
    _nav: boolean;
    _toScroll: number;
    _toShow: number;
    activeCls?: string;
    cntrCls?: string;
    cntrMode?: boolean;
    disableCls?: string;
    dupCls?: string;
    effect?: string;
    hasSwipe: boolean;
    idPrefix?: string;
    inf?: boolean;
    isRTL?: boolean;
    res?: ICarouzelCoreBreakpoint[];
    rtlCls?: string;
    speed?: number;
    startAt?: number;
    threshold?: number;
    timeFn?: string;
  }
  
  interface ICarouzelBreakpoint {
    breakpoint: number | string;
    hasTouchSwipe: boolean;
    showArrows: boolean;
    showNavigation: boolean;
    slidesToScroll: number;
    slidesToShow: number;
  }

  interface ICarouzelSettings {
    activeClass?: string;
    animationEffect?: string;
    animationSpeed?: number;
    centeredClass?: string;
    centerMode?: boolean;
    disabledClass?: string;
    duplicateClass?: string;
    hasTouchSwipe: boolean;
    isInfinite?: boolean;
    isRTL?: boolean;
    responsive?: ICarouzelBreakpoint[];
    rtlClass?: string;
    showArrows: boolean;
    showNavigation: boolean;
    slidesToScroll: number;
    slidesToShow: number;
    startAtIndex?: number;
    timeFunction?: string
    touchThreshold?: number;
  }

  interface IEventHandler {
    element: Element | Document | Window;
    remove: Function;
  }

  interface IIndexHandler {
    [key: number]: number;
  }

  interface ICore {
    _as: HTMLElement[];
    _ci: number;
    _ds: HTMLElement[];
    _pi: number;
    _pts: IIndexHandler;
    arrowN: HTMLElement | null;
    arrowP: HTMLElement | null;
    arrowsW: HTMLElement | null;
    bpall: ICarouzelCoreBreakpoint[];
    bpo_old: ICarouzelCoreBreakpoint;
    bpo: ICarouzelCoreBreakpoint;
    eHandlers: any[];
    isLeftAdded: boolean;
    nav: HTMLElement | null;
    navW: HTMLElement | null;
    rootElem: HTMLElement | null;
    settings: ICarouzelCoreSettings;
    sLength: number;
    sWidth: number;
    track: HTMLElement | null;
    trackW: HTMLElement | null;
  };

  const _animationEffects = ['scroll', 'fade'];
  const _rootSelectorTypeError = 'Element(s) with the provided query do(es) not exist';
  const _optionsParseTypeError = 'Unable to parse the options string';
  const _duplicateBreakpointsTypeError = 'Duplicate breakpoints found';
  const _breakpointsParseTypeError = 'Error parsing breakpoints';
  const _useCapture = false;
  const _Selectors = {
    arrowN: '[data-carouzelnextarrow]',
    arrowP: '[data-carouzelpreviousarrow]',
    arrowsW: '[data-carouzelarrowswrapper]',
    dot: '[data-carouzelnavbutton]',
    nav: '[data-carouzelnavigation]',
    navW: '[data-carouzelnavigationwrapper]',
    root: '[data-carouzel]',
    rootAuto: '[data-carouzelauto]',
    slide: '[data-carouzelslide]',
    track: '[data-carouzeltrack]',
    trackW: '[data-carouzeltrackwrapper]',
  };
  const _Defaults:ICarouzelSettings = {
    activeClass: '__carouzel-active',
    animationEffect: _animationEffects[0],
    animationSpeed: 400,
    centeredClass: '__carouzel-centered',
    centerMode: false,
    disabledClass: '__carouzel-disabled',
    duplicateClass: '__carouzel-duplicate',
    hasTouchSwipe: true,
    isInfinite: true,
    isRTL: false,
    responsive: [],
    rtlClass: '__carouzel-rtl',
    showArrows: true,
    showNavigation: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    startAtIndex: 1,
    timeFunction: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)',
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
    return str.replace(/^\s+|\s+$/g, '');
  };

  /**
   * Function to convert NodeList and other lists to loopable Arrays
   * 
   * @param arr - Either Nodelist of any type of array
   * 
   * @returns A loopable Array.
   *
   */
  const arrayCall = (arr: NodeListOf<Element> | undefined) => {
    try {
      return Array.prototype.slice.call(arr);
    } catch (e) {
      return [];
    }
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
  const addClass = (element: HTMLElement, cls: string) => {
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
  const removeClass = (element: HTMLElement, cls: string) => {
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
   * @param core - AMegMen instance core object
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

  

  const manageDuplicates = (track: HTMLElement, bpo: ICarouzelCoreBreakpoint, duplicateClass: string) => {
    let duplicates = arrayCall(track.querySelectorAll('.' + duplicateClass));
    for (let i=0; i < duplicates.length; i++) {
      track.removeChild(duplicates[i]);
    }
    for (let i=bpo.prevDupes.length - 1; i >= 0; i--) {
      track.prepend(bpo.prevDupes[i]);
    }
    for (let i=0; i < bpo.nextDupes.length; i++) {
      track.append(bpo.nextDupes[i]);
    }
  }



  const animateTrack = (core: ICore) => {
    if (core.settings.inf) {
      if (core.track) {
        core.track.style.transitionDuration = '0ms';
        core.track.style.transform = `translate3d(${-core._pts[core._pi]}px, 0, 0)`;
      }
    }
    setTimeout(() => {
      if (core.track) {
        core.track.style.transitionDuration = `${core.settings.speed}ms`;
        core.track.style.transform = `translate3d(${-core._pts[core._ci]}px, 0, 0)`;
      }
    }, 0);
  };



  const applyLayout = (core: ICore) => {
    let viewportWidth = window.innerWidth;
    let bpoptions = core.bpall[0];
    let len = 0;
    let slideWidth = '';
    let trackWidth = '';

    while(len < core.bpall.length) {
      if ((core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) || typeof core.bpall[len + 1] === 'undefined') {
        bpoptions = core.bpall[len];
        break;
      }
      len++;
    }
    if ((core.bpo_old || {})._toShow !== bpoptions._toShow && core.track) {
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
    if (core.trackW && core.track) {
      core._pts = {};
      slideWidth = (core.trackW.clientWidth / bpoptions._toShow).toFixed(4) || '1';
      
      core.sWidth = parseFloat(slideWidth);

      trackWidth = (parseFloat(slideWidth + '') * (core.sLength >= bpoptions._toShow ? bpoptions.bpSLen : bpoptions._toShow)).toFixed(4);
      core.track.style.width = trackWidth + 'px';
      core._as = arrayCall(core.trackW.querySelectorAll(_Selectors.slide));
      for (let i = 0; i < core._as.length; i++) {
        core._as[i].style.width = slideWidth + 'px';
      }
      for (let i = bpoptions.prevDupes.length; i > 0; i--) {
        core._pts[-i] = (-i + bpoptions.prevDupes.length) * parseFloat(slideWidth);
      }
      for (let i = 0; i < core.sLength; i++) {
        core._pts[i] = (i + bpoptions.prevDupes.length) * parseFloat(slideWidth);
      }
      for (let i = core.sLength; i < core.sLength + bpoptions.nextDupes.length; i++) {
        core._pts[i] = (i + bpoptions.prevDupes.length) * parseFloat(slideWidth);
      }
      animateTrack(core);
    }
  };



  const goToPreviousSet = (core: ICore) => {
    core._ci -= core.bpo._toScroll;
    if (core.settings.inf) {
      if (!core._pts[core._ci]) {
        core._ci += core.sLength;
      }
      core._pi = core._ci + core.bpo._toScroll;
    } else {
      if (core._ci < 0) {
        core._ci = 0;
      }
    }
    animateTrack(core);
  };



  const goToNextSet = (core: ICore) => {
    core._ci += core.bpo._toScroll;
    if (core.settings.inf) {
      if (!core._pts[core._ci + core.bpo._toShow]) {
        core._ci -= core.sLength;
      }
      core._pi = core._ci - core.bpo._toScroll;
    } else {
      if (core._ci + core.bpo._toShow >= core.sLength) {
        core._ci = core.sLength - core.bpo._toShow;
      }
    }
    animateTrack(core);
  };



  const toggleArrows = (core: ICore) => {
    if (core.arrowP) {
      core.eHandlers.push(eventHandler(core.arrowP, 'click', (event: Event) => {
        event.preventDefault();
        goToPreviousSet(core);
      }));
    }
    if (core.arrowN) {
      core.eHandlers.push(eventHandler(core.arrowN, 'click', (event: Event) => {
        event.preventDefault();
        goToNextSet(core);
      }));
    }
  };



  const generateElements = (core: ICore) => {
    for (let i=0; i<core.bpall.length; i++) {
      core.bpall[i].bpSLen = core.sLength;
      if (core.settings.inf) {
        for (let j=core.sLength - core.bpall[i]._toShow; j<core.sLength; j++) {
          let elem = core._ds[j].cloneNode(true);
          addClass(elem as HTMLElement, core.settings.dupCls || '');
          core.bpall[i].bpSLen++;
          core.bpall[i].prevDupes.push(elem);
        }
        for (let j=0; j<core.bpall[i]._toShow; j++) {
          let elem = core._ds[j].cloneNode(true);
          addClass(elem as HTMLElement, core.settings.dupCls || '');
          core.bpall[i].bpSLen++;
          core.bpall[i].nextDupes.push(elem);
        }
      }
    }
    for (let i=0; i < core.bpall.length; i++) {
      let pageLength = Math.ceil(core.sLength / core.bpall[i]._toScroll) - (core.bpall[i]._toShow - core.bpall[i]._toScroll);
      let navBtns: Node[] = [];
      core.bpall[i].dots = [];
      for (let j=0; j < pageLength; j++) {
        let elem = document.createElement('button');
        elem.setAttribute(_Selectors.dot.slice(1, -1), '');
        elem.setAttribute('type', 'button');
        elem.innerHTML = (j + 1) + '';
        navBtns.push(elem);
      }
      for (let j=0; j < pageLength; j++) {
        core.eHandlers.push(eventHandler(navBtns[j] as HTMLElement, 'click', function (event: Event) {
          event.preventDefault();
          core._ci = j * core.bpall[i]._toScroll;
          animateTrack(core);
        }));
        core.bpall[i].dots.push(navBtns[j]);
      }
    }
    toggleArrows(core);
  };



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



  const updateBreakpoints = (settings: ICarouzelCoreSettings) => {
    const defaultBreakpoint: ICarouzelCoreBreakpoint = {
      _arrows: settings._arrows ? settings._arrows : _Defaults.showArrows,
      _nav: settings._nav ? settings._nav : _Defaults.showNavigation,
      _toScroll: settings._toScroll ? settings._toScroll : _Defaults.slidesToScroll,
      _toShow: settings._toShow ? settings._toShow : _Defaults.slidesToShow,
      bp: 0,
      bpSLen: 0,
      dots: [],
      hasSwipe: settings.hasSwipe ? settings.hasSwipe : _Defaults.hasTouchSwipe,
      nextDupes: [],
      prevDupes: [],
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
        if (!bp2._arrows) {
          bp2._arrows = bp1._arrows;
        }
        if (!bp2._nav) {
          bp2._nav = bp1._nav;
        }
        if (!bp2._toShow) {
          bp2._toShow = bp1._toShow;
        }
        if (!bp2._toScroll) {
          bp2._toScroll = bp1._toScroll;
        }
        if (!bp2.hasSwipe) {
          bp2.hasSwipe = bp1.hasSwipe;
        }
        bpArr.push(bp2);
        bpLen++;
      }
      return bpArr;
    }
    return [];
  };



  const mapSettings = (settings: ICarouzelSettings) => {
    let settingsobj: ICarouzelCoreSettings = {
      _arrows: settings.showArrows,
      _nav: settings.showNavigation,
      _toScroll: settings.slidesToScroll,
      _toShow: settings.slidesToShow,
      activeCls: settings.activeClass,
      cntrCls: settings.centeredClass,
      cntrMode: settings.centerMode,
      disableCls: settings.disabledClass,
      dupCls: settings.duplicateClass,
      effect: settings.animationEffect,
      hasSwipe: settings.hasTouchSwipe,
      inf: settings.isInfinite,
      isRTL: settings.isRTL,
      res: [],
      rtlCls: settings.rtlClass,
      speed: settings.animationSpeed,
      startAt: settings.animationSpeed,
      threshold: settings.touchThreshold,
      timeFn: settings.timeFunction,
    }

    if (settings.responsive && settings.responsive.length > 0)  {
      for (let i = 0; i < settings.responsive.length; i++) {
        let obj: ICarouzelCoreBreakpoint = {
          _arrows: settings.responsive[i].showArrows,
          _nav: settings.responsive[i].showNavigation,
          _toScroll: settings.responsive[i].slidesToScroll,
          _toShow: settings.responsive[i].slidesToShow,
          bp: settings.responsive[i].breakpoint,
          bpSLen: 0,
          dots: [],
          hasSwipe: settings.responsive[i].hasTouchSwipe,
          nextDupes: [],
          prevDupes: [],
        }
        if (settingsobj.res) {
          settingsobj.res.push(obj);
        }
      }
    }

    return settingsobj;
  };





  const init = (core: ICore, rootElem: HTMLElement, settings: ICarouzelSettings) => {
    let _core: ICore = core;
    _core.rootElem = rootElem;
    _core.settings = mapSettings(settings);
    
    _core._ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
    _core.eHandlers = [];
    _core.arrowN = rootElem.querySelector(`${_Selectors.arrowN}`);
    _core.arrowP = rootElem.querySelector(`${_Selectors.arrowP}`);
    _core.arrowsW = rootElem.querySelector(`${_Selectors.arrowsW}`);
    _core.nav = rootElem.querySelector(`${_Selectors.nav}`);
    _core.navW = rootElem.querySelector(`${_Selectors.navW}`);
    _core._ds = arrayCall(rootElem.querySelectorAll(`${_Selectors.slide}`));
    _core.track = rootElem.querySelector(`${_Selectors.track}`);
    _core.trackW = rootElem.querySelector(`${_Selectors.trackW}`);
    _core.sLength = _core._ds.length;
    _core._pts = [];
    _core.isLeftAdded = false;

    if (!_core._ds[_core._ci]) {
      _core._ci = settings.startAtIndex = 0;
    }

    navIndex; _Selectors; addClass; removeClass; removeEventListeners; eventHandler;
    if (_core.track && _core.sLength > 0) {
      _core.bpall = updateBreakpoints(_core.settings);
      generateElements(_core);
      applyLayout(_core);
    }

    addClass(core.rootElem as HTMLElement, core.settings.activeCls || '');

    return { global: core, local: _core };
  };

  /**
   *  ██████  ██████  ██████  ███████ 
   * ██      ██    ██ ██   ██ ██      
   * ██      ██    ██ ██████  █████   
   * ██      ██    ██ ██   ██ ██      
   *  ██████  ██████  ██   ██ ███████    
   * 
   * Class for every AMegMen instance.
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
      // amm_destroy(thisid, this.core);
      console.log(thisid);
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
    private getInsLen = () => {
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
     * @returns Single AMegMen Instance
     *
     */
    public static getInstance(): Root {
      if (!Root.instance) {
        Root.instance = new Root();
      }
      return Root.instance;
    }

    /**
     * Function to initialize the AMegMen plugin for provided query strings.
     * 
     * @param query - The CSS selector for which the AMegMen needs to be initialized.
     * @param options - The optional object to customize every AMegMen instance.
     *
     */
    public init = (query: string, options?: ICarouzelSettings) => {
      const roots = arrayCall(document.querySelectorAll(query));
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
            if (roots[i].getAttribute(_Selectors.rootAuto.slice(1, -1))) {
              try {
                newOptions = JSON.parse(roots[i].getAttribute(_Selectors.rootAuto.slice(1, -1)));
              } catch (e) {
                throw new TypeError(_optionsParseTypeError);
              }
            } else {
              newOptions = options;
            }
            if (id) {
              this.instances[id] = new Core(id, roots[i], newOptions);
            } else {
              const thisid = id ? id : (Object as any).assign({}, _Defaults, newOptions).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
              roots[i].setAttribute('id', thisid);
              this.instances[thisid] = new Core(thisid, roots[i], newOptions);
            }
          }
        }
        if (window && this.getInsLen() > 0 && !isWindowEventAttached) {
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
     * Function to destroy the AMegMen plugin for provided query strings.
     * 
     * @param query - The CSS selector for which the AMegMen needs to be initialized.
     *
     */
    protected destroy = (query: string) => {
      const roots = arrayCall(document.querySelectorAll(query));
      const rootsLength = roots.length;
      if (rootsLength > 0) {
        for (let i = 0; i < rootsLength; i++) {
          const id = roots[i].getAttribute('id');
          if (id && this.instances[id]) {
            this.instances[id].destroy(id);
            delete this.instances[id];
          }
        }
        if (window && this.getInsLen() === 0) {
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