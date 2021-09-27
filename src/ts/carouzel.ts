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
  let AllCarouzelInstances: any = {};
  // let active_carouzel: any = {};
  const supportedAnimations = ['scroll', 'fade'];
  let isWindowEventAttached = false;
  let winResize: any;
  let navIndex = 0;
  interface IRoot {
    [key: string]: any;
  }
  interface ICarouzelBreakpoint {
    animation?: string;
    breakpoint?: number | string;
    centeredCls?: string;
    centerMode?: boolean;
    enableSwipe?: boolean;
    showArrows?: boolean;
    showNav?: boolean;
    slidesToScroll?: number;
    slidesToShow?: number;
  }
  interface ICarouzelSettings {
    activeCls?: string;
    activeSlideCls?: string;
    animation?: string;
    arrowsSelector?: string;
    buttonSelector?: string;
    centeredCls?: string;
    centerMode?: boolean;
    disableCls?: string;
    dragThreshold?: number;
    enableSwipe?: boolean;
    hideCls?: string;
    idPrefix?: string;
    innerSelector?: string;
    navBtnElem?: string;
    navInnerSelector?: string;
    navSelector?: string;
    nextArrowSelector?: string;
    prevArrowSelector?: string;
    responsive: ICarouzelBreakpoint[];
    rootAutoSelector?: string;
    rootCls?: string;
    rootSelector?: string;
    showArrows?: boolean;
    showNav?: boolean;
    slideSelector?: string;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    startAtIndex?: number;
    timingFunction?: string;
    titleSelector?: string;
    trackInnerSelector?: string;
    trackOuterSelector?: string;
    trackSelector?: string;
  }
  interface IEventHandler {
    element: Element | Document | Window;
    remove: Function;
  }

  const _useCapture = false;
  const _Defaults = {
    activeCls: '__carouzel-active',
    activeSlideCls: '__carouzel-active',
    animation: 'scroll',
    arrowsSelector: '[data-carouzelarrows]',
    buttonSelector: '[data-carouzelbutton]',
    centerMode: false,
    centeredCls: '__carouzel-centered',
    disableCls: '__carouzel-disabled',
    dragThreshold: 120,
    enableSwipe: true,
    hideCls: '__carouzel-hidden',
    idPrefix: '__carouzel_id',
    innerSelector: '[data-carouzelinner]',
    navBtnElem: 'button',
    navInnerSelector: '[data-carouzelnavinner]',
    navSelector: '[data-carouzelnav]',
    nextArrowSelector: '[data-carouzelnext]',
    prevArrowSelector: '[data-carouzelprev]',
    rootAutoSelector: '[data-carouzelauto]',
    rootCls: '__carouzel',
    rootSelector: '[data-carouzel]',
    showArrows: true,
    showNav: true,
    slideSelector: '[data-carouzelslide]',
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 250,
    startAtIndex: 1,
    timingFunction: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)',
    titleSelector: '[data-carouzeltitle]',
    trackInnerSelector: '[data-carouzeltrackinner]',
    trackOuterSelector: '[data-carouzeltrackouter]',
    trackSelector: '[data-carouzeltrack]'
  };

  /**
   * Polyfill function for Object.assign
   * 
   */
  const _EnableAssign = () => {
    if (typeof (Object as any).assign !== 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target: any) {
          // function assign(target: any, varArgs: any)
          'use strict';
          if (target === null || target === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
          }

          let to = Object(target);

          for (var index = 1; index < arguments.length; index++) {
            let nextSource = arguments[index];

            if (nextSource !== null && nextSource !== undefined) {
              for (var nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true,
      });
    }
  };
  
  /**
   * Function to trim whitespaces from a string
   * 
   * @param str - The string which needs to be trimmed
   * 
   * @returns The trimmed string.
   *
   */
  const _StringTrim = (str: string) => {
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
  const _ArrayCall = (arr: any[] | NodeListOf<Element>) => {
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
  const _HasClass = (element: HTMLElement, cls: string) => {
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
  const _AddClass = (element: HTMLElement, cls: string) => {
    if (element) {
      let clsarr = cls.split(' ');
      let clsarrLength = clsarr.length;
      for (let i = 0; i < clsarrLength; i++) {
        let thiscls = clsarr[i];
        if (!_HasClass(element, thiscls)) {
          element.className += ' ' + thiscls;
        }
      }
      element.className = _StringTrim(element.className);
    }
  };

  /**
   * Function to remove a string from an element's class attribute
   * 
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const _RemoveClass = (element: HTMLElement, cls: string) => {
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
      element.className = _StringTrim(curclass.join(' '));
    }
  };

  /**
   * Function to remove all local events assigned to the navigation elements.
   * 
   * @param core - AMegMen instance core object
   * @param element - An HTML Element from which the events need to be removed
   *
   */
  const carouzel_removeEventListeners = (core: any, element: Element | Document | Window) => {
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
  const carouzel_eventHandler = (element: Element | Document | Window, type: string, listener: EventListenerOrEventListenerObject) => {
    const eventHandler:IEventHandler = {
      element: element,
      remove: () => {
        element.removeEventListener(type, listener, _useCapture);
      }
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandler;
  };

  const carouzel_animateSlider = (core: any) => {
    if (core.currentIndex + core.bpoptions.slidesToShow > core.allSlides.length) {
      core.currentIndex = core.allSlides.length - core.bpoptions.slidesToShow;
    }
    for (let k=0; k<core.allSlides.length; k++) {
      _AddClass(core.allSlides[k], '__carouzel-animating');
      core.allSlides[k].style.transitionDuration = core.settings.speed + 'ms';
    }
    core.currentTransform = -1 * core.slideWidth * core.currentIndex;
    setTimeout(() => {
      core.trackInner.style.transform = `translate(${-1 * core.slideWidth * core.currentIndex}px, 0%)`;
      carouzel_toggleArrowsAndNav(core);
      carozuel_updateIndices(core);
    }, core.bpoptions.animation === 'fade' ? core.settings.speed / 2 : 0);
    setTimeout(() => {
      for (let k=0; k<core.allSlides.length; k++) {
        _RemoveClass(core.allSlides[k], '__carouzel-animating');
      }
    }, core.settings.speed / 2);
  };

  const carouzel_toggleArrowsAndNav = (core: any) => {
    if (core.prevArrow && core.currentIndex === 0) {
      _AddClass(core.prevArrow, core.settings.disableCls);
      core.prevArrow.setAttribute('disabled', 'disabled');
    }
    if (core.prevArrow && core.currentIndex !== 0) {
      _RemoveClass(core.prevArrow, core.settings.disableCls);
      core.prevArrow.removeAttribute('disabled');
    }
    if (core.nextArrow && core.currentIndex + core.bpoptions.slidesToShow === core.allSlides.length) {
      _AddClass(core.nextArrow, core.settings.disableCls);
      core.nextArrow.setAttribute('disabled', 'disabled');
    }
    if (core.nextArrow && core.currentIndex + core.bpoptions.slidesToShow !== core.allSlides.length) {
      _RemoveClass(core.nextArrow, core.settings.disableCls);
      core.nextArrow.removeAttribute('disabled');
    }
    if (core.navInner && (core.navBtns || []).length > 0) {
      for (let n = 0; n < core.navBtns.length; n++) {
        _RemoveClass(core.navBtns[n], core.settings.activeCls);
      }
      navIndex = Math.ceil(core.currentIndex / core.bpoptions.slidesToScroll);
      if (core.navBtns[navIndex]) {
        _AddClass(core.navBtns[navIndex], core.settings.activeCls);
      }
    }
    for (let k=0; k<core.allSlides.length; k++) {
      _RemoveClass(core.allSlides[k], core.settings.activeSlideCls);
    }
    for (let k=core.currentIndex; k<core.bpoptions.slidesToShow + core.currentIndex; k++) {
      _AddClass(core.allSlides[k], core.settings.activeSlideCls);
    }
  };

  const carouzel_moveToRight = (core: any) => {
    carouzel_moveSlider(core, 'next');
  }
  const carouzel_moveToLeft = (core: any) => {
    carouzel_moveSlider(core, 'prev');
  }

  const carouzel_moveSlider = (core: any, prevOrNext: string) => {
    core.isCarouzelStarted = true;
    core.currentIndex = prevOrNext === 'prev' ? core.prevIndex : core.nextIndex;
    carouzel_animateSlider(core);
  }

  const carouzel_toggleArrows = (core: any, shouldEnableArrows: boolean) => {
    carouzel_toggleArrowsAndNav(core);
    if (core.prevArrow) {
      carouzel_removeEventListeners(core, core.prevArrow);
      _AddClass(core.prevArrow, core.settings.hideCls);
      if (shouldEnableArrows) {
        core.eventHandlers.push(carouzel_eventHandler(core.prevArrow, 'click', function (event: Event) {
          event.preventDefault();
          carouzel_moveToLeft(core);
        }));
        if (core.bpoptions.showArrows) {
          _RemoveClass(core.prevArrow, core.settings.hideCls);
        }
      }
    }
    if (core.nextArrow) {
      carouzel_removeEventListeners(core, core.nextArrow);
      _AddClass(core.nextArrow, core.settings.hideCls);
      if (shouldEnableArrows) {
        core.eventHandlers.push(carouzel_eventHandler(core.nextArrow, 'click', function (event: Event) {
          event.preventDefault();
          carouzel_moveToRight(core);
        }));
        if (core.bpoptions.showArrows) {
          _RemoveClass(core.nextArrow, core.settings.hideCls);
        }
      }
    }
  };
  const carozuel_updateIndices = (core: any) => {
    let slidesLength = core.allSlides.length;
    let onLeft = 0;
    let onRight = 0;
    core.nextIndex = core.currentIndex;
    core.prevIndex = core.currentIndex;
    for(let m=0; m<core.currentIndex; m++) {
      onLeft++;
    }
    for(let m=core.currentIndex + core.bpoptions.slidesToShow; m<slidesLength; m++) {
      onRight++;
    }
    if (onLeft >= core.bpoptions.slidesToScroll) {
      core.prevIndex -= core.bpoptions.slidesToScroll;
    } else {
      core.prevIndex = 0;
    }
    if (onRight >= core.bpoptions.slidesToScroll) {
      core.nextIndex += core.bpoptions.slidesToScroll;
    } else {
      core.nextIndex = slidesLength - core.bpoptions.slidesToScroll;
    }
  };
  const carouzel_toggleSwipe = (core: any, shouldEnableSwipe: boolean) => {
    let posX1 = 0;
    let posX2 = 0;
    let posFinal = 0;
    let threshold = core.bpoptions.dragThreshold || 100;
    let dragging = false;
    const touchStart = (thisevent: Event) => {
      thisevent.preventDefault();
      dragging = true;
      if (thisevent.type === 'touchstart') {
        posX1 = (thisevent as TouchEvent).touches[0].clientX;
      } else {
        posX1 = (thisevent as MouseEvent).clientX;
      }
    };
    const touchMove = (thisevent: Event) => {
      if (dragging) {
        if (thisevent.type == 'touchmove') {
          posX2 = posX1 - (thisevent as TouchEvent).touches[0].clientX;
        } else {
          posX2 = posX1 - (thisevent as MouseEvent).clientX;
        }
        if (core.bpoptions.animation !== 'fade') {
          core.trackInner.style.transform = `translate(${core.currentTransform - posX2}px, 0%)`;
        }
        posFinal = posX2;
      }
    };
    const touchEnd = () => {
      if (dragging) {
        if (posFinal < -threshold) {
          carouzel_moveToLeft(core);
        } else if (posFinal > threshold) {
          carouzel_moveToRight(core);
        } else {
          core.trackInner.style.transform = `translate(${core.currentTransform}px, 0%)`;
        }
      }
      posX1 = posX2 = posFinal = 0;
      dragging = false;
    };
    const toggleTouchEvents = (shouldAdd: boolean) => {
      carouzel_removeEventListeners(core, core.trackInner);
      if (shouldAdd) {
        core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'touchstart', function(event: Event) {
          touchStart(event);
        }));
        core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'touchmove', function(event: Event) {
          touchMove(event);
        }));
        core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'touchend', function() {
          touchEnd();
        }));
        core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mousedown', function(event: Event) {
          touchStart(event);
        }));
        core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mouseup', function() {
          touchEnd();
        }));
        core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mouseleave', function() {
          touchEnd();
        }));
        core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mousemove', function(event: Event) {
          touchMove(event);
        }));
      }
    };
    if (core.trackInner) {
      toggleTouchEvents(shouldEnableSwipe);
    }
  };
  const carouzel_toggleNav = (core: any, shouldEnableNav: boolean) => {
    if (core.navInner && document) {
      core.navInner.innerHTML = '';
      core.navBtns = [];
      if (shouldEnableNav) {
        let pageLength = Math.ceil(core.allSlides.length / core.bpoptions.slidesToScroll) - (core.bpoptions.slidesToShow - core.bpoptions.slidesToScroll);
        let navBtns = [];
        
        for (let p=0; p<pageLength; p++) {
          let elem = document.createElement(core.settings.navBtnElem);
          elem.setAttribute('data-carouzelnavbtn', '');
          if (core.settings.navBtnElem.toLowerCase() === 'button') {
            elem.setAttribute('type', 'button');
          }
          elem.innerHTML = p  + 1;
          navBtns.push(elem);
          core.navInner.appendChild(elem);
        }
        for (let p=0; p<navBtns.length; p++) {
          core.eventHandlers.push(carouzel_eventHandler(navBtns[p], 'click', function (event: Event) {
            event.preventDefault();
            core.currentIndex = p * core.bpoptions.slidesToScroll;
            carouzel_animateSlider(core);
          }));
          core.navBtns.push(navBtns[p]);
        }
      }
    }
  };
  const carouzel_applyLayout = (core: any) => {
    let viewportWidth = window.innerWidth;
    let bpoptions = core.breakpoints[0];
    let len = 0;
    let slideWidth = '';
    let trackWidth = '';
    while(len < core.breakpoints.length) {
      if ((core.breakpoints[len + 1] && core.breakpoints[len + 1].breakpoint > viewportWidth) || typeof core.breakpoints[len + 1] === 'undefined') {
        bpoptions = core.breakpoints[len];
        break;
      }
      len++;
    }
    if (supportedAnimations.indexOf(bpoptions.animation) === -1) {
      bpoptions.animation = 'scroll';
    }
    if ((core._bpoptions || {}).breakpoint !== bpoptions.breakpoint) {
      core.bpoptions = bpoptions;
      carouzel_toggleArrows(core, bpoptions.showArrows);
      carouzel_toggleNav(core, bpoptions.showNav);
      carouzel_toggleSwipe(core, bpoptions.enableSwipe);
      core._bpoptions = bpoptions;
    }
    slideWidth = (core.trackOuter.clientWidth / bpoptions.slidesToShow).toFixed(4) || '1';
    trackWidth = (parseFloat(slideWidth + '') * (core.allSlides.length > bpoptions.slidesToShow ? core.allSlides.length : bpoptions.slidesToShow)).toFixed(4);  
    if (bpoptions.centerMode && core.track) {
      bpoptions.slidesToScroll = 1;
      _AddClass(core.track, core.settings.centeredCls);
      core.track.style.width = slideWidth;
    } else if (core.track) {
      _RemoveClass(core.track, core.settings.centeredCls);
      core.track.removeAttribute('style');
    }
    core.slideWidth = slideWidth;
    if (core.trackInner) {
      core.trackInner.style.width = trackWidth + 'px';
      core.trackInner.style.transitionDuration = core.settings.speed + 'ms';
      core.trackInner.style.transitionTimingFunction = core.settings.timingFunction;
      carouzel_animateSlider(core);
      for (let a=0; a<supportedAnimations.length; a++) {
        _RemoveClass(core.trackInner, `__carouzel-animation-${supportedAnimations[a]}`);
      }
      if (bpoptions.animation !== 'scroll') {
        _AddClass(core.trackInner, `__carouzel-animation-${bpoptions.animation}`);
      }
    }
    for (let k = 0; k < core.allSlides.length; k++) {
      if (core.allSlides[k]) {
        core.allSlides[k].style.width = slideWidth + 'px';
      }
    }
  };
  const carouzel_validateBreakpoints = (breakpoints: ICarouzelBreakpoint[]) => {
    try {
      let tempArr = [];
      let len = breakpoints.length;
      while(len--) {
        if (tempArr.indexOf(breakpoints[len].breakpoint) === -1) {
          tempArr.push(breakpoints[len].breakpoint);
        }
      }
      if (tempArr.length === breakpoints.length) {
        return {
          isValid: true,
          breakpoints: breakpoints.sort((a, b) => parseFloat(a.breakpoint as string) - parseFloat(b.breakpoint as string))
        };
      } else {
        throw new TypeError('Duplicate breakpoints found');
      }
    } catch (e) {
      throw new TypeError('Error parsing breakpoints');
    }
  };
  const carouzel_updateBreakpoints = (settings: ICarouzelSettings) => {
    const defaultBreakpoint: ICarouzelBreakpoint = {
      animation: settings.animation,
      breakpoint: 0,
      enableSwipe: settings.enableSwipe,
      showArrows: settings.showArrows,
      showNav: settings.showNav,
      slidesToScroll: settings.slidesToScroll,
      slidesToShow: settings.slidesToShow,
      centerMode: settings.centerMode,
      centeredCls: settings.centeredCls
    };
    let tempArr = [];
    if ((settings.responsive || []).length > 0) {
      let i = settings.responsive.length;
      while(i--) {
        tempArr.push(settings.responsive[i]);
      }
    }
    tempArr.push(defaultBreakpoint);
    let updatedArr = carouzel_validateBreakpoints(tempArr);
    if (updatedArr.isValid) {
      let bpArr = [updatedArr.breakpoints[0]];
      let bpLen = 1;
      while(bpLen < updatedArr.breakpoints.length) {
        bpArr.push((Object as any).assign({}, bpArr[bpLen-1], updatedArr.breakpoints[bpLen]));
        bpLen++;
      }
      return bpArr;
    }
    return [];
  };

  const carouzel_init = (core: any, rootElem: HTMLElement, settings: ICarouzelSettings) => {
    _AddClass(rootElem, settings.rootCls ? settings.rootCls : '');
    core.rootElem = rootElem;
    core.settings = settings;
    core.track = rootElem.querySelector(`${settings.trackSelector}`);
    core.trackOuter = rootElem.querySelector(`${settings.trackOuterSelector}`);
    core.trackInner = rootElem.querySelector(`${settings.trackInnerSelector}`);
    core.allSlides = _ArrayCall(rootElem.querySelectorAll(`${settings.slideSelector}`));
    core.currentIndex = core.settings.startAtIndex = core.settings.startAtIndex - 1;
    core.navInner = rootElem.querySelector(`${settings.navInnerSelector}`);
    core.prevIndex = 0;
    core.nextIndex = 0;
    core.isCarouzelStarted = false;
    core.prevArrow = rootElem.querySelector(`${settings.prevArrowSelector}`);
    core.nextArrow = rootElem.querySelector(`${settings.nextArrowSelector}`);
    core.slideWidth = 100;
    core.eventHandlers = [];
    if (core.trackInner && core.allSlides.length > 0) {
      core.breakpoints = carouzel_updateBreakpoints(settings);
      carouzel_applyLayout(core);
    }
    _AddClass(rootElem, settings.activeCls ? settings.activeCls : '');
    return core;
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
      this.core = carouzel_init(this.core, rootElem, (Object as any).assign({}, _Defaults, options));
      AllCarouzelInstances[thisid] = this.core;
    }
    protected destroy = (thisid: string) => {
      // amm_destroy(thisid, this.core);
      console.log(thisid);
    };
    protected resize = () => {
      carouzel_applyLayout(this.core);
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
    constructor() {
      _EnableAssign();
    }
    private getInstancesLength = () => {
      let instanceCount = 0;
      for (let e in this.instances) {
        if (this.instances.hasOwnProperty(e)) {
          instanceCount++;
        }
      }
      return instanceCount;
    }
    private windowResize = () => {
      if (winResize) {
        clearTimeout(winResize);
      }
      winResize = setTimeout(() => {
        for (let e in this.instances) {
          if (this.instances.hasOwnProperty(e)) {
            this.instances[e].resize();
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
      const roots = _ArrayCall(document.querySelectorAll(query));
      const rootsLen = roots.length;
      let instancelen = 0;
      for (let i in this.instances) {
        if (this.instances.hasOwnProperty(i)) {
          instancelen++;
        }
      }
      if (rootsLen > 0) {
        for (let i = 0; i < rootsLen; i++) {
          const id = roots[i].getAttribute('id');
          let iselempresent = false;
          if (id) {
            for (let j = 0; j < instancelen; j++) {
              if (this.instances[id]) {
                iselempresent = true;
                break;
              }
            }
          }

          if (!iselempresent) {
            let newoptions;
            if (roots[i].getAttribute('data-carouzelauto')) {
              try {
                newoptions = JSON.parse(roots[i].getAttribute('data-carouzelauto'));
              } catch (e) {
                throw new TypeError('Unable to parse the options string');
              }
            } else {
              newoptions = options;
            }
            if (id) {
              this.instances[id] = new Core(id, roots[i], newoptions);
            } else {
              const thisid = id ? id : (Object as any).assign({}, _Defaults, newoptions).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
              roots[i].setAttribute('id', thisid);
              this.instances[thisid] = new Core(thisid, roots[i], newoptions);
            }
          }
        }
        if (window && this.getInstancesLength() > 0 && !isWindowEventAttached) {
          isWindowEventAttached = true;
          window.addEventListener('resize', this.windowResize, true);
        }
      } else {
        if (query !== '[data-carouzelauto]') {
          throw new TypeError('Element(s) with the provided query do(es) not exist');
        }
      }
    };

    /**
     * Function to destroy the AMegMen plugin for provided query strings.
     * 
     * @param query - The CSS selector for which the AMegMen needs to be initialized.
     *
     */
    protected destroy = (query: string) => {
      const roots = _ArrayCall(document.querySelectorAll(query));
      const rootsLen = roots.length;
      if (rootsLen > 0) {
        for (let i = 0; i < rootsLen; i++) {
          const id = roots[i].getAttribute('id');
          if (id && this.instances[id]) {
            this.instances[id].destroy(id);
            delete this.instances[id];
          }
        }
        if (window && this.getInstancesLength() === 0) {
          window.removeEventListener('resize', this.windowResize, true);
        }
      } else {
        throw new TypeError('Element(s) with the provided query do(es) not exist');
      }
    };
  }
}
Carouzel.Root.getInstance().init('[data-carouzelauto]');
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = Carouzel;
}