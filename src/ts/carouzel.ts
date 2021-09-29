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
  // const supportedEffects = ['scroll', 'fade'];
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
    centerAmong?: number;
    enableSwipe?: boolean;
    showArrows?: boolean;
    showNav?: boolean;
    slidesToScroll?: number;
    slidesToShow?: number;
  }
  interface ICarouzelSettings {
    activeClass?: string;
    activeSlideClass?: string;
    animation?: string;
    arrowsSelector?: string;
    buttonSelector?: string;
    centerAmong?: number;
    centeredCls?: string;
    disableClass?: string;
    dragThreshold?: number;
    enableSwipe?: boolean;
    hiddenClass?: string;
    idPrefix?: string;
    innerSelector?: string;
    isRTL?: boolean;
    navBtnElem?: string;
    navInnerSelector?: string;
    navSelector?: string;
    nextArrowSelector?: string;
    prevArrowSelector?: string;
    responsive: ICarouzelBreakpoint[];
    rootAutoSelector?: string;
    rootElemClass?: string;
    rootSelector?: string;
    rtlClass?: string;
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

  const _rootSelectorTypeError = 'Element(s) with the provided query do(es) not exist';
  const _optionsParseTypeError = 'Unable to parse the options string';
  const _useCapture = false;
  const _Selectors = {
    arrowN: '[data-carouzelnextarrow]',
    arrowP: '[data-carouzelpreviousarrow]',
    arrowsW: '[data-carouzelarrowswrapper]',
    nav: '[data-carouzelnavigation]',
    navW: '[data-carouzelnavigationwrapper]',
    root: '[data-carouzel]',
    rootAuto: '[data-carouzelauto]',
    track: '[data-carouzeltrack]',
    trackW: '[data-carouzeltrackwrapper]',
    slide: 'carouzelslide'
  };
  const _Defaults = {
    isRTL: false,
    rtlClass: '__carouzel-rtl',
    activeClass: '__carouzel-active',
    activeSlideClass: '__carouzel-active',
    animation: 'scroll',
    centerAmong: 0,
    centeredCls: '__carouzel-centered',
    disableClass: '__carouzel-disabled',
    dragThreshold: 120,
    enableSwipe: true,
    hiddenClass: '__carouzel-hidden',
    idPrefix: '__carouzel_id',
    navBtnElem: 'button',
    rootElemClass: '__carouzel',
    showArrows: true,
    showNav: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 250,
    startAtIndex: 1,
    timingFunction: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)',
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
  const _RemoveEventListeners = (core: any, element: Element | Document | Window) => {
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
  const _EventHandler = (element: Element | Document | Window, type: string, listener: EventListenerOrEventListenerObject) => {
    const eventHandler:IEventHandler = {
      element: element,
      remove: () => {
        element.removeEventListener(type, listener, _useCapture);
      }
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandler;
  };

  const init = (core: any, rootElem: HTMLElement, settings: ICarouzelSettings) => {
    let _core = core;
    _core.rootElem = rootElem;
    _core.settings = settings;
    _core.track = rootElem.querySelector(`${settings.trackSelector}`);
    _core.slides = _ArrayCall(rootElem.querySelectorAll(`${settings.slideSelector}`));
    _core.currentIndex = core.settings.startAtIndex = core.settings.startAtIndex - 1;
    _core.eventHandlers = [];
    navIndex; _Selectors; _AddClass; _RemoveClass; _RemoveEventListeners; _EventHandler;
    if (_core.trackInner && _core.allSlides.length > 0) {
    
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
      this.core = init(this.core, rootElem, (Object as any).assign({}, _Defaults, options));
      AllCarouzelInstances[thisid] = this.core;
    }
    protected destroy = (thisid: string) => {
      // amm_destroy(thisid, this.core);
      console.log(thisid);
    };
    protected resize = () => {
      // carouzel_applyLayout(this.core);
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
        if (window && this.getInstancesLength() > 0 && !isWindowEventAttached) {
          isWindowEventAttached = true;
          window.addEventListener('resize', this.windowResize, true);
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
      const roots = _ArrayCall(document.querySelectorAll(query));
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
          window.removeEventListener('resize', this.windowResize, true);
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