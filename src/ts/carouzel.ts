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

  interface IRoot {
    [key: string]: any;
  }
  interface ICarouzelBreakpoint {
    breakpoint?: number | string;
    enableSwipe?: boolean;
    showArrows?: boolean;
    showNav?: boolean;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    timingFunction?: string;
  }
  interface ICarouzelSettings {
    activeCls?: string;
    activeSlideCls?: string;
    arrowsSelector?: string;
    buttonSelector?: string;
    enableSwipe?: boolean;
    idPrefix?: string;
    innerSelector?: string;
    navSelector?: string;
    nextArrowSelector?: string;
    prevArrowSelector?: string;
    responsive: ICarouzelBreakpoint[];
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
    trackSelector?: string;
  }
  interface IEventHandler {
    currentElement: Element;
    removeEvent?: Function;
  }
  const _useCapture = false;
  const _Defaults = {
    activeCls: '__carouzel-active',
    activeSlideCls: '__carouzel-slide-active',
    arrowsSelector: '[data-carouzelarrows]',
    buttonSelector: '[data-carouzelbutton]',
    enableSwipe: true,
    idPrefix: '__carouzel_id',
    innerSelector: '[data-carouzelinner]',
    navSelector: '[data-carouzelnav]',
    nextArrowSelector: '[data-carouzelnext]',
    prevArrowSelector: '[data-carouzelprev]',
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
   * Polyfill function for `:scope` for `QuerySelector` and `QuerySelectorAll`
   *
   */
  const _EnableQSQSAScope = () => {
    try {
      window.document.querySelector(':scope body');
    } catch (err) {
      const qsarr = ['querySelector', 'querySelectorAll'];
      for (let i = 0; i < qsarr.length; i++) {
        let nativ = (Element.prototype as any)[qsarr[i]];
        (Element.prototype as any)[qsarr[i]] = function (selectors: string) {
          if (/(^|,)\s*:scope/.test(selectors)) {
            let id = this.id;
            this.id = 'ID_' + Date.now();
            selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id);
            let result = (window.document as any)[qsarr[i]](selectors);
            this.id = id;
            return result;
          } else {
            return nativ.call(this, selectors);
          }
        };
      }
    }
  };

  /**
   * Polyfill function for `Element.closest`
   *
   */
  const _EnableClosest = () => {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        (Element.prototype as any).msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      Element.prototype.closest = function (s: string) {
        var el = this;

        do {
          if (Element.prototype.matches.call(el, s)) return el;
          const parent = el.parentElement || el.parentNode;
          if (parent) {
            el = parent as Element;
          }
        } while (el !== null && el.nodeType === 1);
        return null;
      };
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
  const carouzel_removeEventListeners = (core: any, element: Element) => {
    if ((core.eventHandlers || []).length > 0) {
      let j = core.eventHandlers.length;
      while (j--) {
        if(core.eventHandlers[j].currentElement.isEqualNode && core.eventHandlers[j].currentElement.isEqualNode(element)) {
          core.eventHandlers[j].removeEvent();
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
  const carouzel_eventHandler = (element: Element, type: string, listener: EventListenerOrEventListenerObject) => {
    const eventHandler:IEventHandler = {
      currentElement: element,
      removeEvent: () => {
        element.removeEventListener(type, listener, _useCapture);
      }
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandler;
  };

  const carouzel_animateSlider = (core: any) => {
    let slidesLength = core.allSlides.length;
    for (let k=0; k<slidesLength; k++) {
      _RemoveClass(core.allSlides[k], core.settings.activeSlideCls);
    }
    core.currentTransform = -1 * core.slideWidth * core.currentIndex;
    core.trackInner.style.transform = `translate(${-1 * core.slideWidth * core.currentIndex}px, 0%)`;
  };

  const carouzel_updateArrow = (arrow: Element, index: number) => {
    if (arrow) {
      arrow.setAttribute('data-carouzelgotoslide', index + '');
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
    carozuel_updateIndices(core);
  }

  const carouzel_toggleEvents = (core: any, shouldAddEvent: boolean) => {
    if (core.prevArrow && shouldAddEvent) {
      carouzel_eventHandler(core.prevArrow, 'click', function (event: Event) {
        event.preventDefault();
        carouzel_moveToLeft(core);
      });
    }
    if (core.prevArrow && !shouldAddEvent) {
      carouzel_removeEventListeners(core, core.prevArrow);
    }
    if (core.nextArrow && shouldAddEvent) {
      carouzel_eventHandler(core.nextArrow, 'click', function (event: Event) {
        event.preventDefault();
        carouzel_moveToRight(core);
      });
    }
    if (core.nextArrow && !shouldAddEvent) {
      carouzel_removeEventListeners(core, core.nextArrow);
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
    carouzel_updateArrow(core.nextArrow, core.nextIndex);
    carouzel_updateArrow(core.prevArrow, core.prevIndex);
  };
  const carouzel_toggleSwipe = (tcore: any) => {
    const touchStart = (thisevent: Event) => {
      thisevent;
    };
    const touchEnd = (thisevent: Event) => {
      thisevent;
    };
    const touchMove = (thisevent: Event) => {
      thisevent;
    };
    const toggleTouchEvents = (shouldAdd: boolean) => {
      carouzel_removeEventListeners(tcore, tcore.trackInner);
      if (shouldAdd) {
        carouzel_eventHandler(tcore.trackInner, 'touchstart', function(event: Event) {
          touchStart(event);
        });
        carouzel_eventHandler(tcore.trackInner, 'touchend', function(event: Event) {
          touchEnd(event);
        });
        carouzel_eventHandler(tcore.trackInner, 'touchmove', function(event: Event) {
          touchMove(event);
        });
        carouzel_eventHandler(tcore.trackInner, 'mousedown', function(event: Event) {
          touchStart(event);
        });
        carouzel_eventHandler(tcore.trackInner, 'mouseup', function(event: Event) {
          touchEnd(event);
        });
        carouzel_eventHandler(tcore.trackInner, 'mouseleave', function(event: Event) {
          touchEnd(event);
        });
        carouzel_eventHandler(tcore.trackInner, 'mousemove', function(event: Event) {
          touchMove(event);
        });
      }
    };
    if (tcore.bpoptions.enableSwipe && tcore.trackInner) {
      toggleTouchEvents(true);
    } else if (!tcore.bpoptions.enableSwipe && tcore.trackInner) {
      toggleTouchEvents(false);
    }
  };
  const carouzel_applyLayout = (core: any) => {
    let viewportWidth = window.innerWidth;
    let bpoptions = core.breakpoints[0];
    let len = 0;
    while(len < core.breakpoints.length) {
      if ((core.breakpoints[len + 1] && core.breakpoints[len + 1].breakpoint > viewportWidth) || typeof core.breakpoints[len + 1] === 'undefined') {
        bpoptions = core.breakpoints[len];
        break;
      }
      len++;
    }
    let slideWidth = (core.track.clientWidth / bpoptions.slidesToShow).toFixed(4) || 1;
    let trackWidth = (parseFloat(slideWidth + '') * (core.allSlides.length > bpoptions.slidesToShow ? core.allSlides.length : bpoptions.slidesToShow)).toFixed(4);
    core.slideWidth = slideWidth;
    if (core.trackInner) {
      core.trackInner.style.width = trackWidth + 'px';
      core.trackInner.style.transitionDuration = core.settings.speed + 'ms';
      core.trackInner.style.transitionTimingFunction = core.settings.timingFunction;
      carouzel_animateSlider(core);
    }
    for (let k = 0; k < core.allSlides.length; k++) {
      if (core.allSlides[k]) {
        core.allSlides[k].style.width = slideWidth + 'px';
      }
    }
    core.bpoptions = bpoptions;
    carouzel_toggleSwipe(core);
    carozuel_updateIndices(core);
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
      breakpoint: 0,
      showArrows: settings.showArrows,
      showNav: settings.showNav,
      slidesToScroll: settings.slidesToScroll,
      slidesToShow: settings.slidesToShow,
      enableSwipe: settings.enableSwipe
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
    core.trackInner = rootElem.querySelector(`${settings.trackInnerSelector}`);
    core.allSlides = _ArrayCall(rootElem.querySelectorAll(`${settings.slideSelector}`));
    core.currentIndex = core.settings.startAtIndex = core.settings.startAtIndex - 1;
    core.prevIndex = 0;
    core.nextIndex = 0;
    core.isCarouzelStarted = false;
    core.prevArrow = rootElem.querySelector(`${settings.prevArrowSelector}`);
    core.nextArrow = rootElem.querySelector(`${settings.nextArrowSelector}`);
    core.slideWidth = 100;
    core.longTouch = false;
    if (core.trackInner && core.allSlides.length > 0) {
      core.breakpoints = carouzel_updateBreakpoints(settings);
      carouzel_applyLayout(core);
      carouzel_toggleEvents(core, true);
    }
    core.eventHandlers = [];
    _AddClass(rootElem, settings.activeCls ? settings.activeCls : '');
    if (navigator.maxTouchPoints) {
      _AddClass(core.track, '__carouzel-ms-touch');
    }
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
      _EnableQSQSAScope();
      _EnableClosest();
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
      for (let e in this.instances) {
        if (this.instances.hasOwnProperty(e)) {
          this.instances[e].resize();
        }
      }
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
    protected init = (query: string, options?: ICarouzelSettings) => {
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
          const id = (roots[i] as HTMLElement).getAttribute('id');
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
            if (id) {
              this.instances[id] = new Core(id, (roots[i] as HTMLElement), options);
            } else {
              const thisid = id ? id : (Object as any).assign({}, _Defaults, options).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
              (roots[i] as HTMLElement).setAttribute('id', thisid);
              this.instances[thisid] = new Core(thisid, (roots[i] as HTMLElement), options);
            }
            if (window) {
              window.removeEventListener('resize', this.windowResize);
              if (this.getInstancesLength() > 0) {
                window.addEventListener('resize', this.windowResize);
              }
            }
          }
        }
      } else {
        console.error('Element(s) with the provided query do(es) not exist');
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
          const id = (roots[i] as HTMLElement).getAttribute('id');
          if (id && this.instances[id]) {
            this.instances[id].destroy(id);
            delete this.instances[id];
          }
        }
        if (window && this.getInstancesLength() === 0) {
          window.removeEventListener('resize', this.windowResize);
        }
      } else {
        console.error('Element(s) with the provided query do(es) not exist');
      }
    };
  }
}
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = Carouzel;
}