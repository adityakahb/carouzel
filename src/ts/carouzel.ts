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
  interface ICarouzelBreakpoints {
    breakpoint?: number | string;
    showArrows?: boolean;
    showNav?: boolean;
    slidesToScroll?: number;
    slidesToShow?: number;
  }
  interface ICarouzelSettings {
    activeCls?: string;
    arrowsSelector?: string;
    responsive: ICarouzelBreakpoints[];
    buttonSelector?: string;
    idPrefix?: string;
    innerSelector?: string;
    navSelector?: string;
    nextArrowSelector?: string;
    prevArrowSelector?: string;
    rootCls?: string;
    rootSelector?: string;
    showArrows?: boolean;
    showNav?: boolean;
    slideSelector?: string;
    slidesToScroll?: number;
    slidesToShow?: number;
    titleSelector?: string;
    trackSelector?: string;
    trackInnerSelector?: string;
  }
  interface IEventHandler {
    currentElement: Element;
    removeEvent?: Function;
  }
  const _useCapture = false;
  const _Defaults = {
    activeCls: '__carouzel-active',
    arrowsSelector: '[data-carouzelarrows]',
    buttonSelector: '[data-carouzelbutton]',
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
    titleSelector: '[data-carouzeltitle]',
    trackSelector: '[data-carouzeltrack]',
    trackInnerSelector: '[data-carouzeltrackinner]',
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
   * Function to add a unique id attribute if it is not present already. 
   * This is required to monitor the outside click and hover behavior
   * 
   * @param element - An HTML Element
   * @param settings - Options specific to individual AMegMen instance
   * @param unique_number - A unique number as additional identification
   * @param shouldAdd - If `true`, adds an id. Otherwise it is removed.
   *
   */
  const _ToggleUniqueId = (element: HTMLElement, settings: ICarouzelSettings, unique_number: number, shouldAddId: boolean) => {
    if (settings.idPrefix) {
      if (shouldAddId && !element.getAttribute('id')) {
        element.setAttribute('id', settings.idPrefix + '_' + new Date().getTime() + '_' + unique_number);
      } else if (!shouldAddId && element.getAttribute('id')) {
        const thisid = element.getAttribute('id');
        const regex = new RegExp(settings.idPrefix, 'gi');
        if (regex.test(thisid || '')) {
          element.removeAttribute('id');
        }
      }
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
  const carouzel_toggleEvents = (core: any) => {
    
  };
  const carouzel_applyLayout = (core: any) => {
    let viewportWidth = window.innerWidth;
    let settingsToApply = core.breakpoints[0];
    let len = 0;
    while(len < core.breakpoints.length) {
      if ((core.breakpoints[len + 1] && core.breakpoints[len + 1].breakpoint > viewportWidth) || typeof core.breakpoints[len + 1] === 'undefined') {
        settingsToApply = core.breakpoints[len];
        break;
      }
      len++;
    }
    let trackWidth = ((100 / settingsToApply.slidesToShow) * (core.allSlideElem.length > settingsToApply.slidesToShow ? core.allSlideElem.length : settingsToApply.slidesToShow)) + '%';
    let slideWidth = (100 / settingsToApply.slidesToShow) + '%';
    core.trackInner.style.width = trackWidth;
    for (let k = 0; k < (core.allSlideElem || []).length; k++) {
      core.allSlideElem[k].style.width = slideWidth;
    }
  };
  const carouzel_validateBreakpoints = (breakpoints: ICarouzelBreakpoints[]) => {
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
    const defaultBreakpoint = {
      breakpoint: 0,
      showArrows: settings.showArrows,
      showNav: settings.showNav,
      slidesToScroll: settings.slidesToScroll,
      slidesToShow: settings.slidesToShow,
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
    core.trackElem = rootElem.querySelector(`${settings.trackSelector}`);
    core.trackInner = rootElem.querySelector(`${settings.trackInnerSelector}`);
    core.allSlideElem = _ArrayCall(rootElem.querySelectorAll(`${settings.slideSelector}`));
    core.prevArrow = rootElem.querySelectorAll(`${settings.prevArrowSelector}`);
    core.nextArrow = rootElem.querySelectorAll(`${settings.nextArrowSelector}`);
    core.breakpoints = carouzel_updateBreakpoints(settings);
    core.eventHandlers = [];
    carouzel_applyLayout(core);
    carouzel_toggleEvents(core);
    console.log(carouzel_removeEventListeners, carouzel_eventHandler);
    console.log(_ToggleUniqueId, core, _RemoveClass);
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