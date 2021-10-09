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
        trackO: '[data-carouzeltrackouter]',
        trackW: '[data-carouzeltrackwrapper]'
    };
    var _Defaults = {
        activeClass: '__carouzel-active',
        animationEffect: _animationEffects[0],
        animationSpeed: 400,
        autoplay: false,
        autoplaySpeed: 3000,
        centerBetween: 0,
        centeredClass: '__carouzel-centered',
        disabledClass: '__carouzel-disabled',
        duplicateClass: '__carouzel-duplicate',
        enableKeyboard: true,
        fadingClass: '__carouzel-fade',
        hasTouchSwipe: true,
        hiddenClass: '__carouzel-hidden',
        idPrefix: '__carouzel',
        isInfinite: true,
        isRTL: false,
        pauseOnHover: false,
        pauseOnFocus: false,
        responsive: [],
        rtlClass: '__carouzel-rtl',
        showArrows: true,
        showNavigation: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        startAtIndex: 1,
        timingFunction: 'ease-in-out',
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
     * @param core - Carouzel instance core object
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
    /**
     * Function to update CSS classes on all respective elements
     *
     * @param core - Carouzel instance core object
     *
     */
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
    /**
     * Function to animate the track element based on the calculations
     *
     * @param core - Carouzel instance core object
     *
     */
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
    /**
     * Function to prepend the duplicate or new elements in the track
     *
     * @param parent - Track element in which duplicates need to be prepended
     * @param child - The child element to be prepended
     *
     */
    var doInsertBefore = function (parent, child) {
        var first = parent.querySelectorAll(_Selectors.slide)[0];
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
    var doInsertAfter = function (parent, child) {
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
    var manageDuplicates = function (track, bpo, duplicateClass) {
        var duplicates = track.querySelectorAll('.' + duplicateClass);
        for (var i = 0; i < duplicates.length; i++) {
            track.removeChild(duplicates[i]);
        }
        for (var i = bpo.pDups.length - 1; i >= 0; i--) {
            doInsertBefore(track, bpo.pDups[i]);
        }
        for (var i = 0; i < bpo.nDups.length; i++) {
            doInsertAfter(track, bpo.nDups[i]);
        }
    };
    /**
     * Function to find and apply the appropriate breakpoint settings based on the viewport
     *
     * @param core - Carouzel instance core object
     *
     */
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
        if (!bpoptions._arrows && core.arrowsW) {
            addClass(core.arrowsW, core.settings.hidCls);
        }
        else if (core.arrowsW) {
            removeClass(core.arrowsW, core.settings.hidCls);
        }
        if (!bpoptions._nav && core.navW) {
            addClass(core.navW, core.settings.hidCls);
        }
        else if (core.navW) {
            removeClass(core.navW, core.settings.hidCls);
        }
        if (core.trackO && core.trackW && core.track) {
            core.pts = {};
            if (bpoptions.cntr > 0) {
                addClass(core.trackO, core.settings.cntrCls);
            }
            else {
                removeClass(core.trackO, core.settings.cntrCls);
            }
            slideWidth = core.trackO.clientWidth / (bpoptions._2Show + bpoptions.cntr);
            core.sWidth = slideWidth;
            trackWidth = parseFloat(slideWidth + '') * (core.sLength >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show);
            core.track.style.width = trackWidth + 'px';
            core.trackW.style.width = (bpoptions._2Show * slideWidth) + 'px';
            core._as = core.trackW.querySelectorAll(_Selectors.slide);
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
    /**
     * Function to go to the specific slide number
     *
     * @param core - Carouzel instance core object
     * @param slidenumber - Slide index to which the carouzel should be scrolled to
     *
     */
    var goToSlide = function (core, slidenumber) {
        if (core.ci !== slidenumber) {
            core.pi = core.ci;
            core.ci = slidenumber * core.bpo._2Scroll;
            animateTrack(core);
        }
    };
    /**
     * Function to go to the previous set of slides
     *
     * @param core - Carouzel instance core object
     *
     */
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
    /**
     * Function to go to the next set of slides
     *
     * @param core - Carouzel instance core object
     *
     */
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
    /**
     * Function to add click events to the arrows
     *
     * @param core - Carouzel instance core object
     *
     */
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
    /**
     * Function to add touch events to the track
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleTouchEvents = function (core) {
        var posX1 = 0;
        var posX2 = 0;
        var posFinal = 0;
        var threshold = core.settings.threshold || 100;
        var dragging = false;
        /**
         * Local function for Touch Start event
         *
         */
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
        /**
         * Local function for Touch Move event
         *
         */
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
        /**
         * Local function for Touch End event
         *
         */
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
    /**
     * Function to generate duplicate elements and dot navigation before hand for all breakpoints
     *
     * @param core - Carouzel instance core object
     *
     */
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
    /**
     * Function to validate all breakpoints to check duplicates
     *
     * @param breakpoints - Breakpoint settings array
     *
     */
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
    /**
     * Function to update breakpoints to override missing settings from previous breakpoint
     *
     * @param settings - Core settings object containing merge of default and custom settings
     *
     */
    var updateBreakpoints = function (settings) {
        var defaultBreakpoint = {
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
            swipe: settings.swipe
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
                if (!bp2.cntr) {
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
    var mapSettings = function (settings) {
        var settingsobj = {
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
            dupCls: settings.duplicateClass,
            effect: settings.animationEffect,
            fadCls: settings.fadingClass,
            hidCls: settings.hiddenClass,
            inf: settings.isInfinite,
            isRTL: settings.isRTL,
            kb: settings.enableKeyboard,
            pauseHov: settings.pauseOnHover,
            pauseFoc: settings.pauseOnFocus,
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
                    swipe: settings.responsive[i].hasTouchSwipe
                };
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
    var toggleAutoplay = function (core) {
        if (core.rootElem && core.settings.pauseHov) {
            core.eHandlers.push(eventHandler(core.rootElem, 'mouseenter', function () {
                core.paused = true;
            }));
            core.eHandlers.push(eventHandler(core.rootElem, 'mouseleave', function () {
                core.paused = false;
            }));
        }
        if (core.rootElem && core.settings.pauseFoc) {
            core.eHandlers.push(eventHandler(core.rootElem, 'focus', function () {
                core.paused = true;
            }));
            core.eHandlers.push(eventHandler(core.rootElem, 'blur', function () {
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
        }, core.settings.autoS);
    };
    /**
     * Function to toggle keyboard navigation with left and right arrows
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleKeyboard = function (core) {
        if (core.rootElem && core.settings.kb) {
            core.rootElem.setAttribute('tabindex', '-1');
            var keyCode_1 = '';
            core.eHandlers.push(eventHandler(core.rootElem, 'keydown', function (event) {
                event = event || window.event;
                keyCode_1 = event.key.toLowerCase();
                switch (keyCode_1) {
                    case 'arrowleft':
                        goToPrev(core);
                        break;
                    case 'arrowright':
                        goToNext(core);
                        break;
                    default:
                        keyCode_1 = '';
                        break;
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
    var init = function (core, rootElem, settings) {
        if (typeof settings.beforeInit === 'function') {
            settings.beforeInit();
        }
        var _core = __assign({}, core);
        _core.rootElem = core.rootElem = rootElem;
        _core.settings = mapSettings(settings);
        _core.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
        _core.eHandlers = [];
        _core.arrowN = rootElem.querySelector("" + _Selectors.arrowN);
        _core.arrowP = rootElem.querySelector("" + _Selectors.arrowP);
        _core.arrowsW = rootElem.querySelector("" + _Selectors.arrowsW);
        _core.nav = rootElem.querySelector("" + _Selectors.nav);
        _core.navW = rootElem.querySelector("" + _Selectors.navW);
        _core._ds = rootElem.querySelectorAll("" + _Selectors.slide);
        _core.track = rootElem.querySelector("" + _Selectors.track);
        _core.trackW = rootElem.querySelector("" + _Selectors.trackW);
        _core.trackO = rootElem.querySelector("" + _Selectors.trackO);
        _core.sLength = _core._ds.length;
        _core.pts = [];
        _core.isLeftAdded = false;
        core.goToNext = function () {
            goToNext(_core);
        };
        core.goToPrevious = function () {
            goToPrev(_core);
        };
        core.goToSlide = function (slidenumber) {
            if (!isNaN(slidenumber)) {
                goToSlide(_core, slidenumber - 1);
            }
        };
        core.prependSlide = function (slideElem) {
            if (_core.trackW) {
                doInsertBefore(_core.trackW, slideElem);
            }
        };
        core.appendSlide = function (slideElem) {
            if (_core.trackW) {
                doInsertAfter(_core.trackW, slideElem);
            }
        };
        if (_core.settings.effect === _animationEffects[1]) {
            addClass(core.rootElem, _core.settings.fadCls);
        }
        else {
            removeClass(core.rootElem, _core.settings.fadCls);
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
        addClass(core.rootElem, _core.settings.activeCls);
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
                    allElems[i].removeAttribute('style');
                    removeClass(allElems[i], core.settings.activeCls + " " + core.settings.disableCls + " " + core.settings.dupCls + " " + core.settings.rtlCls);
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
            this.getInstancesLength = function () {
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
             * Function to initialize the Carouzel plugin for provided query strings.
             *
             * @param query - The CSS selector for which the Carouzel needs to be initialized.
             * @param options - The optional object to customize every Carouzel instance.
             *
             */
            this.init = function (query, options) {
                var roots = document.querySelectorAll(query);
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
                            var autoDataAttr = roots[i].getAttribute(_Selectors.rootAuto.slice(1, -1)) || '';
                            if (autoDataAttr) {
                                try {
                                    newOptions = JSON.parse(stringTrim(autoDataAttr).replace(/'/g, '"'));
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
                                var thisid = id ? id : __assign(__assign({}, newOptions), _Defaults).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
                                roots[i].setAttribute('id', thisid);
                                _this.instances[thisid] = new Core(thisid, roots[i], newOptions);
                            }
                        }
                    }
                    if (window && _this.getInstancesLength() > 0 && !isWindowEventAttached) {
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
             * Function to destroy the Carouzel plugin for provided query strings.
             *
             * @param query - The CSS selector for which the Carouzel needs to be initialized.
             *
             */
            this.destroy = function (query) {
                var roots = document.querySelectorAll(query);
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
         * @returns Single Carouzel Instance
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