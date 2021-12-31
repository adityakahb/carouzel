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
    var windowResizeAny;
    var hashSlide;
    var _animationDirections = ["previous", "next"];
    var _animationEffects = ["scroll", "fade"];
    var _easingEffects = [
        "linear",
        "easeInQuad",
        "easeOutQuad",
        "easeInOutQuad",
        "easeInCubic",
        "easeOutCubic",
        "easeInOutCubic",
        "easeInQuart",
        "easeOutQuart",
        "easeInOutQuart",
        "easeInQuint",
        "easeOutQuint",
        "easeInOutQuint",
        "easeInElastic",
        "easeOutElastic",
        "easeInOutElastic",
    ];
    var _rootSelectorTypeError = "Element(s) with the provided query do(es) not exist";
    var _optionsParseTypeError = "Unable to parse the options string";
    var _duplicateBreakpointsTypeError = "Duplicate breakpoints found";
    var _breakpointsParseTypeError = "Error parsing breakpoints";
    var _noEffectFoundError = "Animation effect function not found in presets. Try using one from (".concat(_animationEffects.join(', '), "). Setting the animation effect to ").concat(_animationEffects[0], ".");
    var _noEasingFoundError = "Easing function not found in presets. Try using one from (".concat(_easingEffects.join(', '), "). Setting the easing function to ").concat(_easingEffects[0], ".");
    var _useCapture = false;
    var _Selectors = {
        arrowN: "[data-carouzel-nextarrow]",
        arrowP: "[data-carouzel-previousarrow]",
        controlsW: "[data-carouzel-controlswrapper]",
        dot: "[data-carouzel-navbutton]",
        nav: "[data-carouzel-navigation]",
        navW: "[data-carouzel-navigationwrapper]",
        pauseBtn: "[data-carouzel-pause]",
        playBtn: "[data-carouzel-play]",
        root: "[data-carouzel]",
        rootAuto: "[data-carouzel-auto]",
        rtl: "[data-carouzel-rtl]",
        slide: "[data-carouzel-slide]",
        stitle: "[data-carouzel-title]",
        trk: "[data-carouzel-track]",
        trkM: "[data-carouzel-trackMask]",
        trkO: "[data-carouzel-trackOuter]",
        trkW: "[data-carouzel-trackWrapper]"
    };
    var _Defaults = {
        activeClass: "__carouzel-active",
        animationEffect: _animationEffects[0],
        animationSpeed: 400,
        appendUrlHash: false,
        autoplay: false,
        autoplaySpeed: 3000,
        centerBetween: 0,
        disabledClass: "__carouzel-disabled",
        dotIndexClass: "__carouzel-pageindex",
        dotTitleClass: "__carouzel-pagetitle",
        duplicateClass: "__carouzel-duplicate",
        editClass: "__carouzel-editmode",
        enableKeyboard: true,
        hasTouchSwipe: true,
        hiddenClass: "__carouzel-hidden",
        idPrefix: "__carouzel",
        isInfinite: true,
        isRTL: false,
        pauseOnHover: false,
        responsive: [],
        showArrows: true,
        showNavigation: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        spaceBetween: 0,
        startAtIndex: 1,
        timingFunction: "linear",
        touchThreshold: 100,
        trackUrlHash: false,
        useTitlesAsDots: false
    };
    /*
     * Easing Functions - inspired from http://gizma.com/easing/
     * only considering the t value for the range [0, 1] => [0, 1]
     */
    var _easingFunctions = {
        // no easing, no acceleration
        linear: function (t) { return t; },
        // accelerating from zero velocity
        easeInQuad: function (t) { return t * t; },
        // decelerating to zero velocity
        easeOutQuad: function (t) { return t * (2 - t); },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) { return (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); },
        // accelerating from zero velocity
        easeInCubic: function (t) { return t * t * t; },
        // decelerating to zero velocity
        easeOutCubic: function (t) { return --t * t * t + 1; },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function (t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        // accelerating from zero velocity
        easeInQuart: function (t) { return t * t * t * t; },
        // decelerating to zero velocity
        easeOutQuart: function (t) { return 1 - --t * t * t * t; },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        },
        // accelerating from zero velocity
        easeInQuint: function (t) { return t * t * t * t * t; },
        // decelerating to zero velocity
        easeOutQuint: function (t) { return 1 + --t * t * t * t * t; },
        // acceleration until halfway, then deceleration
        easeInOutQuint: function (t) {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
        },
        // elastic bounce effect at the beginning
        easeInElastic: function (t) { return (0.04 - 0.04 / t) * Math.sin(25 * t) + 1; },
        // elastic bounce effect at the end
        easeOutElastic: function (t) { return ((0.04 * t) / --t) * Math.sin(25 * t); },
        // elastic bounce effect at the beginning and end
        easeInOutElastic: function (t) {
            return (t -= 0.5) < 0
                ? (0.02 + 0.01 / t) * Math.sin(50 * t)
                : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
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
    var stringTrim = function (str) {
        return str.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
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
        if (element && typeof element.className === "string") {
            var clsarr = element.className.split(" ");
            return clsarr.indexOf(cls) > -1 ? true : false;
        }
        return false;
    };
    /**
     * Function to add a string to an element`s class attribute
     *
     * @param element - An HTML Element
     * @param cls - A string
     *
     */
    var addClass = function (element, cls) {
        if (element && typeof element.className === "string") {
            var clsarr = cls.split(" ");
            var clsarrLength = clsarr.length;
            for (var i = 0; i < clsarrLength; i++) {
                var thiscls = clsarr[i];
                if (!hasClass(element, thiscls)) {
                    element.className += " " + thiscls;
                }
            }
            element.className = stringTrim(element.className);
        }
    };
    /**
     * Function to remove a string from an element`s class attribute
     *
     * @param element - An HTML Element
     * @param cls - A string
     *
     */
    var removeClass = function (element, cls) {
        if (element && typeof element.className === "string") {
            var clsarr = cls.split(" ");
            var curclass = element.className.split(" ");
            var curclassLen = curclass.length;
            for (var i = 0; i < curclassLen; i++) {
                var thiscls = curclass[i];
                if (clsarr.indexOf(thiscls) > -1) {
                    curclass.splice(i, 1);
                    i--;
                }
            }
            element.className = stringTrim(curclass.join(" "));
        }
    };
    /**
     * Function to fix the decimal places to 4
     *
     * @param num - A number
     *
     * @returns A string converted by applying toFixed function with decimal places 4
     *
     */
    var toFixed4 = function (num) {
        return num.toFixed(4);
    };
    /**
     * Function to apply the settings to all the instances w.r.t. applicable breakpoint
     *
     */
    var winResizeFn = function () {
        if (typeof windowResizeAny !== "undefined") {
            clearTimeout(windowResizeAny);
        }
        windowResizeAny = setTimeout(function () {
            for (var e in allLocalInstances) {
                if (allLocalInstances.hasOwnProperty(e)) {
                    applyLayout(allLocalInstances[e], false);
                }
            }
        }, 0);
    };
    /**
     * Function to return the number of Instances created
     *
     */
    var getCoreInstancesLength = function () {
        return Object.keys(allLocalInstances).length;
    };
    /**
     * Function to remove all local events assigned to the navigation elements.
     *
     * @param core - Carouzel instance core object
     * @param element - An HTML Element from which the events need to be removed
     *
     */
    var removeEventListeners = function (core, element) {
        var j = core.eHandlers.length;
        while (j--) {
            if (core.eHandlers[j].element.isEqualNode &&
                core.eHandlers[j].element.isEqualNode(element)) {
                core.eHandlers[j].remove();
                core.eHandlers.splice(j, 1);
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
    var updateAttributes = function (core) {
        var x;
        for (var i = 0; i < core._as.length; i++) {
            if (core._as[i]) {
                removeClass(core._as[i], core.opts.activeCls);
                core._as[i].setAttribute("aria-hidden", "true");
            }
        }
        for (var i = core.ci + core.bpo.pDups.length; i < core.ci + core.bpo.pDups.length + core.bpo._2Show; i++) {
            if (core._as[i]) {
                addClass(core._as[i], core.opts.activeCls);
                core._as[i].removeAttribute("aria-hidden");
            }
        }
        if (!core.opts.inf && core.ci === 0) {
            addClass(core.arrowP, core.opts.disableCls || "");
        }
        else {
            removeClass(core.arrowP, core.opts.disableCls || "");
        }
        if (!core.opts.inf && core.ci === core.sLen - core.bpo._2Show) {
            addClass(core.arrowN, core.opts.disableCls || "");
        }
        else {
            removeClass(core.arrowN, core.opts.disableCls || "");
        }
        if (core.bpo.dots.length > 0) {
            for (var i = 0; i < core.bpo.dots.length; i++) {
                removeClass(core.bpo.dots[i], core.opts.activeCls);
            }
            x = Math.floor(core.ci / core.bpo._2Scroll);
            if (core.opts.rtl) {
                x = core.bpo.dots.length - x - 1;
            }
            if (x < 0) {
                x = core.bpo.dots.length - 1;
            }
            if (core.bpo.dots[x]) {
                addClass(core.bpo.dots[x], core.opts.activeCls);
            }
        }
    };
    /**
     * Function to animate the track element based on the calculations
     *
     * @param core - Carouzel instance core object
     *
     */
    var animateTrack = function (core, touchedPixel) {
        touchedPixel = touchedPixel ? touchedPixel : 0;
        if (typeof core.opts.bFn === "function") {
            core.opts.bFn();
        }
        if (!core.pi) {
            core.pi = 0;
        }
        if (core.opts.inf && core.trk) {
            core.trk.style.transform = "translate3d(".concat(-core.pts[core.pi], "px, 0, 0)");
        }
        else {
            if (core.ci < 0) {
                core.ci = 0;
            }
            if (core.ci + core.bpo._2Show >= core.sLen) {
                core.ci = core.sLen - core.bpo._2Show;
            }
        }
        var postAnimation = function () {
            if (core.ci >= core.sLen) {
                core.ci = core.sLen - core.ci;
            }
            if (core.ci < 0) {
                core.ci = core.sLen + core.ci;
            }
            if (core.trk) {
                core.trk.style.transform = "translate3d(".concat(-core.pts[core.ci], "px, 0, 0)");
            }
            core.ct = -core._t.nextX;
            updateAttributes(core);
            setTimeout(function () {
                if (core.opts._urlH && core.root) {
                    hashSlide = core.root.querySelector(".".concat(core.opts.activeCls));
                    if (hashSlide && (window === null || window === void 0 ? void 0 : window.location)) {
                        window.location.hash = hashSlide.getAttribute("id") || "";
                    }
                    hashSlide = null;
                }
                if (typeof core.opts.aFn === "function") {
                    core.opts.aFn();
                }
            }, 0);
        };
        updateAttributes(core);
        if (performance) {
            core._t.start = performance.now();
        }
        else {
            core._t.start = Date.now();
        }
        core._t.prevX = core.pts[core.pi];
        core._t.nextX = core.pts[core.ci];
        var scrollThisTrack = function (now) {
            core._t.elapsed = now - core._t.start;
            core._t.progress = _easingFunctions[core.opts.timeFn](core._t.elapsed / core._t.total);
            if (core.ci > core.pi) {
                core._t.position =
                    core._t.prevX +
                        (touchedPixel ? touchedPixel : 0) +
                        core._t.progress * (core._t.nextX - core._t.prevX);
                if (core._t.position > core._t.nextX) {
                    core._t.position = core._t.nextX;
                }
            }
            if (core.ci < core.pi) {
                core._t.position =
                    core._t.prevX +
                        (touchedPixel ? touchedPixel : 0) -
                        core._t.progress * (core._t.prevX - core._t.nextX);
                if (core._t.position < core.pts[core.ci]) {
                    core._t.position = core.pts[core.ci];
                }
            }
            if (core._t.position && core.trk) {
                core._t.position = Math.round(core._t.position);
                core.trk.style.transform = "translate3d(".concat(-core._t.position, "px, 0, 0)");
            }
            if (core._t.progress < 1 && core._t.position !== core.pts[core.ci]) {
                core._t.id = requestAnimationFrame(scrollThisTrack);
            }
            else {
                postAnimation();
            }
        };
        if (core.opts.effect === _animationEffects[0] && core.trk) {
            if (core._t.start && core._t.total && core.ci !== core.pi) {
                core._t.id = requestAnimationFrame(scrollThisTrack);
            }
        }
        var fadeThisTrack = function (now) {
            core._t.elapsed = now - core._t.start;
            core._t.progress = _easingFunctions[core.opts.timeFn](core._t.elapsed / core._t.total);
            core._t.progress = core._t.progress > 1 ? 1 : core._t.progress;
            for (var i = 0; i < core._as.length; i++) {
                if (i < core.ci + core.bpo._2Show && core.pi < core.ci) {
                    core._as[i].style.visibility = "visible";
                }
                if (i > core.ci + core.bpo._2Show && core.pi > core.ci) {
                    core._as[i].style.visibility = "visible";
                }
                if (hasClass(core._as[i], core.opts.activeCls)) {
                    core._as[i].style.opacity = "" + core._t.progress;
                }
                else {
                    core._as[i].style.opacity =
                        "" + (1 - core._t.progress);
                }
            }
            if (core._t.progress < 1) {
                core._t.id = requestAnimationFrame(fadeThisTrack);
            }
            else {
                postAnimation();
                for (var i = 0; i < core._as.length; i++) {
                    core._as[i].style.transform = "translate3d(0, 0, 0)";
                    if (hasClass(core._as[i], core.opts.activeCls)) {
                        core._as[i].style.opacity = "1";
                    }
                    else {
                        core._as[i].style.visibility = "hidden";
                        core._as[i].style.opacity = "0";
                    }
                }
            }
        };
        if (core.opts.effect === _animationEffects[1] && core.trk) {
            core.trk.style.transform = "translate3d(".concat(-core._t.nextX, "px, 0, 0)");
            for (var i = 0; i < core._as.length; i++) {
                if (hasClass(core._as[i], core.opts.activeCls)) {
                    core._as[i].style.visibility = "visible";
                    core._as[i].style.opacity = "1";
                    core._as[i].style.transform = "translate3d(0, 0, 0)";
                }
                else {
                    core._as[i].style.visibility = "hidden";
                    core._as[i].style.opacity = "0";
                    if (i < core.ci + core.bpo._2Show) {
                        core._as[i].style.transform = "translate3d(".concat(core.pts[0] - core.bpo.gutr, "px, 0, 0)");
                    }
                    if (i > core.ci + core.bpo._2Show) {
                        core._as[i].style.transform = "translate3d(".concat(-(core.pts[0] - core.bpo.gutr), "px, 0, 0)");
                    }
                }
            }
            if (core._t.start && core._t.total && core.ci !== core.pi) {
                core._t.id = requestAnimationFrame(fadeThisTrack);
            }
        }
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
        var duplicates = track.querySelectorAll("." + duplicateClass);
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
    var applyLayout = function (core, isRTLFirstLoad) {
        var viewportWidth = window === null || window === void 0 ? void 0 : window.innerWidth;
        var bpoptions = core.bpall[0];
        var len = 0;
        var slideWidth = 0;
        var trkWidth = 0;
        var temp = 0;
        while (len < core.bpall.length) {
            if ((core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) ||
                typeof core.bpall[len + 1] === "undefined") {
                bpoptions = core.bpall[len];
                break;
            }
            len++;
        }
        if (core.root &&
            !hasClass(core.root, core.opts.editCls) &&
            (core.bpo_old || {})._2Show !== bpoptions._2Show &&
            core.trk) {
            manageDuplicates(core.trk, bpoptions, core.opts.dupCls || "");
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
        if (!bpoptions._arrows && core.controlsW) {
            addClass(core.controlsW, core.opts.hidCls);
        }
        else if (core.controlsW) {
            removeClass(core.controlsW, core.opts.hidCls);
        }
        if (!bpoptions._nav && core.navW) {
            addClass(core.navW, core.opts.hidCls);
        }
        else if (core.navW) {
            removeClass(core.navW, core.opts.hidCls);
        }
        if (isRTLFirstLoad) {
            core.ci = core.opts.startAt = core.sLen - bpoptions._2Scroll;
        }
        if (core.root && core.trkW && core.trkO && core.trk) {
            core.pts = {};
            slideWidth =
                (core.trkW.clientWidth - (bpoptions._2Show - 1) * bpoptions.gutr) /
                    (bpoptions._2Show + bpoptions.cntr);
            core.sWid = slideWidth;
            temp =
                core.sLen >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show;
            trkWidth = slideWidth * temp + bpoptions.gutr * (temp + 1);
            core.trk.style.width = toFixed4(trkWidth) + "px";
            core.trkO.style.width =
                toFixed4(bpoptions._2Show * slideWidth +
                    bpoptions.gutr * (bpoptions._2Show - 1)) + "px";
            core._as = core.trkO.querySelectorAll(_Selectors.slide);
            for (var i = 0; i < core._as.length; i++) {
                core._as[i].style.width = toFixed4(slideWidth) + "px";
                if (i === 0) {
                    core._as[i].style.marginLeft =
                        toFixed4(bpoptions.gutr) + "px";
                    core._as[i].style.marginRight =
                        toFixed4(bpoptions.gutr / 2) + "px";
                }
                else if (i === core._as.length - 1) {
                    core._as[i].style.marginLeft =
                        toFixed4(bpoptions.gutr / 2) + "px";
                    core._as[i].style.marginRight =
                        toFixed4(bpoptions.gutr) + "px";
                }
                else {
                    core._as[i].style.marginLeft =
                        toFixed4(bpoptions.gutr / 2) + "px";
                    core._as[i].style.marginRight =
                        toFixed4(bpoptions.gutr / 2) + "px";
                }
            }
            for (var i = bpoptions.pDups.length; i > 0; i--) {
                core.pts[-i] =
                    (-i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                        bpoptions.gutr;
            }
            for (var i = 0; i < core.sLen; i++) {
                core.pts[i] =
                    (i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                        bpoptions.gutr;
            }
            for (var i = core.sLen; i < core.sLen + bpoptions.nDups.length; i++) {
                core.pts[i] =
                    (i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                        bpoptions.gutr;
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
            if (core._t.id) {
                cancelAnimationFrame(core._t.id);
            }
            animateTrack(core);
        }
    };
    /**
     * Function to go to the previous set of slides
     *
     * @param core - Carouzel instance core object
     *
     */
    var goToPrev = function (core, touchedPixel) {
        core.pi = core.ci;
        core.ci -= core.bpo._2Scroll;
        if (core._t.id) {
            cancelAnimationFrame(core._t.id);
        }
        if (core.opts.inf) {
            if (typeof core.pts[core.ci] === "undefined") {
                core.pi =
                    core.sLen -
                        (core.sLen % core.bpo._2Scroll > 0
                            ? core.sLen % core.bpo._2Scroll
                            : core.bpo._2Scroll);
                core.ci = core.pi - core.bpo._2Scroll;
            }
            else {
                core.pi = core.ci + core.bpo._2Scroll;
            }
        }
        animateTrack(core, touchedPixel);
    };
    /**
     * Function to go to the next set of slides
     *
     * @param core - Carouzel instance core object
     *
     */
    var goToNext = function (core, touchedPixel) {
        core.pi = core.ci;
        core.ci += core.bpo._2Scroll;
        if (core._t.id) {
            cancelAnimationFrame(core._t.id);
        }
        if (core.opts.inf) {
            if (typeof core.pts[core.ci + core.bpo._2Show] === "undefined") {
                core.pi = core.pi - core.sLen;
                core.ci = 0;
            }
            else {
                core.pi = core.ci - core.bpo._2Scroll;
            }
        }
        animateTrack(core, touchedPixel);
    };
    /**
     * Function to toggle keyboard navigation with left and right arrows
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleKeyboard = function (core) {
        if (core.root && core.opts.kb) {
            core.root.setAttribute("tabindex", "-1");
            var keyCode_1 = "";
            core.eHandlers.push(eventHandler(core.root, "keydown", function (event) {
                event = event || (window === null || window === void 0 ? void 0 : window.event);
                keyCode_1 = event.key.toLowerCase();
                switch (keyCode_1) {
                    case "arrowleft":
                        goToPrev(core, 0);
                        break;
                    case "arrowright":
                        goToNext(core, 0);
                        break;
                    default:
                        keyCode_1 = "";
                        break;
                }
            }));
        }
    };
    /**
     * Function to toggle Play and Pause buttons when autoplaying carouzel is played or paused
     *
     * @param core - Carouzel instance core object
     * @param shouldPlay - A boolean value determining if the carouzel is being played or is paused
     *
     */
    var togglePlayPause = function (core, shouldPlay) {
        if (core && core.bPause && core.bPlay) {
            if (shouldPlay) {
                addClass(core.bPlay, core.opts.hidCls);
                removeClass(core.bPause, core.opts.hidCls);
            }
            else {
                addClass(core.bPause, core.opts.hidCls);
                removeClass(core.bPlay, core.opts.hidCls);
            }
        }
    };
    /**
     * Function to toggle Autoplay and pause on hover functionalities for the carouzel
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleAutoplay = function (core) {
        if (core.root && core.opts.pauseHov) {
            core.eHandlers.push(eventHandler(core.root, "mouseenter", function () {
                core.paused = true;
                togglePlayPause(core, false);
            }));
            core.eHandlers.push(eventHandler(core.root, "mouseleave", function () {
                core.paused = false;
                togglePlayPause(core, true);
            }));
        }
        if (!core.opts.pauseHov) {
            core.paused = false;
        }
        core.autoT = setInterval(function () {
            if (!core.paused && !core.pauseClk) {
                goToNext(core, 0);
            }
        }, core.opts.autoS);
    };
    /**
     * Function to add click events to the arrows
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleControlButtons = function (core) {
        if (core.arrowP) {
            core.eHandlers.push(eventHandler(core.arrowP, "click", function (event) {
                event.preventDefault();
                goToPrev(core, 0);
            }));
        }
        if (core.arrowN) {
            core.eHandlers.push(eventHandler(core.arrowN, "click", function (event) {
                event.preventDefault();
                goToNext(core, 0);
            }));
        }
        if (core.opts.inf && core.bPause) {
            core.eHandlers.push(eventHandler(core.bPause, "click", function (event) {
                event.preventDefault();
                core.pauseClk = true;
                togglePlayPause(core, false);
            }));
        }
        if (core.opts.inf && core.bPlay) {
            core.eHandlers.push(eventHandler(core.bPlay, "click", function (event) {
                event.preventDefault();
                core.pauseClk = false;
                togglePlayPause(core, true);
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
        var diffX = 0;
        var diffY = 0;
        var dragging = false;
        var endX = 0;
        var endY = 0;
        var posFinal = 0;
        var posX1 = 0;
        var posX2 = 0;
        var ratioX = 0;
        var ratioY = 0;
        var startX = 0;
        var startY = 0;
        var threshold = core.opts.threshold || 100;
        var canFiniteAnimate = false;
        var touchStart = function (e) {
            dragging = true;
            if (e.type === "touchstart") {
                startX = e.changedTouches[0].screenX;
                startY = e.changedTouches[0].screenY;
                posX1 = e.changedTouches[0].screenX;
            }
            else {
                startX = e.clientX;
                startY = e.clientY;
                posX1 = e.clientX;
            }
        };
        var touchMove = function (e) {
            if (dragging) {
                if (e.type === "touchmove") {
                    endX = e.changedTouches[0].screenX;
                    endY = e.changedTouches[0].screenY;
                    posX2 = posX1 - e.changedTouches[0].screenX;
                }
                else {
                    endX = e.clientX;
                    endY = e.clientY;
                    posX2 = posX1 - e.clientX;
                }
                diffX = endX - startX;
                diffY = endY - startY;
                ratioX = Math.abs(diffX / diffY);
                ratioY = Math.abs(diffY / diffX);
                if (!core.ct) {
                    core.ct = -core.pts[core.ci];
                }
                if (ratioX > ratioY) {
                    if (core.trk && core.opts.effect === _animationEffects[0]) {
                        core.trk.style.transform = "translate3d(".concat(core.ct - posX2, "px, 0, 0)");
                    }
                    if (core.trk && core.opts.effect === _animationEffects[1]) {
                        for (var k = 0; k < core._as.length; k++) {
                            core._as[k].style.opacity = "1";
                        }
                    }
                }
                posFinal = posX2;
            }
        };
        var touchEnd = function (e) {
            if (dragging && core.trk) {
                if (e.type === "touchend") {
                    endX = e.changedTouches[0].screenX;
                    endY = e.changedTouches[0].screenY;
                }
                else {
                    endX = e.clientX;
                    endY = e.clientY;
                }
                diffX = endX - startX;
                diffY = endY - startY;
                ratioX = Math.abs(diffX / diffY);
                ratioY = Math.abs(diffY / diffX);
                if (!isNaN(ratioX) &&
                    !isNaN(ratioY) &&
                    ratioY !== Infinity &&
                    ratioX !== Infinity &&
                    ratioX !== ratioY) {
                    canFiniteAnimate = false;
                    if (!core.opts.inf) {
                        if (diffX > 0) {
                            if (Math.abs(core.ct) <= 0) {
                                core.trk.style.transform = "translate3d(".concat(core.ct, "px, 0, 0)");
                            }
                            else {
                                canFiniteAnimate = true;
                            }
                        }
                        else if (diffX < 0) {
                            if (Math.abs(core.ct) + core.sWid * core.bpo._2Show >=
                                core.sWid * core._as.length) {
                                core.trk.style.transform = "translate3d(".concat(core.ct, "px, 0, 0)");
                            }
                            else {
                                canFiniteAnimate = true;
                            }
                        }
                    }
                    if (core.opts.effect === _animationEffects[1]) {
                        for (var k = 0; k < core._as.length; k++) {
                            core._as[k].style.opacity = "0";
                        }
                    }
                    if (posFinal < -threshold) {
                        if (core.opts.effect === _animationEffects[0] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            goToPrev(core, posFinal);
                        }
                        if (core.opts.effect === _animationEffects[1] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            goToPrev(core, 1);
                        }
                    }
                    else if (posFinal > threshold) {
                        if (core.opts.effect === _animationEffects[0] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            goToNext(core, posFinal);
                        }
                        if (core.opts.effect === _animationEffects[1] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            goToNext(core, 1);
                        }
                    }
                    else {
                        if (core.opts.effect === _animationEffects[0]) {
                            core.trk.style.transform = "translate3d(".concat(core.ct, "px, 0, 0)");
                        }
                        if (core.opts.effect === _animationEffects[1]) {
                            for (var k = 0; k < core._as.length; k++) {
                                core._as[k].style.opacity = "1";
                            }
                        }
                    }
                }
                posX1 = posX2 = posFinal = 0;
                dragging = false;
            }
        };
        core.eHandlers.push(eventHandler(core.trk, "touchstart", function (event) {
            touchStart(event);
        }));
        core.eHandlers.push(eventHandler(core.trk, "touchmove", function (event) {
            touchMove(event);
        }));
        core.eHandlers.push(eventHandler(core.trk, "touchend", function (e) {
            touchEnd(e);
        }));
        core.eHandlers.push(eventHandler(core.trk, "mousedown", function (event) {
            touchStart(event);
        }));
        core.eHandlers.push(eventHandler(core.trk, "mouseup", function (e) {
            touchEnd(e);
        }));
        core.eHandlers.push(eventHandler(core.trk, "mouseleave", function (e) {
            touchEnd(e);
        }));
        core.eHandlers.push(eventHandler(core.trk, "mousemove", function (event) {
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
            core.bpall[i].bpSLen = core.sLen;
            if (core.opts.inf) {
                for (var j = core.sLen -
                    core.bpall[i]._2Show -
                    Math.ceil(core.bpall[i].cntr / 2); j < core.sLen; j++) {
                    if (core._ds[j]) {
                        var elem = core._ds[j].cloneNode(true);
                        addClass(elem, core.opts.dupCls || "");
                        core.bpall[i].bpSLen++;
                        core.bpall[i].pDups.push(elem);
                    }
                }
                for (var j = 0; j < core.bpall[i]._2Show + Math.ceil(core.bpall[i].cntr / 2); j++) {
                    if (core._ds[j]) {
                        var elem = core._ds[j].cloneNode(true);
                        addClass(elem, core.opts.dupCls || "");
                        core.bpall[i].bpSLen++;
                        core.bpall[i].nDups.push(elem);
                    }
                }
            }
        }
        var _loop_1 = function (i) {
            var pageLength = Math.floor(core.sLen / core.bpall[i]._2Scroll);
            var navBtns = [];
            var var1 = core.sLen % core.bpall[i]._2Scroll;
            var var2 = core.bpall[i]._2Show - core.bpall[i]._2Scroll;
            if (var2 > var1) {
                pageLength--;
            }
            if (var2 < var1) {
                pageLength++;
            }
            core.bpall[i].dots = [];
            var btnStr = "";
            for (var j = 0; j < pageLength; j++) {
                var elem = document === null || document === void 0 ? void 0 : document.createElement("button");
                elem.setAttribute(_Selectors.dot.slice(1, -1), "");
                elem.setAttribute("type", "button");
                btnStr = "<div class=\"".concat(core.opts.dotNcls, "\">").concat(j + 1, "</div>");
                if (core.opts.useTitle &&
                    core.bpall[i]._2Show === 1 &&
                    core._ds[j].getAttribute(_Selectors.stitle.slice(1, -1))) {
                    btnStr += core._ds[j].getAttribute(_Selectors.stitle.slice(1, -1));
                    addClass(elem, core.opts.dotCls);
                }
                elem.innerHTML = btnStr;
                navBtns.push(elem);
            }
            var _loop_2 = function (j) {
                core.eHandlers.push(eventHandler(navBtns[j], "click", function (event) {
                    event.preventDefault();
                    core.pi = core.ci;
                    core.ci = j * core.bpall[i]._2Scroll;
                    if (core.opts.rtl) {
                        core.ci = (pageLength - j - 1) * core.bpall[i]._2Scroll;
                    }
                    else {
                        core.ci = j * core.bpall[i]._2Scroll;
                    }
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
                // throw new TypeError(_duplicateBreakpointsTypeError);
                return {};
                console.error(_duplicateBreakpointsTypeError);
            }
        }
        catch (e) {
            // throw new TypeError(_breakpointsParseTypeError);
            return {};
            console.error(_breakpointsParseTypeError);
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
            gutr: settings.gutr,
            nDups: [],
            pDups: [],
            swipe: settings.swipe
        };
        var tempArr = [];
        if (settings.res && settings.res.length > 0) {
            var settingsLen = settings.res.length;
            while (settingsLen--) {
                tempArr.push(settings.res[settingsLen]);
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
                if (typeof bp2._arrows === "undefined") {
                    bp2._arrows = bp1._arrows;
                }
                if (typeof bp2._nav === "undefined") {
                    bp2._nav = bp1._nav;
                }
                if (typeof bp2._2Show === "undefined") {
                    bp2._2Show = bp1._2Show;
                }
                if (typeof bp2._2Scroll === "undefined") {
                    bp2._2Scroll = bp1._2Scroll;
                }
                if (typeof bp2.swipe === "undefined") {
                    bp2.swipe = bp1.swipe;
                }
                if (typeof bp2.cntr === "undefined") {
                    bp2.cntr = bp1.cntr;
                }
                if (typeof bp2.gutr === "undefined") {
                    bp2.gutr = bp1.gutr;
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
            _urlH: settings.appendUrlHash,
            activeCls: settings.activeClass,
            aFn: settings.afterScroll,
            auto: settings.autoplay,
            autoS: settings.autoplaySpeed,
            bFn: settings.beforeScroll,
            cntr: settings.centerBetween,
            disableCls: settings.disabledClass,
            dotCls: settings.dotTitleClass,
            dotNcls: settings.dotIndexClass,
            dupCls: settings.duplicateClass,
            editCls: settings.editClass,
            effect: (function () {
                if (_animationEffects.indexOf(settings.animationEffect) > -1) {
                    return settings.animationEffect;
                }
                console.warn(_noEffectFoundError);
                return _animationEffects[0];
            })(),
            gutr: settings.spaceBetween,
            hidCls: settings.hiddenClass,
            inf: settings.isInfinite,
            rtl: settings.isRTL,
            kb: settings.enableKeyboard,
            pauseHov: settings.pauseOnHover,
            res: [],
            speed: settings.animationSpeed,
            startAt: settings.animationSpeed,
            swipe: settings.hasTouchSwipe,
            threshold: settings.touchThreshold,
            timeFn: (function () {
                if (_easingFunctions[settings.timingFunction]) {
                    return settings.timingFunction;
                }
                console.warn(_noEasingFoundError);
                return _easingEffects[0];
            })(),
            useTitle: settings.useTitlesAsDots
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
                    gutr: settings.responsive[i].spaceBetween,
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
     * Function to initialize the carouzel core object and assign respective events
     *
     * @param core - Carouzel instance core object
     *
     */
    var init = function (root, settings) {
        var _a;
        if (typeof settings.beforeInit === "function") {
            settings.beforeInit();
        }
        // let _core: ICore = { ...core };
        var _core = {};
        _core.root = root;
        _core.opts = mapSettings(settings);
        _core._ds = root.querySelectorAll("".concat(_Selectors.slide));
        _core.arrowN = root.querySelector("".concat(_Selectors.arrowN));
        _core.arrowP = root.querySelector("".concat(_Selectors.arrowP));
        _core.bPause = root.querySelector("".concat(_Selectors.pauseBtn));
        _core.bPlay = root.querySelector("".concat(_Selectors.playBtn));
        _core.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
        _core.controlsW = root.querySelector("".concat(_Selectors.controlsW));
        _core.eHandlers = [];
        _core.nav = root.querySelector("".concat(_Selectors.nav));
        _core.navW = root.querySelector("".concat(_Selectors.navW));
        _core.pts = [];
        _core.sLen = _core._ds.length;
        _core.trk = root.querySelector("".concat(_Selectors.trk));
        _core.trkM = root.querySelector("".concat(_Selectors.trkM));
        _core.trkO = root.querySelector("".concat(_Selectors.trkO));
        _core.trkW = root.querySelector("".concat(_Selectors.trkW));
        _core.opts.rtl = false;
        if (_core.root.hasAttribute(_Selectors.rtl.slice(1, -1))) {
            _core.opts.rtl = true;
        }
        _core._t = {};
        _core._t.total = _core.opts.speed;
        // core.prependSlide = (slideElem: Node) => {
        //   if (_core.trk) {
        //     doInsertBefore(_core.trk, slideElem);
        //   }
        // };
        // core.appendSlide = (slideElem: Node) => {
        //   if (_core.trk) {
        //     doInsertAfter(_core.trk, slideElem);
        //   }
        // };
        if (!_core._ds[_core.ci]) {
            _core.ci = settings.startAtIndex = 0;
        }
        if (_core.trk && _core.sLen > 0) {
            if (_core.opts.auto) {
                _core.opts.inf = true;
                toggleAutoplay(_core);
            }
            _core.bpall = updateBreakpoints(_core.opts);
            toggleKeyboard(_core);
            generateElements(_core);
            toggleControlButtons(_core);
            toggleTouchEvents(_core);
            applyLayout(_core, _core.opts.rtl);
        }
        addClass(_core.root, _core.opts.activeCls);
        if (typeof settings.afterInit === "function") {
            settings.afterInit();
        }
        if (settings.trackUrlHash && ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hash)) {
            var windowHash = window.location.hash || "";
            if (windowHash.charAt(0) === "#") {
                windowHash = windowHash.slice(1, windowHash.length);
            }
            if ((windowHash || '').length > 0) {
                var thisSlides = _core.root.querySelectorAll("".concat(_Selectors.slide));
                var foundSlideIndex = -1;
                for (var s = 0; s < thisSlides.length; s++) {
                    if (thisSlides[s].getAttribute("id") === windowHash) {
                        foundSlideIndex = s;
                        break;
                    }
                }
                if (foundSlideIndex !== -1) {
                    goToSlide(_core, foundSlideIndex);
                }
            }
        }
        return _core;
    };
    var destroy = function (core) {
        var _a;
        var id = (_a = core.root) === null || _a === void 0 ? void 0 : _a.getAttribute('id');
        var allElems = core.root.querySelectorAll("*");
        for (var i = 0; i < allElems.length; i++) {
            removeEventListeners(core, allElems[i]);
            if (core.trk && hasClass(allElems[i], core.opts.dupCls)) {
                core.trk.removeChild(allElems[i]);
            }
            if (core.nav && allElems[i].hasAttribute(_Selectors.dot.slice(1, -1))) {
                core.nav.removeChild(allElems[i]);
            }
            allElems[i].removeAttribute("style");
            removeClass(allElems[i], "".concat(core.opts.activeCls, " ").concat(core.opts.editCls, " ").concat(core.opts.disableCls, " ").concat(core.opts.dupCls));
        }
        removeClass(core.root, "".concat(core.opts.activeCls, " ").concat(core.opts.editCls, " ").concat(core.opts.disableCls, " ").concat(core.opts.dupCls));
        if (id) {
            delete allLocalInstances[id];
        }
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
        function Core(thisid, root, options) {
            allLocalInstances[thisid] = init(root, __assign(__assign({}, _Defaults), options));
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
            /**
             * Function to get the Carouzel based on the query string provided.
             *
             * @param query - The CSS selector for which the Carouzel needs to be initialized.
             *
             * @returns an array of all available core instances on page
             */
            this.getCores = function (query) {
                var roots = document === null || document === void 0 ? void 0 : document.querySelectorAll(query);
                var rootsLen = roots.length;
                var tempArr = [];
                if (rootsLen > 0) {
                    for (var i = 0; i < rootsLen; i++) {
                        var id = roots[i].getAttribute("id");
                        if (id && allLocalInstances[id]) {
                            tempArr.push(allLocalInstances[id]);
                        }
                    }
                }
                return tempArr;
            };
            /**
             * Function to return count of all available carouzel objects
             *
             * @returns count of all available carouzel objects
             *
             */
            this.totalCores = function () { return getCoreInstancesLength(); };
            /**
             * Function to initialize the Carouzel plugin for provided query strings.
             *
             * @param query - The CSS selector for which the Carouzel needs to be initialized.
             * @param options - The optional object to customize every Carouzel instance.
             *
             */
            this.init = function (query, options) {
                var elements = document === null || document === void 0 ? void 0 : document.querySelectorAll(query);
                var elementsLength = elements.length;
                var instanceLength = getCoreInstancesLength();
                if (elementsLength > 0) {
                    for (var i = 0; i < elementsLength; i++) {
                        var id = elements[i].getAttribute("id");
                        var isElementPresent = false;
                        if (id) {
                            for (var j = 0; j < instanceLength; j++) {
                                if (allLocalInstances[id]) {
                                    isElementPresent = true;
                                    break;
                                }
                            }
                        }
                        if (!isElementPresent) {
                            var newOptions = void 0;
                            var autoDataAttr = elements[i].getAttribute(_Selectors.rootAuto.slice(1, -1)) || "";
                            if (autoDataAttr) {
                                try {
                                    newOptions = JSON.parse(stringTrim(autoDataAttr).replace(/'/g, "\""));
                                }
                                catch (e) {
                                    // throw new TypeError(_optionsParseTypeError);
                                    console.error(_optionsParseTypeError);
                                }
                            }
                            else {
                                newOptions = options;
                            }
                            if (id) {
                                new Core(id, elements[i], newOptions);
                            }
                            else {
                                var thisid = id
                                    ? id
                                    : __assign(__assign({}, newOptions), _Defaults).idPrefix +
                                        "_" +
                                        new Date().getTime() +
                                        "_root_" +
                                        (i + 1);
                                elements[i].setAttribute("id", thisid);
                                new Core(thisid, elements[i], newOptions);
                            }
                        }
                    }
                    if (getCoreInstancesLength() > 0 && !isWindowEventAttached) {
                        isWindowEventAttached = true;
                        window === null || window === void 0 ? void 0 : window.addEventListener("resize", winResizeFn, false);
                    }
                }
                else {
                    if (query !== _Selectors.rootAuto) {
                        // throw new TypeError(_rootSelectorTypeError);
                        console.error(_rootSelectorTypeError);
                    }
                }
            };
            /**
             * Function to initialize all the carouzel which have `data-carouzelauto` set
             *
             */
            this.globalInit = function () {
                _this.init(_Selectors.rootAuto);
            };
            /**
             * Function to animate to a certain slide based on a provided direction or number
             *
             * @param query - The CSS selector for which the Carouzels need to be animated
             * @param target - Either the direction `previous` or `next`, or the slide index
             *
             */
            this.goToSlide = function (query, target) {
                var cores = _this.getCores(query);
                if (cores.length > 0) {
                    for (var i = 0; i < cores.length; i++) {
                        if (_animationDirections.indexOf(target) !== -1) {
                            target === _animationDirections[0]
                                ? goToPrev(cores[i])
                                : goToNext(cores[i]);
                        }
                        else {
                            try {
                                if (!isNaN(parseInt(target))) {
                                    goToSlide(cores[i], parseInt(target) - 1);
                                }
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    }
                }
                else {
                    // throw new TypeError(_rootSelectorTypeError);
                    console.error(_rootSelectorTypeError);
                }
            };
            /**
             * Function to destroy the Carouzel plugin for provided query strings.
             *
             * @param query - The CSS selector for which the Carouzel needs to be destroyed.
             *
             */
            this.destroy = function (query) {
                var cores = _this.getCores(query);
                if (cores.length > 0) {
                    for (var i = 0; i < cores.length; i++) {
                        destroy(cores[i]);
                    }
                    if (getCoreInstancesLength() === 0) {
                        window === null || window === void 0 ? void 0 : window.removeEventListener("resize", winResizeFn, false);
                    }
                }
                else {
                    // throw new TypeError(_rootSelectorTypeError);
                    console.error(_rootSelectorTypeError);
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
if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = Carouzel;
}
//# sourceMappingURL=carouzel.js.map