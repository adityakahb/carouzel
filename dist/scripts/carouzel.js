/***
 *     ██████  █████  ██████   ██████  ██    ██ ███████ ███████ ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██    ███  ██      ██
 *    ██      ███████ ██████  ██    ██ ██    ██   ███   █████   ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██  ███    ██      ██
 *     ██████ ██   ██ ██   ██  ██████   ██████  ███████ ███████ ███████
 *
 *
 */
var Carouzel;
(function (Carouzel) {
    "use strict";
    var AllCarouzelInstances = {};
    // const supportedEffects = ['scroll', 'fade'];
    var isWindowEventAttached = false;
    var winResize;
    var navIndex = 0;
    var _rootSelectorTypeError = 'Element(s) with the provided query do(es) not exist';
    var _optionsParseTypeError = 'Unable to parse the options string';
    var _useCapture = false;
    var _Selectors = {
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
    var _Defaults = {
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
        timingFunction: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)'
    };
    /**
     * Polyfill function for Object.assign
     *
     */
    var _EnableAssign = function () {
        if (typeof Object.assign !== 'function') {
            Object.defineProperty(Object, 'assign', {
                value: function assign(target) {
                    // function assign(target: any, varArgs: any)
                    'use strict';
                    if (target === null || target === undefined) {
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
                    var to = Object(target);
                    for (var index = 1; index < arguments.length; index++) {
                        var nextSource = arguments[index];
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
                configurable: true
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
    var _StringTrim = function (str) {
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
    var _ArrayCall = function (arr) {
        try {
            return Array.prototype.slice.call(arr);
        }
        catch (e) {
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
    var _HasClass = function (element, cls) {
        if (element) {
            var clsarr = element.className.split(' ');
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
    var _AddClass = function (element, cls) {
        if (element) {
            var clsarr = cls.split(' ');
            var clsarrLength = clsarr.length;
            for (var i = 0; i < clsarrLength; i++) {
                var thiscls = clsarr[i];
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
    var _RemoveClass = function (element, cls) {
        if (element) {
            var clsarr = cls.split(' ');
            var curclass = element.className.split(' ');
            var curclassLength = curclass.length;
            for (var i = 0; i < curclassLength; i++) {
                var thiscls = curclass[i];
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
    var _RemoveEventListeners = function (core, element) {
        if ((core.eventHandlers || []).length > 0) {
            var j = core.eventHandlers.length;
            while (j--) {
                if (core.eventHandlers[j].element.isEqualNode && core.eventHandlers[j].element.isEqualNode(element)) {
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
    var _EventHandler = function (element, type, listener) {
        var eventHandler = {
            element: element,
            remove: function () {
                element.removeEventListener(type, listener, _useCapture);
            }
        };
        element.addEventListener(type, listener, _useCapture);
        return eventHandler;
    };
    var init = function (core, rootElem, settings) {
        var _core = core;
        _core.rootElem = rootElem;
        _core.settings = settings;
        _core.track = rootElem.querySelector("" + settings.trackSelector);
        _core.slides = _ArrayCall(rootElem.querySelectorAll("" + settings.slideSelector));
        _core.currentIndex = core.settings.startAtIndex = core.settings.startAtIndex - 1;
        _core.eventHandlers = [];
        navIndex;
        _Selectors;
        _AddClass;
        _RemoveClass;
        _RemoveEventListeners;
        _EventHandler;
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
    var Core = /** @class */ (function () {
        function Core(thisid, rootElem, options) {
            this.core = {};
            this.destroy = function (thisid) {
                // amm_destroy(thisid, this.core);
                console.log(thisid);
            };
            this.resize = function () {
                // carouzel_applyLayout(this.core);
            };
            this.core = init(this.core, rootElem, Object.assign({}, _Defaults, options));
            AllCarouzelInstances[thisid] = this.core;
        }
        return Core;
    }());
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
    var Root = /** @class */ (function () {
        /**
         * Constructor to initiate polyfills
         *
         */
        function Root() {
            var _this = this;
            this.instances = {};
            this.getInstancesLength = function () {
                var instanceCount = 0;
                for (var e in _this.instances) {
                    if (_this.instances.hasOwnProperty(e)) {
                        instanceCount++;
                    }
                }
                return instanceCount;
            };
            this.windowResize = function () {
                if (winResize) {
                    clearTimeout(winResize);
                }
                winResize = setTimeout(function () {
                    for (var e in _this.instances) {
                        if (_this.instances.hasOwnProperty(e)) {
                            _this.instances[e].resize();
                        }
                    }
                }, 100);
            };
            /**
             * Function to initialize the AMegMen plugin for provided query strings.
             *
             * @param query - The CSS selector for which the AMegMen needs to be initialized.
             * @param options - The optional object to customize every AMegMen instance.
             *
             */
            this.init = function (query, options) {
                var roots = _ArrayCall(document.querySelectorAll(query));
                var rootsLength = roots.length;
                var instanceLength = 0;
                for (var i in _this.instances) {
                    if (_this.instances.hasOwnProperty(i)) {
                        instanceLength++;
                    }
                }
                if (rootsLength > 0) {
                    for (var i = 0; i < rootsLength; i++) {
                        var id = roots[i].getAttribute('id');
                        var isElementPresent = false;
                        if (id) {
                            for (var j = 0; j < instanceLength; j++) {
                                if (_this.instances[id]) {
                                    isElementPresent = true;
                                    break;
                                }
                            }
                        }
                        if (!isElementPresent) {
                            var newOptions = void 0;
                            if (roots[i].getAttribute(_Selectors.rootAuto.slice(1, -1))) {
                                try {
                                    newOptions = JSON.parse(roots[i].getAttribute(_Selectors.rootAuto.slice(1, -1)));
                                }
                                catch (e) {
                                    throw new TypeError(_optionsParseTypeError);
                                }
                            }
                            else {
                                newOptions = options;
                            }
                            if (id) {
                                _this.instances[id] = new Core(id, roots[i], newOptions);
                            }
                            else {
                                var thisid = id ? id : Object.assign({}, _Defaults, newOptions).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
                                roots[i].setAttribute('id', thisid);
                                _this.instances[thisid] = new Core(thisid, roots[i], newOptions);
                            }
                        }
                    }
                    if (window && _this.getInstancesLength() > 0 && !isWindowEventAttached) {
                        isWindowEventAttached = true;
                        window.addEventListener('resize', _this.windowResize, true);
                    }
                }
                else {
                    if (query !== _Selectors.rootAuto) {
                        throw new TypeError(_rootSelectorTypeError);
                    }
                }
            };
            this.globalInit = function () {
                _this.init(_Selectors.rootAuto);
            };
            /**
             * Function to destroy the AMegMen plugin for provided query strings.
             *
             * @param query - The CSS selector for which the AMegMen needs to be initialized.
             *
             */
            this.destroy = function (query) {
                var roots = _ArrayCall(document.querySelectorAll(query));
                var rootsLength = roots.length;
                if (rootsLength > 0) {
                    for (var i = 0; i < rootsLength; i++) {
                        var id = roots[i].getAttribute('id');
                        if (id && _this.instances[id]) {
                            _this.instances[id].destroy(id);
                            delete _this.instances[id];
                        }
                    }
                    if (window && _this.getInstancesLength() === 0) {
                        window.removeEventListener('resize', _this.windowResize, true);
                    }
                }
                else {
                    throw new TypeError(_rootSelectorTypeError);
                }
            };
            _EnableAssign();
        }
        /**
         * Function to return single instance
         *
         * @returns Single AMegMen Instance
         *
         */
        Root.getInstance = function () {
            if (!Root.instance) {
                Root.instance = new Root();
            }
            return Root.instance;
        };
        Root.instance = null;
        return Root;
    }());
    Carouzel.Root = Root;
})(Carouzel || (Carouzel = {}));
Carouzel.Root.getInstance().globalInit();
if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = Carouzel;
}
//# sourceMappingURL=carouzel.js.map