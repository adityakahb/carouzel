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
    var _useCapture = false;
    var _Defaults = {
        activeCls: '__carouzel-active',
        activeSlideCls: '__carouzel-slide-active',
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
        startAtIndex: 1,
        titleSelector: '[data-carouzeltitle]',
        trackSelector: '[data-carouzeltrack]',
        trackInnerSelector: '[data-carouzeltrackinner]'
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
     * Polyfill function for `:scope` for `QuerySelector` and `QuerySelectorAll`
     *
     */
    var _EnableQSQSAScope = function () {
        try {
            window.document.querySelector(':scope body');
        }
        catch (err) {
            var qsarr_1 = ['querySelector', 'querySelectorAll'];
            var _loop_1 = function (i) {
                var nativ = Element.prototype[qsarr_1[i]];
                Element.prototype[qsarr_1[i]] = function (selectors) {
                    if (/(^|,)\s*:scope/.test(selectors)) {
                        var id = this.id;
                        this.id = 'ID_' + Date.now();
                        selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id);
                        var result = window.document[qsarr_1[i]](selectors);
                        this.id = id;
                        return result;
                    }
                    else {
                        return nativ.call(this, selectors);
                    }
                };
            };
            for (var i = 0; i < qsarr_1.length; i++) {
                _loop_1(i);
            }
        }
    };
    /**
     * Polyfill function for `Element.closest`
     *
     */
    var _EnableClosest = function () {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
        }
        if (!Element.prototype.closest) {
            Element.prototype.closest = function (s) {
                var el = this;
                do {
                    if (Element.prototype.matches.call(el, s))
                        return el;
                    var parent_1 = el.parentElement || el.parentNode;
                    if (parent_1) {
                        el = parent_1;
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
     * Function to add a unique id attribute if it is not present already.
     * This is required to monitor the outside click and hover behavior
     *
     * @param element - An HTML Element
     * @param settings - Options specific to individual AMegMen instance
     * @param unique_number - A unique number as additional identification
     * @param shouldAdd - If `true`, adds an id. Otherwise it is removed.
     *
     */
    var _ToggleUniqueId = function (element, settings, unique_number, shouldAddId) {
        if (settings.idPrefix) {
            if (shouldAddId && !element.getAttribute('id')) {
                element.setAttribute('id', settings.idPrefix + '_' + new Date().getTime() + '_' + unique_number);
            }
            else if (!shouldAddId && element.getAttribute('id')) {
                var thisid = element.getAttribute('id');
                var regex = new RegExp(settings.idPrefix, 'gi');
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
    var carouzel_removeEventListeners = function (core, element) {
        if ((core.eventHandlers || []).length > 0) {
            var j = core.eventHandlers.length;
            while (j--) {
                if (core.eventHandlers[j].currentElement.isEqualNode && core.eventHandlers[j].currentElement.isEqualNode(element)) {
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
    var carouzel_eventHandler = function (element, type, listener) {
        var eventHandler = {
            currentElement: element,
            removeEvent: function () {
                element.removeEventListener(type, listener, _useCapture);
            }
        };
        element.addEventListener(type, listener, _useCapture);
        return eventHandler;
    };
    var carouzel_animateSlider = function (core) {
        var slidesLength = core.allSlideElem.length;
        var transformWidth = 100 / (slidesLength > 0 ? slidesLength : 1);
        // console.log('====================', -1 * transformWidth * core.indexOnResize * core.settingsToApply.slidesToScroll);
        for (var m = 0; m < slidesLength; m++) {
            _RemoveClass(core.allSlideElem[m], core.settings.activeSlideCls);
        }
        for (var n = core.indexOnResize; n < core.indexOnResize + core.settingsToApply.slidesToShow; n++) {
            if (core.allSlideElem[n]) {
                _AddClass(core.allSlideElem[n], core.settings.activeSlideCls);
            }
        }
        core.trackInner.style.transform = "translate(" + -1 * transformWidth * core.indexOnResize * core.settingsToApply.slidesToScroll + "%, 0%)";
    };
    var carouzel_updateArrow = function (arrow, index) {
        if (arrow) {
            arrow.setAttribute('data-carouzelgotoslide', index + '');
        }
    };
    var carouzel_toggleEvents = function (core, shouldAddEvent) {
        var arrowToggle = function (prevOrNext) {
            core.isCarouzelStarted = true;
            prevOrNext === 'prev' ? core.indexOnResize-- : core.indexOnResize++;
            carouzel_updateArrow(core.prevArrow, core.indexOnResize - 1);
            carouzel_updateArrow(core.nextArrow, core.indexOnResize + 1);
            carouzel_animateSlider(core);
        };
        if (core.prevArrow && shouldAddEvent) {
            carouzel_eventHandler(core.prevArrow, 'click', function (event) {
                event.preventDefault();
                arrowToggle('prev');
            });
        }
        if (core.prevArrow && !shouldAddEvent) {
            carouzel_removeEventListeners(core, core.prevArrow);
        }
        if (core.nextArrow && shouldAddEvent) {
            carouzel_eventHandler(core.nextArrow, 'click', function (event) {
                event.preventDefault();
                arrowToggle('next');
            });
        }
        if (core.nextArrow && !shouldAddEvent) {
            carouzel_removeEventListeners(core, core.nextArrow);
        }
    };
    var carouzel_applyLayout = function (core) {
        var viewportWidth = window.innerWidth;
        var settingsToApply = core.breakpoints[0];
        var len = 0;
        while (len < core.breakpoints.length) {
            if ((core.breakpoints[len + 1] && core.breakpoints[len + 1].breakpoint > viewportWidth) || typeof core.breakpoints[len + 1] === 'undefined') {
                settingsToApply = core.breakpoints[len];
                break;
            }
            len++;
        }
        var slideWidth = (100 / settingsToApply.slidesToShow);
        var trackWidth = ((100 / settingsToApply.slidesToShow) * (core.allSlideElem.length > settingsToApply.slidesToShow ? core.allSlideElem.length : settingsToApply.slidesToShow));
        core.slideWidth = slideWidth;
        core.settingsToApply = settingsToApply;
        if (core.trackInner) {
            core.trackInner.style.width = trackWidth + '%';
            carouzel_animateSlider(core);
        }
        for (var k = 0; k < core.allSlideElem.length; k++) {
            if (core.allSlideElem[k]) {
                core.allSlideElem[k].style.width = slideWidth + '%';
            }
        }
        carouzel_updateArrow(core.prevArrow, core.isCarouzelStarted ? core.indexOnResize - 1 : core.settings.startAtIndex - 1);
        carouzel_updateArrow(core.nextArrow, core.isCarouzelStarted ? core.indexOnResize + 1 : core.settings.startAtIndex + 1);
    };
    var carouzel_validateBreakpoints = function (breakpoints) {
        try {
            var tempArr = [];
            var len = breakpoints.length;
            while (len--) {
                if (tempArr.indexOf(breakpoints[len].breakpoint) === -1) {
                    tempArr.push(breakpoints[len].breakpoint);
                }
            }
            if (tempArr.length === breakpoints.length) {
                return {
                    isValid: true,
                    breakpoints: breakpoints.sort(function (a, b) { return parseFloat(a.breakpoint) - parseFloat(b.breakpoint); })
                };
            }
            else {
                throw new TypeError('Duplicate breakpoints found');
            }
        }
        catch (e) {
            throw new TypeError('Error parsing breakpoints');
        }
    };
    var carouzel_updateBreakpoints = function (settings) {
        var defaultBreakpoint = {
            breakpoint: 0,
            showArrows: settings.showArrows,
            showNav: settings.showNav,
            slidesToScroll: settings.slidesToScroll,
            slidesToShow: settings.slidesToShow
        };
        var tempArr = [];
        if ((settings.responsive || []).length > 0) {
            var i = settings.responsive.length;
            while (i--) {
                tempArr.push(settings.responsive[i]);
            }
        }
        tempArr.push(defaultBreakpoint);
        var updatedArr = carouzel_validateBreakpoints(tempArr);
        if (updatedArr.isValid) {
            var bpArr = [updatedArr.breakpoints[0]];
            var bpLen = 1;
            while (bpLen < updatedArr.breakpoints.length) {
                bpArr.push(Object.assign({}, bpArr[bpLen - 1], updatedArr.breakpoints[bpLen]));
                bpLen++;
            }
            return bpArr;
        }
        return [];
    };
    var carouzel_init = function (core, rootElem, settings) {
        _AddClass(rootElem, settings.rootCls ? settings.rootCls : '');
        core.rootElem = rootElem;
        core.settings = settings;
        core.trackElem = rootElem.querySelector("" + settings.trackSelector);
        core.trackInner = rootElem.querySelector("" + settings.trackInnerSelector);
        core.allSlideElem = _ArrayCall(rootElem.querySelectorAll("" + settings.slideSelector));
        core.firstSlide = undefined;
        core.lastSlide = undefined;
        core.indexOnResize = core.settings.startAtIndex = core.settings.startAtIndex - 1;
        core.prevIndex = core.indexOnResize - 1;
        core.nextIndex = core.indexOnResize + 1;
        core.isCarouzelStarted = false;
        if (core.allSlideElem.length > 0) {
            core.firstSlide = core.allSlideElem[0];
            core.lastSlide = core.allSlideElem[core.allSlideElem.length - 1];
        }
        core.prevArrow = rootElem.querySelector("" + settings.prevArrowSelector);
        core.nextArrow = rootElem.querySelector("" + settings.nextArrowSelector);
        core.slideWidth = 100;
        if (core.trackInner) {
            core.breakpoints = carouzel_updateBreakpoints(settings);
            carouzel_applyLayout(core);
            carouzel_toggleEvents(core, true);
        }
        core.eventHandlers = [];
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
    var Core = /** @class */ (function () {
        function Core(thisid, rootElem, options) {
            var _this = this;
            this.core = {};
            this.destroy = function (thisid) {
                // amm_destroy(thisid, this.core);
                console.log(thisid);
            };
            this.resize = function () {
                carouzel_applyLayout(_this.core);
            };
            this.core = carouzel_init(this.core, rootElem, Object.assign({}, _Defaults, options));
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
                for (var e in _this.instances) {
                    if (_this.instances.hasOwnProperty(e)) {
                        _this.instances[e].resize();
                    }
                }
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
                var rootsLen = roots.length;
                var instancelen = 0;
                for (var i in _this.instances) {
                    if (_this.instances.hasOwnProperty(i)) {
                        instancelen++;
                    }
                }
                if (rootsLen > 0) {
                    for (var i = 0; i < rootsLen; i++) {
                        var id = roots[i].getAttribute('id');
                        var iselempresent = false;
                        if (id) {
                            for (var j = 0; j < instancelen; j++) {
                                if (_this.instances[id]) {
                                    iselempresent = true;
                                    break;
                                }
                            }
                        }
                        if (!iselempresent) {
                            if (id) {
                                _this.instances[id] = new Core(id, roots[i], options);
                            }
                            else {
                                var thisid = id ? id : Object.assign({}, _Defaults, options).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
                                roots[i].setAttribute('id', thisid);
                                _this.instances[thisid] = new Core(thisid, roots[i], options);
                            }
                            if (window) {
                                window.removeEventListener('resize', _this.windowResize);
                                if (_this.getInstancesLength() > 0) {
                                    window.addEventListener('resize', _this.windowResize);
                                }
                            }
                        }
                    }
                }
                else {
                    console.error('Element(s) with the provided query do(es) not exist');
                }
            };
            /**
             * Function to destroy the AMegMen plugin for provided query strings.
             *
             * @param query - The CSS selector for which the AMegMen needs to be initialized.
             *
             */
            this.destroy = function (query) {
                var roots = _ArrayCall(document.querySelectorAll(query));
                var rootsLen = roots.length;
                if (rootsLen > 0) {
                    for (var i = 0; i < rootsLen; i++) {
                        var id = roots[i].getAttribute('id');
                        if (id && _this.instances[id]) {
                            _this.instances[id].destroy(id);
                            delete _this.instances[id];
                        }
                    }
                    if (window && _this.getInstancesLength() === 0) {
                        window.removeEventListener('resize', _this.windowResize);
                    }
                }
                else {
                    console.error('Element(s) with the provided query do(es) not exist');
                }
            };
            _EnableQSQSAScope();
            _EnableClosest();
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
if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = Carouzel;
}
//# sourceMappingURL=carouzel.js.map