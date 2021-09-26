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
    // let active_carouzel: any = {};
    var winResize;
    var _useCapture = false;
    var _Defaults = {
        activeCls: '__carouzel-active',
        activeSlideCls: '__carouzel-slide-active',
        arrowsSelector: '[data-carouzelarrows]',
        buttonSelector: '[data-carouzelbutton]',
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
        trackSelector: '[data-carouzeltrack]'
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
    var carouzel_eventHandler = function (element, type, listener) {
        var eventHandler = {
            element: element,
            remove: function () {
                element.removeEventListener(type, listener, _useCapture);
            }
        };
        element.addEventListener(type, listener, _useCapture);
        return eventHandler;
    };
    var carouzel_animateSlider = function (core) {
        var slidesLength = core.allSlides.length;
        if (core.currentIndex + core.bpoptions.slidesToShow > core.allSlides.length) {
            core.currentIndex = core.allSlides.length - core.bpoptions.slidesToShow;
        }
        for (var k = 0; k < slidesLength; k++) {
            _RemoveClass(core.allSlides[k], core.settings.activeSlideCls);
        }
        core.currentTransform = -1 * core.slideWidth * core.currentIndex;
        core.trackInner.style.transform = "translate(" + -1 * core.slideWidth * core.currentIndex + "px, 0%)";
        carouzel_toggleArrow(core.prevArrow, core.currentIndex !== 0, core.settings.disableCls);
        carouzel_toggleArrow(core.nextArrow, core.currentIndex + core.bpoptions.slidesToShow !== core.allSlides.length, core.settings.disableCls);
        carozuel_updateIndices(core);
    };
    var carouzel_toggleArrow = function (arrow, shouldEnable, disableCls) {
        if (arrow && !shouldEnable) {
            _AddClass(arrow, disableCls);
            arrow.setAttribute('disabled', 'disabled');
        }
        if (arrow && shouldEnable) {
            _RemoveClass(arrow, disableCls);
            arrow.removeAttribute('disabled');
        }
    };
    // const carouzel_updateArrow = (arrow: Element, index: number) => {
    //   if (arrow) {
    //     arrow.setAttribute('data-carouzelgotoslide', index + '');
    //   }
    // };
    var carouzel_moveToRight = function (core) {
        carouzel_moveSlider(core, 'next');
    };
    var carouzel_moveToLeft = function (core) {
        carouzel_moveSlider(core, 'prev');
    };
    var carouzel_moveSlider = function (core, prevOrNext) {
        core.isCarouzelStarted = true;
        core.currentIndex = prevOrNext === 'prev' ? core.prevIndex : core.nextIndex;
        carouzel_animateSlider(core);
    };
    var carouzel_toggleEvents = function (core, shouldAddEvent) {
        if (core.prevArrow) {
            carouzel_removeEventListeners(core, core.prevArrow);
            carouzel_toggleArrow(core.prevArrow, false, core.settings.disableCls);
            _AddClass(core.prevArrow, core.settings.hideCls);
            if (shouldAddEvent) {
                core.eventHandlers.push(carouzel_eventHandler(core.prevArrow, 'click', function (event) {
                    event.preventDefault();
                    carouzel_moveToLeft(core);
                }));
                if (core.bpoptions.showArrows) {
                    _RemoveClass(core.prevArrow, core.settings.hideCls);
                    carouzel_toggleArrow(core.prevArrow, core.currentIndex !== 0, core.settings.disableCls);
                }
            }
        }
        if (core.nextArrow) {
            carouzel_removeEventListeners(core, core.nextArrow);
            carouzel_toggleArrow(core.nextArrow, false, core.settings.disableCls);
            _AddClass(core.nextArrow, core.settings.hideCls);
            if (shouldAddEvent) {
                core.eventHandlers.push(carouzel_eventHandler(core.nextArrow, 'click', function (event) {
                    event.preventDefault();
                    carouzel_moveToRight(core);
                }));
                if (core.bpoptions.showArrows) {
                    _RemoveClass(core.nextArrow, core.settings.hideCls);
                    carouzel_toggleArrow(core.nextArrow, core.currentIndex + core.bpoptions.slidesToShow !== core.allSlides.length, core.settings.disableCls);
                }
            }
        }
    };
    var carozuel_updateIndices = function (core) {
        var slidesLength = core.allSlides.length;
        var onLeft = 0;
        var onRight = 0;
        core.nextIndex = core.currentIndex;
        core.prevIndex = core.currentIndex;
        for (var m = 0; m < core.currentIndex; m++) {
            onLeft++;
        }
        for (var m = core.currentIndex + core.bpoptions.slidesToShow; m < slidesLength; m++) {
            onRight++;
        }
        if (onLeft >= core.bpoptions.slidesToScroll) {
            core.prevIndex -= core.bpoptions.slidesToScroll;
        }
        else {
            core.prevIndex = 0;
        }
        if (onRight >= core.bpoptions.slidesToScroll) {
            core.nextIndex += core.bpoptions.slidesToScroll;
        }
        else {
            core.nextIndex = slidesLength - core.bpoptions.slidesToScroll;
        }
        // carouzel_updateArrow(core.nextArrow, core.nextIndex);
        // carouzel_updateArrow(core.prevArrow, core.prevIndex);
    };
    var carouzel_toggleSwipe = function (core) {
        var posX1 = 0;
        var posX2 = 0;
        var posFinal = 0;
        var threshold = core.bpoptions.dragThreshold || 100;
        var dragging = false;
        var touchStart = function (thisevent) {
            thisevent.preventDefault();
            dragging = true;
            if (thisevent.type === 'touchstart') {
                posX1 = thisevent.touches[0].clientX;
            }
            else {
                posX1 = thisevent.clientX;
            }
        };
        var touchMove = function (thisevent) {
            if (dragging) {
                if (thisevent.type == 'touchmove') {
                    posX2 = posX1 - thisevent.touches[0].clientX;
                }
                else {
                    posX2 = posX1 - thisevent.clientX;
                }
                core.trackInner.style.transform = "translate(" + (core.currentTransform - posX2) + "px, 0%)";
                posFinal = posX2;
            }
        };
        var touchEnd = function () {
            if (dragging) {
                if (posFinal < -threshold) {
                    carouzel_moveToLeft(core);
                }
                else if (posFinal > threshold) {
                    carouzel_moveToRight(core);
                }
                else {
                    core.trackInner.style.transform = "translate(" + core.currentTransform + "px, 0%)";
                }
            }
            posX1 = posX2 = posFinal = 0;
            dragging = false;
        };
        var toggleTouchEvents = function (shouldAdd) {
            carouzel_removeEventListeners(core, core.trackInner);
            if (shouldAdd) {
                core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'touchstart', function (event) {
                    touchStart(event);
                }));
                core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'touchmove', function (event) {
                    touchMove(event);
                }));
                core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'touchend', function () {
                    touchEnd();
                }));
                core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mousedown', function (event) {
                    touchStart(event);
                }));
                core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mouseup', function () {
                    touchEnd();
                }));
                core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mouseleave', function () {
                    touchEnd();
                }));
                core.eventHandlers.push(carouzel_eventHandler(core.trackInner, 'mousemove', function (event) {
                    touchMove(event);
                }));
            }
        };
        if (core.bpoptions.enableSwipe && core.trackInner) {
            toggleTouchEvents(true);
        }
        else if (!core.bpoptions.enableSwipe && core.trackInner) {
            toggleTouchEvents(false);
        }
    };
    var carouzel_toggleNav = function (core) {
        if (core.navInner && document) {
            var pageLength = Math.ceil(core.allSlides.length / core.bpoptions.slidesToScroll) - (core.bpoptions.slidesToShow - core.bpoptions.slidesToScroll);
            var navBtns = [];
            core.navInner.innerHTML = '';
            for (var p = 0; p < pageLength; p++) {
                var elem = document.createElement(core.settings.navBtnElem);
                elem.setAttribute('data-carouzelnavbtn', '');
                if (core.settings.navBtnElem.toLowerCase() === 'button') {
                    elem.setAttribute('type', 'button');
                }
                elem.innerHTML = p + 1;
                navBtns.push(elem);
                core.navInner.appendChild(elem);
            }
            var _loop_2 = function (p) {
                core.eventHandlers.push(carouzel_eventHandler(navBtns[p], 'click', function (event) {
                    event.preventDefault();
                    core.currentIndex = p * core.bpoptions.slidesToScroll;
                    carouzel_animateSlider(core);
                }));
            };
            for (var p = 0; p < navBtns.length; p++) {
                _loop_2(p);
            }
        }
    };
    var carouzel_applyLayout = function (core) {
        var viewportWidth = window.innerWidth;
        var bpoptions = core.breakpoints[0];
        var len = 0;
        while (len < core.breakpoints.length) {
            if ((core.breakpoints[len + 1] && core.breakpoints[len + 1].breakpoint > viewportWidth) || typeof core.breakpoints[len + 1] === 'undefined') {
                bpoptions = core.breakpoints[len];
                break;
            }
            len++;
        }
        var slideWidth = (core.track.clientWidth / bpoptions.slidesToShow).toFixed(4) || 1;
        var trackWidth = (parseFloat(slideWidth + '') * (core.allSlides.length > bpoptions.slidesToShow ? core.allSlides.length : bpoptions.slidesToShow)).toFixed(4);
        core.slideWidth = slideWidth;
        core.bpoptions = bpoptions;
        if (core.trackInner) {
            core.trackInner.style.width = trackWidth + 'px';
            core.trackInner.style.transitionDuration = core.settings.speed + 'ms';
            core.trackInner.style.transitionTimingFunction = core.settings.timingFunction;
            carouzel_animateSlider(core);
        }
        for (var k = 0; k < core.allSlides.length; k++) {
            if (core.allSlides[k]) {
                core.allSlides[k].style.width = slideWidth + 'px';
            }
        }
        carouzel_toggleEvents(core, core.bpoptions.showArrows || false);
        carouzel_toggleSwipe(core);
        carozuel_updateIndices(core);
        carouzel_toggleNav(core);
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
            slidesToShow: settings.slidesToShow,
            enableSwipe: settings.enableSwipe
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
        core.track = rootElem.querySelector("" + settings.trackSelector);
        core.trackInner = rootElem.querySelector("" + settings.trackInnerSelector);
        core.allSlides = _ArrayCall(rootElem.querySelectorAll("" + settings.slideSelector));
        core.currentIndex = core.settings.startAtIndex = core.settings.startAtIndex - 1;
        core.navInner = rootElem.querySelector("" + settings.navInnerSelector);
        core.prevIndex = 0;
        core.nextIndex = 0;
        core.isCarouzelStarted = false;
        core.prevArrow = rootElem.querySelector("" + settings.prevArrowSelector);
        core.nextArrow = rootElem.querySelector("" + settings.nextArrowSelector);
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
                            var newoptions = roots[i].getAttribute('[data-carouzelauto]') ? JSON.parse(roots[i].getAttribute('[data-carouzelauto]')) : options;
                            console.log('=========roots[i]', roots[i].getAttribute('[data-carouzelauto]'));
                            if (id) {
                                _this.instances[id] = new Core(id, roots[i], newoptions);
                            }
                            else {
                                var thisid = id ? id : Object.assign({}, _Defaults, newoptions).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
                                roots[i].setAttribute('id', thisid);
                                _this.instances[thisid] = new Core(thisid, roots[i], newoptions);
                            }
                        }
                    }
                    if (window) {
                        //  window.removeEventListener('resize', this.windowResize, true);
                        if (_this.getInstancesLength() > 0) {
                            window.addEventListener('resize', _this.windowResize, true);
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
                        window.removeEventListener('resize', _this.windowResize, true);
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
Carouzel.Root.getInstance().init('[data-carouzelauto]');
if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = Carouzel;
}
//# sourceMappingURL=carouzel.js.map