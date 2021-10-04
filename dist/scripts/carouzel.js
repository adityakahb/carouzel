var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var allLocalInstances = {};
    var isWindowEventAttached = false;
    var winResize;
    var _animationEffects = ['scroll', 'fade'];
    var _rootSelectorTypeError = 'Element(s) with the provided query do(es) not exist';
    var _optionsParseTypeError = 'Unable to parse the options string';
    var _duplicateBreakpointsTypeError = 'Duplicate breakpoints found';
    var _breakpointsParseTypeError = 'Error parsing breakpoints';
    var _useCapture = false;
    var _Selectors = {
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
        trackW: '[data-carouzeltrackwrapper]'
    };
    var _Defaults = {
        activeClass: '__carouzel-active',
        animationEffect: _animationEffects[0],
        animationSpeed: 400,
        autoplay: false,
        centeredClass: '__carouzel-centered',
        centerMode: false,
        disabledClass: '__carouzel-disabled',
        duplicateClass: '__carouzel-duplicate',
        hasTouchSwipe: true,
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
        timingFunction: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)',
        touchThreshold: 120
    };
    /**
     * Function to trim whitespaces from a string
     *
     * @param str - The string which needs to be trimmed
     *
     * @returns The trimmed string.
     *
     */
    var stringTrim = function (str) {
        return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    };
    /**
     * Function to convert NodeList and other lists to loopable Arrays
     *
     * @param arr - Either Nodelist of any type of array
     *
     * @returns A loopable Array.
     *
     */
    var arrayCall = function (arr) {
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
    var hasClass = function (element, cls) {
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
    var addClass = function (element, cls) {
        if (element) {
            var clsarr = cls.split(' ');
            var clsarrLength = clsarr.length;
            for (var i = 0; i < clsarrLength; i++) {
                var thiscls = clsarr[i];
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
    var removeClass = function (element, cls) {
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
    var removeEventListeners = function (core, element) {
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
    var eventHandler = function (element, type, listener) {
        var eventHandler = {
            element: element,
            remove: function () {
                element.removeEventListener(type, listener, _useCapture);
            }
        };
        element.addEventListener(type, listener, _useCapture);
        return eventHandler;
    };
    var updateCSSClasses = function (core) {
        for (var i = 0; i < core._as.length; i++) {
            removeClass(core._as[i], core.settings.activeCls);
        }
        for (var i = core.ci + core.bpo.pDups.length; i < core.ci + core.bpo.pDups.length + core.bpo._2Show; i++) {
            addClass(core._as[i], core.settings.activeCls);
        }
        if (!core.settings.inf && core.ci === 0) {
            addClass(core.arrowP, core.settings.disableCls || '');
        }
        else {
            removeClass(core.arrowP, core.settings.disableCls || '');
        }
        if (!core.settings.inf && core.ci === core.sLength - core.bpo._2Show) {
            addClass(core.arrowN, core.settings.disableCls || '');
        }
        else {
            removeClass(core.arrowN, core.settings.disableCls || '');
        }
        if (core.bpo.dots.length > 0) {
            for (var i = 0; i < core.bpo.dots.length; i++) {
                removeClass(core.bpo.dots[i], core.settings.activeCls);
            }
            if (core.bpo.dots[Math.floor(core.ci % core.bpo._2Scroll)]) {
                addClass(core.bpo.dots[Math.floor(core.ci / core.bpo._2Scroll)], core.settings.activeCls);
            }
        }
    };
    var animateTrack = function (core) {
        if (typeof core.settings.bFn === 'function') {
            core.settings.bFn();
        }
        if (core.settings.inf) {
            if (core.track) {
                core.track.style.transitionProperty = 'none';
                core.track.style.transitionTimingFunction = 'unset';
                core.track.style.transitionDuration = '0ms';
                core.track.style.transform = "translate3d(" + -core.pts[core.pi] + "px, 0, 0)";
            }
        }
        else {
            if (core.ci < 0) {
                core.ci = 0;
            }
            if (core.ci + core.bpo._2Show >= core.sLength) {
                core.ci = core.sLength - core.bpo._2Show;
            }
        }
        if (core.settings.effect === _animationEffects[0]) {
            setTimeout(function () {
                if (core.track) {
                    core.track.style.transitionProperty = 'transform';
                    core.track.style.transitionTimingFunction = core.settings.timeFn;
                    core.track.style.transitionDuration = core.settings.speed + "ms";
                    core.track.style.transform = "translate3d(" + -core.pts[core.ci] + "px, 0, 0)";
                    core.ct = -core.pts[core.ci];
                    updateCSSClasses(core);
                }
            }, 0);
        }
        if (core.settings.effect === _animationEffects[1]) {
            var postOpacity_1 = function () {
                setTimeout(function () {
                    if (core.track) {
                        core.track.style.transform = "translate3d(" + -core.pts[core.ci] + "px, 0, 0)";
                        core.track.style.opacity = '1';
                    }
                }, core.settings.speed);
            };
            setTimeout(function () {
                if (core.track) {
                    core.track.style.transitionProperty = 'opacity';
                    core.track.style.transitionTimingFunction = core.settings.timeFn;
                    core.track.style.transitionDuration = core.settings.speed + "ms";
                    core.track.style.opacity = '0';
                    core.ct = -core.pts[core.ci];
                    updateCSSClasses(core);
                    postOpacity_1();
                }
            }, 0);
        }
        setTimeout(function () {
            if (typeof core.settings.aFn === 'function') {
                core.settings.aFn();
            }
        }, core.settings.speed);
    };
    var manageDuplicates = function (track, bpo, duplicateClass) {
        var duplicates = arrayCall(track.querySelectorAll('.' + duplicateClass));
        for (var i = 0; i < duplicates.length; i++) {
            track.removeChild(duplicates[i]);
        }
        for (var i = bpo.pDups.length - 1; i >= 0; i--) {
            track.prepend(bpo.pDups[i]);
        }
        for (var i = 0; i < bpo.nDups.length; i++) {
            track.append(bpo.nDups[i]);
        }
    };
    var applyLayout = function (core) {
        var viewportWidth = window.innerWidth;
        var bpoptions = core.bpall[0];
        var len = 0;
        var slideWidth = 0;
        var trackWidth = 0;
        while (len < core.bpall.length) {
            if ((core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) || typeof core.bpall[len + 1] === 'undefined') {
                bpoptions = core.bpall[len];
                break;
            }
            len++;
        }
        if ((core.bpo_old || {})._2Show !== bpoptions._2Show && core.track) {
            manageDuplicates(core.track, bpoptions, core.settings.dupCls || '');
        }
        if ((core.bpo_old || {}).bp !== bpoptions.bp) {
            core.bpo = bpoptions;
            core.bpo_old = bpoptions;
        }
        if (core.nav) {
            var dots = core.nav.querySelectorAll(_Selectors.dot);
            for (var i = 0; i < dots.length; i++) {
                core.nav.removeChild(dots[i]);
            }
            for (var i = 0; i < bpoptions.dots.length; i++) {
                core.nav.appendChild(bpoptions.dots[i]);
            }
        }
        if (core.trackW && core.track) {
            core.pts = {};
            slideWidth = core.trackW.clientWidth / bpoptions._2Show || 1;
            core.sWidth = slideWidth;
            trackWidth = parseFloat(slideWidth + '') * (core.sLength >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show);
            core.track.style.width = trackWidth + 'px';
            core._as = arrayCall(core.trackW.querySelectorAll(_Selectors.slide));
            for (var i = 0; i < core._as.length; i++) {
                core._as[i].style.width = slideWidth + 'px';
            }
            for (var i = bpoptions.pDups.length; i > 0; i--) {
                core.pts[-i] = (-i + bpoptions.pDups.length) * slideWidth;
            }
            for (var i = 0; i < core.sLength; i++) {
                core.pts[i] = (i + bpoptions.pDups.length) * slideWidth;
            }
            for (var i = core.sLength; i < core.sLength + bpoptions.nDups.length; i++) {
                core.pts[i] = (i + bpoptions.pDups.length) * slideWidth;
            }
            animateTrack(core);
        }
    };
    var goToPrev = function (core) {
        core.pi = core.ci;
        core.ci -= core.bpo._2Scroll;
        if (core.settings.inf) {
            if (!core.pts[core.ci]) {
                core.ci += core.sLength;
            }
            core.pi = core.ci + core.bpo._2Scroll;
        }
        animateTrack(core);
    };
    var goToNext = function (core) {
        core.pi = core.ci;
        core.ci += core.bpo._2Scroll;
        if (core.settings.inf) {
            if (!core.pts[core.ci + core.bpo._2Show]) {
                core.ci -= core.sLength;
            }
            core.pi = core.ci - core.bpo._2Scroll;
        }
        animateTrack(core);
    };
    var toggleArrows = function (core) {
        if (core.arrowP) {
            core.eHandlers.push(eventHandler(core.arrowP, 'click', function (event) {
                event.preventDefault();
                goToPrev(core);
            }));
        }
        if (core.arrowN) {
            core.eHandlers.push(eventHandler(core.arrowN, 'click', function (event) {
                event.preventDefault();
                goToNext(core);
            }));
        }
    };
    var toggleTouchEvents = function (core) {
        var posX1 = 0;
        var posX2 = 0;
        var posFinal = 0;
        var threshold = core.settings.threshold || 100;
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
            if (core.track) {
                core.track.style.transitionProperty = core.settings.effect;
                core.track.style.transitionTimingFunction = core.settings.timeFn;
                core.track.style.transitionDuration = core.settings.speed + "ms";
            }
        };
        var touchMove = function (thisevent) {
            if (dragging && core.track) {
                if (thisevent.type == 'touchmove') {
                    posX2 = posX1 - thisevent.touches[0].clientX;
                }
                else {
                    posX2 = posX1 - thisevent.clientX;
                }
                if (core.settings.effect === _animationEffects[0]) {
                    core.track.style.transform = "translate3d(" + (core.ct - posX2) + "px, 0, 0)";
                }
                posFinal = posX2;
            }
        };
        var touchEnd = function () {
            if (dragging && core.track) {
                if (posFinal < -threshold) {
                    goToPrev(core);
                }
                else if (posFinal > threshold) {
                    goToNext(core);
                }
                else {
                    core.track.style.transform = "translate3d(" + core.ct + "px, 0, 0)";
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
        core.eHandlers.push(eventHandler(core.track, 'touchstart', function (event) {
            touchStart(event);
        }));
        core.eHandlers.push(eventHandler(core.track, 'touchmove', function (event) {
            touchMove(event);
        }));
        core.eHandlers.push(eventHandler(core.track, 'touchend', function () {
            touchEnd();
        }));
        core.eHandlers.push(eventHandler(core.track, 'mousedown', function (event) {
            touchStart(event);
        }));
        core.eHandlers.push(eventHandler(core.track, 'mouseup', function () {
            touchEnd();
        }));
        core.eHandlers.push(eventHandler(core.track, 'mouseleave', function () {
            touchEnd();
        }));
        core.eHandlers.push(eventHandler(core.track, 'mousemove', function (event) {
            touchMove(event);
        }));
    };
    var generateElements = function (core) {
        for (var i = 0; i < core.bpall.length; i++) {
            core.bpall[i].bpSLen = core.sLength;
            if (core.settings.inf) {
                for (var j = core.sLength - core.bpall[i]._2Show; j < core.sLength; j++) {
                    var elem = core._ds[j].cloneNode(true);
                    addClass(elem, core.settings.dupCls || '');
                    core.bpall[i].bpSLen++;
                    core.bpall[i].pDups.push(elem);
                }
                for (var j = 0; j < core.bpall[i]._2Show; j++) {
                    var elem = core._ds[j].cloneNode(true);
                    addClass(elem, core.settings.dupCls || '');
                    core.bpall[i].bpSLen++;
                    core.bpall[i].nDups.push(elem);
                }
            }
        }
        var _loop_1 = function (i) {
            var pageLength = Math.floor(core.sLength / core.bpall[i]._2Scroll);
            var navBtns = [];
            var var1 = core.sLength % core.bpall[i]._2Scroll;
            var var2 = core.bpall[i]._2Show - core.bpall[i]._2Scroll;
            if (var2 > var1) {
                pageLength--;
            }
            if (var2 < var1) {
                pageLength++;
            }
            core.bpall[i].dots = [];
            for (var j = 0; j < pageLength; j++) {
                var elem = document.createElement('button');
                elem.setAttribute(_Selectors.dot.slice(1, -1), '');
                elem.setAttribute('type', 'button');
                elem.innerHTML = (j + 1) + '';
                navBtns.push(elem);
            }
            var _loop_2 = function (j) {
                core.eHandlers.push(eventHandler(navBtns[j], 'click', function (event) {
                    event.preventDefault();
                    core.pi = core.ci;
                    core.ci = j * core.bpall[i]._2Scroll;
                    animateTrack(core);
                }));
                core.bpall[i].dots.push(navBtns[j]);
            };
            for (var j = 0; j < pageLength; j++) {
                _loop_2(j);
            }
        };
        for (var i = 0; i < core.bpall.length; i++) {
            _loop_1(i);
        }
    };
    var validateBreakpoints = function (breakpoints) {
        try {
            var tempArr = [];
            var len = breakpoints.length;
            while (len--) {
                if (tempArr.indexOf(breakpoints[len].bp) === -1) {
                    tempArr.push(breakpoints[len].bp);
                }
            }
            if (tempArr.length === breakpoints.length) {
                return {
                    val: true,
                    bp: breakpoints.sort(function (a, b) { return parseFloat(a.bp) - parseFloat(b.bp); })
                };
            }
            else {
                throw new TypeError(_duplicateBreakpointsTypeError);
            }
        }
        catch (e) {
            throw new TypeError(_breakpointsParseTypeError);
        }
    };
    var updateBreakpoints = function (settings) {
        var defaultBreakpoint = {
            _arrows: settings._arrows ? settings._arrows : _Defaults.showArrows,
            _nav: settings._nav ? settings._nav : _Defaults.showNavigation,
            _2Scroll: settings._2Scroll ? settings._2Scroll : _Defaults.slidesToScroll,
            _2Show: settings._2Show ? settings._2Show : _Defaults.slidesToShow,
            bp: 0,
            bpSLen: 0,
            dots: [],
            swipe: settings.swipe ? settings.swipe : _Defaults.hasTouchSwipe,
            nDups: [],
            pDups: []
        };
        var tempArr = [];
        if (settings.res && settings.res.length > 0) {
            var settingsLength = settings.res.length;
            while (settingsLength--) {
                tempArr.push(settings.res[settingsLength]);
            }
        }
        tempArr.push(defaultBreakpoint);
        var updatedArr = validateBreakpoints(tempArr);
        if (updatedArr.val) {
            var bpArr = [updatedArr.bp[0]];
            var bpLen = 1;
            var bp1 = void 0;
            var bp2 = void 0;
            while (bpLen < updatedArr.bp.length) {
                bp1 = bpArr[bpLen - 1];
                bp2 = __assign(__assign({}, bp1), updatedArr.bp[bpLen]);
                if (!bp2._arrows) {
                    bp2._arrows = bp1._arrows;
                }
                if (!bp2._nav) {
                    bp2._nav = bp1._nav;
                }
                if (!bp2._2Show) {
                    bp2._2Show = bp1._2Show;
                }
                if (!bp2._2Scroll) {
                    bp2._2Scroll = bp1._2Scroll;
                }
                if (!bp2.swipe) {
                    bp2.swipe = bp1.swipe;
                }
                bpArr.push(bp2);
                bpLen++;
            }
            return bpArr;
        }
        return [];
    };
    var mapSettings = function (settings) {
        var settingsobj = {
            _2Scroll: settings.slidesToScroll,
            _2Show: settings.slidesToShow,
            _arrows: settings.showArrows,
            _nav: settings.showNavigation,
            activeCls: settings.activeClass,
            aFn: settings.afterScroll,
            auto: settings.autoplay,
            bFn: settings.beforeScroll,
            cntrCls: settings.centeredClass,
            cntrMode: settings.centerMode,
            disableCls: settings.disabledClass,
            dupCls: settings.duplicateClass,
            effect: settings.animationEffect,
            inf: settings.isInfinite,
            isRTL: settings.isRTL,
            pauseHov: settings.pauseOnHover,
            res: [],
            rtlCls: settings.rtlClass,
            speed: settings.animationSpeed,
            startAt: settings.animationSpeed,
            swipe: settings.hasTouchSwipe,
            threshold: settings.touchThreshold,
            timeFn: settings.timingFunction
        };
        if (settings.responsive && settings.responsive.length > 0) {
            for (var i = 0; i < settings.responsive.length; i++) {
                var obj = {
                    _arrows: settings.responsive[i].showArrows,
                    _nav: settings.responsive[i].showNavigation,
                    _2Scroll: settings.responsive[i].slidesToScroll,
                    _2Show: settings.responsive[i].slidesToShow,
                    bp: settings.responsive[i].breakpoint,
                    bpSLen: 0,
                    dots: [],
                    swipe: settings.responsive[i].hasTouchSwipe,
                    nDups: [],
                    pDups: []
                };
                if (settingsobj.res) {
                    settingsobj.res.push(obj);
                }
            }
        }
        return settingsobj;
    };
    var disableAutoplay = function (core) {
        if (core.trackW) {
            removeEventListeners(core, core.trackW);
        }
        if (core.autoTimer) {
            clearInterval(core.autoTimer);
        }
    };
    var enableAutoplay = function (core) {
        if (core.trackW && core.settings.pauseHov) {
            core.eHandlers.push(eventHandler(core.trackW, 'mouseenter', function () {
                core.paused = true;
            }));
            core.eHandlers.push(eventHandler(core.trackW, 'mouseleave', function () {
                core.paused = false;
            }));
        }
        if (!core.settings.pauseHov) {
            core.paused = false;
        }
        core.autoTimer = setInterval(function () {
            if (!core.paused) {
                goToNext(core);
            }
        }, 1000);
    };
    var init = function (core, rootElem, settings) {
        if (typeof settings.beforeInit === 'function') {
            settings.beforeInit();
        }
        var _core = core;
        _core.rootElem = rootElem;
        _core.settings = mapSettings(settings);
        _core.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
        _core.eHandlers = [];
        _core.arrowN = rootElem.querySelector("" + _Selectors.arrowN);
        _core.arrowP = rootElem.querySelector("" + _Selectors.arrowP);
        _core.arrowsW = rootElem.querySelector("" + _Selectors.arrowsW);
        _core.nav = rootElem.querySelector("" + _Selectors.nav);
        _core.navW = rootElem.querySelector("" + _Selectors.navW);
        _core._ds = arrayCall(rootElem.querySelectorAll("" + _Selectors.slide));
        _core.track = rootElem.querySelector("" + _Selectors.track);
        _core.trackW = rootElem.querySelector("" + _Selectors.trackW);
        _core.sLength = _core._ds.length;
        _core.pts = [];
        _core.isLeftAdded = false;
        if (!_core._ds[_core.ci]) {
            _core.ci = settings.startAtIndex = 0;
        }
        if (_core.track && _core.sLength > 0) {
            if (_core.settings.auto) {
                _core.settings.inf = true;
                enableAutoplay(_core);
                disableAutoplay;
            }
            _core.bpall = updateBreakpoints(_core.settings);
            generateElements(_core);
            toggleArrows(_core);
            toggleTouchEvents(_core);
            applyLayout(_core);
        }
        addClass(core.rootElem, core.settings.activeCls);
        if (typeof settings.onInit === 'function') {
            settings.onInit();
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
     * Class for every AMegMen instance.
     *
     */
    var Core = /** @class */ (function () {
        function Core(thisid, rootElem, options) {
            this.core = {};
            this.destroy = function (thisid) {
                var allElems = document.querySelectorAll("#" + thisid + " *");
                var core = allLocalInstances[thisid];
                for (var i = 0; i < allElems.length; i++) {
                    removeEventListeners(core, allElems[i]);
                    if (core.track && hasClass(allElems[i], core.settings.dupCls)) {
                        core.track.removeChild(allElems[i]);
                    }
                    if (core.nav && allElems[i].hasAttribute(_Selectors.dot.slice(1, -1))) {
                        core.nav.removeChild(allElems[i]);
                    }
                    removeClass(allElems[i], core.settings.activeCls + " " + core.settings.cntrCls + " " + core.settings.disableCls + " " + core.settings.dupCls + " " + core.settings.rtlCls);
                }
                delete allLocalInstances[thisid];
            };
            this.resize = function (thisid) {
                applyLayout(allLocalInstances[thisid]);
            };
            var initObj = init(this.core, rootElem, __assign(__assign({}, _Defaults), options));
            this.core = initObj.global;
            allLocalInstances[thisid] = initObj.local;
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
            this.getInsLen = function () {
                var instanceCount = 0;
                for (var e in _this.instances) {
                    if (_this.instances.hasOwnProperty(e)) {
                        instanceCount++;
                    }
                }
                return instanceCount;
            };
            this.winResize = function () {
                if (winResize) {
                    clearTimeout(winResize);
                }
                winResize = setTimeout(function () {
                    for (var e in _this.instances) {
                        if (_this.instances.hasOwnProperty(e)) {
                            _this.instances[e].resize(e);
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
                var roots = arrayCall(document.querySelectorAll(query));
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
                    if (window && _this.getInsLen() > 0 && !isWindowEventAttached) {
                        isWindowEventAttached = true;
                        window.addEventListener('resize', _this.winResize, true);
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
                var roots = arrayCall(document.querySelectorAll(query));
                var rootsLength = roots.length;
                if (rootsLength > 0) {
                    for (var i = 0; i < rootsLength; i++) {
                        var id = roots[i].getAttribute('id');
                        if (id && _this.instances[id]) {
                            _this.instances[id].destroy(id);
                            delete _this.instances[id];
                        }
                    }
                    if (window && _this.getInsLen() === 0) {
                        window.removeEventListener('resize', _this.winResize, true);
                    }
                }
                else {
                    throw new TypeError(_rootSelectorTypeError);
                }
            };
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