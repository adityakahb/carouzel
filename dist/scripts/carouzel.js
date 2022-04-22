"use strict";
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
    var allLocalInstances = {};
    var documentHiddenTime = 0;
    var extraSlideCount;
    var hashSlide;
    var iloop = 0;
    var isDocumentHidden = false;
    var isWindowEventAttached = false;
    var jloop = 0;
    var newCi;
    var newPi;
    var transformBuffer;
    var transformVal;
    var windowResizeAny;
    /*
     * Easing Functions - inspired from http://gizma.com/easing/
     * only considering the t value for the range [0, 1] => [0, 1]
     */
    var cEasingFunctions = {
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
        }
        // elastic bounce effect at the beginning
        // easeInElastic: (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
        // elastic bounce effect at the end
        // easeOutElastic: (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t),
        // elastic bounce effect at the beginning and end
        // easeInOutElastic: (t: number) =>
        //   (t -= 0.5) < 0
        //     ? (0.02 + 0.01 / t) * Math.sin(50 * t)
        //     : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
    };
    var cAnimationDirections = ["previous", "next"];
    var cAnimationEffects = ["scroll", "slide", "fade"];
    var cRootSelectorTypeError = "Element(s) with the provided query do(es) not exist";
    var cOptionsParseTypeError = "Unable to parse the options string";
    var cDuplicateBreakpointsTypeError = "Duplicate breakpoints found";
    var cBreakpointsParseTypeError = "Error parsing breakpoints";
    var cNoEffectFoundError = "Animation effect function not found in presets. Try using one from (".concat(cAnimationEffects.join(", "), "). Setting the animation effect to ").concat(cAnimationEffects[0], ".");
    var cNoEasingFoundError = "Easing function not found in presets. Try using one from [".concat(Object.keys(cEasingFunctions).join(", "), "]. Setting the easing function to ").concat(Object.keys(cEasingFunctions)[0], ".");
    var cUseCapture = false;
    var cSelectors = {
        arrowN: "[data-carouzel-nextarrow]",
        arrowP: "[data-carouzel-previousarrow]",
        cntr: "[data-carouzel-centered]",
        ctrlW: "[data-carouzel-ctrlWrapper]",
        curp: "[data-carouzel-currentpage]",
        dot: "[data-carouzel-dot]",
        nav: "[data-carouzel-navigation]",
        navW: "[data-carouzel-navigationwrapper]",
        pauseBtn: "[data-carouzel-pause]",
        playBtn: "[data-carouzel-play]",
        root: "[data-carouzel]",
        rootAuto: "[data-carouzel-auto]",
        rtl: "[data-carouzel-rtl]",
        scbar: "[data-carouzel-hasscrollbar]",
        scbarB: "[data-carouzel-scrollbarthumb]",
        scbarT: "[data-carouzel-scrollbartrack]",
        scbarW: "[data-carouzel-scrollbarwrapper]",
        slide: "[data-carouzel-slide]",
        stitle: "[data-carouzel-title]",
        totp: "[data-carouzel-totalpages]",
        trk: "[data-carouzel-track]",
        trkM: "[data-carouzel-trackMask]",
        trkO: "[data-carouzel-trackOuter]",
        trkW: "[data-carouzel-trackWrapper]",
        ver: "[data-carouzel-vertical]"
    };
    var cDefaults = {
        activeClass: "__carouzel-active",
        animationEffect: cAnimationEffects[0],
        animationSpeed: 1000,
        appendUrlHash: false,
        autoplay: false,
        autoplaySpeed: 2000,
        breakpoints: [],
        centerBetween: 0,
        disabledClass: "__carouzel-disabled",
        dotIndexClass: "__carouzel-pageindex",
        dotTitleClass: "__carouzel-pagetitle",
        duplicateClass: "__carouzel-duplicate",
        easingFunction: "linear",
        editModeClass: "__carouzel-editmode",
        enableKeyboard: true,
        // enableScrollbar: false,
        enableTouchSwipe: true,
        hiddenClass: "__carouzel-hidden",
        idPrefix: "__carouzel",
        isInfinite: true,
        isRtl: false,
        isVertical: false,
        nextDirectionClass: "__carouzel-next",
        pauseOnHover: false,
        previousDirectionClass: "__carouzel-previous",
        showArrows: true,
        showNavigation: true,
        slideGutter: 0,
        slidesToScroll: 1,
        slidesToShow: 1,
        startAtIndex: 1,
        syncWith: "",
        touchThreshold: 125,
        trackUrlHash: false,
        useTitlesAsDots: false,
        verticalHeight: 480
    };
    /**
     * Function to return the now() value based on the available global `performance` object
     *
     * @returns The now() value.
     *
     */
    var getNow = function () {
        return performance ? performance.now() : Date.now();
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
        if (typeof (element === null || element === void 0 ? void 0 : element.className) === "string") {
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
        if (typeof (element === null || element === void 0 ? void 0 : element.className) === "string") {
            var clsarr = cls.split(" ");
            var clsarrLength = clsarr.length;
            for (iloop = 0; iloop < clsarrLength; iloop++) {
                var thiscls = clsarr[iloop];
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
        if (typeof (element === null || element === void 0 ? void 0 : element.className) === "string") {
            var clsarr = cls.split(" ");
            var curclass = element.className.split(" ");
            var curclassLen = curclass.length;
            for (iloop = 0; iloop < curclassLen; iloop++) {
                var thiscls = curclass[iloop];
                if (clsarr.indexOf(thiscls) > -1) {
                    curclass.splice(iloop, 1);
                    iloop--;
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
        return parseFloat(num.toFixed(4));
    };
    /**
     * Function to track the document visibility
     *
     */
    var documentVisibilityFn = function () {
        if (document === null || document === void 0 ? void 0 : document.hidden) {
            isDocumentHidden = true;
            documentHiddenTime = getNow();
        }
        else {
            isDocumentHidden = false;
            documentHiddenTime = (getNow() - documentHiddenTime) / 1000;
        }
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
                    applyLayout(allLocalInstances[e]);
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
        var j = core.eH.length;
        while (j--) {
            if (core.eH[j].element.isEqualNode &&
                core.eH[j].element.isEqualNode(element)) {
                core.eH[j].remove();
                core.eH.splice(j, 1);
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
        var eventHandlerObj = {
            element: element,
            remove: function () {
                element.removeEventListener(type, listener, cUseCapture);
            }
        };
        element.addEventListener(type, listener, cUseCapture);
        return eventHandlerObj;
    };
    /**
     * Function to take care of active slides before and after animation
     *
     * @param core - Carouzel instance core object
     *
     */
    var manageActiveSlides = function (core) {
        var x = null;
        for (var i = 0; i < core.aLen; i++) {
            if (core._as[i]) {
                removeClass(core._as[i], core.o.activeCls);
                core._as[i].setAttribute("aria-hidden", "true");
            }
        }
        for (var i = core.ci + core.bpo.pDups.length; i < core.ci + core.bpo.pDups.length + core.bpo._2Show; i++) {
            if (core.o.rtl) {
                x = core.ci + core.bpo.pDups.length + core.bpo._2Show - i - 1;
                if (core._as[x]) {
                    addClass(core._as[x], core.o.activeCls);
                    core._as[x].removeAttribute("aria-hidden");
                }
                x = null;
            }
            else {
                x = null;
                if (core._as[i]) {
                    addClass(core._as[i], core.o.activeCls);
                    core._as[i].removeAttribute("aria-hidden");
                }
            }
        }
    };
    /**
     * Function to update CSS classes on all respective elements
     *
     * @param core - Carouzel instance core object
     *
     */
    var updateAttributes = function (core) {
        var x;
        if (core.arrowP) {
            if (!core.o.inf && core.ci === 0) {
                addClass(core.arrowP, core.o.disableCls || "");
                core.arrowP.setAttribute("disabled", "disabled");
            }
            else {
                removeClass(core.arrowP, core.o.disableCls || "");
                core.arrowP.removeAttribute("disabled");
            }
        }
        if (core.arrowN) {
            if (!core.o.inf && core.ci === core.sLen - core.bpo._2Show) {
                addClass(core.arrowN, core.o.disableCls || "");
                core.arrowN.setAttribute("disabled", "disabled");
            }
            else {
                removeClass(core.arrowN, core.o.disableCls || "");
                core.arrowN.removeAttribute("disabled");
            }
        }
        if (core.bpo.dots.length > 0) {
            for (var i = 0; i < core.bpo.dots.length; i++) {
                removeClass(core.bpo.dots[i], core.o.activeCls);
            }
            x = Math.floor(core.ci / core.bpo._2Scroll);
            if (core.o.rtl) {
                x = core.bpo.dots.length - x - 1;
            }
            if (x < 0) {
                x = core.bpo.dots.length - 1;
            }
            if (x >= core.bpo.dots.length) {
                x = 0;
            }
            if (core.curp) {
                core.curp.innerHTML = "".concat(x + 1);
            }
            if (core.bpo.dots[x]) {
                addClass(core.bpo.dots[x], core.o.activeCls);
            }
        }
    };
    var proceedWithAnimation = {
        /**
         * Local function to perform post operations after slide animation
         *
         */
        _post: function (core) {
            if (core.ci >= core.sLen) {
                core.ci = core.sLen - core.ci;
            }
            if (core.ci < 0) {
                core.ci = core.sLen + core.ci;
            }
            if (core.trk) {
                core.trk.style.transform = core.o.ver
                    ? "translate3d(0, ".concat(-core.pts[core.ci], "px, 0)")
                    : "translate3d(".concat(-core.pts[core.ci], "px, 0, 0)");
            }
            core.ct = -core._t.nX;
            // updateAttributes(core);
            manageActiveSlides(core);
            if (core.o._urlH && core.root) {
                hashSlide = core.root.querySelector(".".concat(core.o.activeCls));
                if (hashSlide && (window === null || window === void 0 ? void 0 : window.location)) {
                    window.location.hash = hashSlide.getAttribute("id") || "";
                }
                hashSlide = null;
            }
            if (typeof core.o.aFn === "function") {
                core.o.aFn();
            }
            removeClass(core.root, "".concat(core.o.nDirCls, " ").concat(core.o.pDirCls));
        },
        /**
         * Local function to perform scroll animation
         *
         */
        scroll: function (core, touchedPixel) {
            var scrollThisTrack = function (now) {
                core._t.elapsed = now - core._t.start;
                core._t.progress = cEasingFunctions[core.o.easeFn](core._t.elapsed / core._t.total);
                if (core.ci > core.pi) {
                    core._t.position =
                        core._t.pX +
                            (touchedPixel ? touchedPixel : 0) +
                            core._t.progress * (core._t.nX - core._t.pX);
                    if (core._t.position > core._t.nX) {
                        core._t.position = core._t.nX;
                    }
                }
                if (core.ci < core.pi) {
                    core._t.position =
                        core._t.pX +
                            (touchedPixel ? touchedPixel : 0) -
                            core._t.progress * (core._t.pX - core._t.nX);
                    if (core._t.position < core.pts[core.ci]) {
                        core._t.position = core.pts[core.ci];
                    }
                }
                if (core._t.position && core.trk) {
                    core._t.position = Math.round(core._t.position);
                    core.trk.style.transform = core.o.ver
                        ? "translate3d(0, ".concat(-core._t.position, "px, 0)")
                        : "translate3d(".concat(-core._t.position, "px, 0, 0)");
                }
                if (core._t.progress < 1 && core._t.position !== core.pts[core.ci]) {
                    core._t.id = requestAnimationFrame(scrollThisTrack);
                }
                else {
                    proceedWithAnimation._post(core);
                }
            };
            if (core._t.start && core._t.total && core.ci !== core.pi) {
                core._t.id = requestAnimationFrame(scrollThisTrack);
            }
        },
        /**
         * Local function to perform slide animation
         *
         */
        slide: function (core, touchedPixel) {
            var slideThisTrack = function (now) {
                core._t.elapsed = now - core._t.start;
                core._t.progress = cEasingFunctions[core.o.easeFn](core._t.elapsed / core._t.total);
                if (core.ci > core.pi) {
                    core._t.position =
                        core._t.pX +
                            (touchedPixel ? touchedPixel : 0) +
                            core._t.progress * (core._t.nX - core._t.pX);
                    if (core._t.position > core._t.nX) {
                        core._t.position = core._t.nX;
                    }
                }
                if (core.ci < core.pi) {
                    core._t.position =
                        core._t.pX +
                            (touchedPixel ? touchedPixel : 0) -
                            core._t.progress * (core._t.pX - core._t.nX);
                    if (core._t.position < core.pts[core.ci]) {
                        core._t.position = core.pts[core.ci];
                    }
                }
                if (core._t.position && core.trk && extraSlideCount !== null) {
                    core._t.position = Math.round(core._t.position);
                    transformBuffer = core._t.position - core.pts[core.pi];
                    for (var i = -core.bpo.pDups.length; i < core.aLen; i++) {
                        if (i >= core.pi &&
                            i < core.pi + core.bpo._2Show &&
                            core._as[i + extraSlideCount]) {
                            core._as[i + extraSlideCount].style.transform =
                                core.o.ver
                                    ? "translate3d(0, ".concat(transformBuffer, "px, 3px)")
                                    : "translate3d(".concat(transformBuffer, "px, 0, 3px)");
                        }
                    }
                    core.trk.style.transform = core.o.ver
                        ? "translate3d(0, ".concat(-core._t.position, "px, 0)")
                        : "translate3d(".concat(-core._t.position, "px, 0, 0)");
                }
                if (core._t.progress < 1 && core._t.position !== core.pts[core.ci]) {
                    core._t.id = requestAnimationFrame(slideThisTrack);
                }
                else {
                    proceedWithAnimation._post(core);
                    for (var i = 0; i < core.aLen; i++) {
                        core._as[i].style.transform = "translate3d(0, 0, 0)";
                    }
                }
            };
            if (core.trk) {
                extraSlideCount = transformVal = newCi = newPi = transformBuffer = null;
                for (var i = 0; i < core.aLen; i++) {
                    core._as[i].style.transform = core.o.ver
                        ? "translate3d(0, 0, 5px)"
                        : "translate3d(0, 0, 5px)";
                }
                extraSlideCount = core.o.inf ? core.bpo._2Show : 0;
                transformVal =
                    core.ci > core.pi
                        ? Math.abs(core.ci - core.pi - extraSlideCount)
                        : Math.abs(core.pi - core.ci - extraSlideCount);
                transformVal =
                    core.ci > core.pi ? -core.pts[transformVal] : core.pts[transformVal];
                for (var i = 0; i < core.aLen; i++) {
                    if (i >= core.pi &&
                        i < core.pi + core.bpo._2Show &&
                        core._as[i + extraSlideCount]) {
                        core._as[i + extraSlideCount].style.transform =
                            core.o.ver ? "translate3d(0, 0, 3px)" : "translate3d(0, 0, 3px)";
                    }
                }
                if (core._t.start && core._t.total && core.ci !== core.pi) {
                    core._t.id = requestAnimationFrame(slideThisTrack);
                }
            }
        },
        /**
         * Local function to perform fade animation
         *
         */
        fade: function (core) {
            var fadeThisTrack = function (now) {
                core._t.elapsed = now - core._t.start;
                core._t.progress = cEasingFunctions[core.o.easeFn](core._t.elapsed / core._t.total);
                core._t.progress = core._t.progress > 1 ? 1 : core._t.progress;
                for (var i = 0; i < core.aLen; i++) {
                    if (extraSlideCount !== null &&
                        newPi !== null &&
                        i >= newPi &&
                        i < newPi + core.bpo._2Show) {
                        core._as[i + extraSlideCount].style.opacity =
                            "" + (1 - core._t.progress);
                    }
                    if (extraSlideCount !== null &&
                        newCi !== null &&
                        i >= newCi &&
                        i < newCi + core.bpo._2Show) {
                        core._as[i + extraSlideCount].style.opacity =
                            "" + core._t.progress;
                    }
                }
                if (core._t.progress < 1) {
                    core._t.id = requestAnimationFrame(fadeThisTrack);
                }
                else {
                    proceedWithAnimation._post(core);
                    if (newPi !== null && extraSlideCount !== null) {
                        for (var i = 0; i < core.aLen; i++) {
                            core._as[i].style.opacity = "1";
                        }
                        for (var i = 0; i < core.aLen; i++) {
                            if (i >= newPi &&
                                i < newPi + core.bpo._2Show &&
                                core._as[i + extraSlideCount]) {
                                core._as[i + extraSlideCount].style.transform = "translate3d(0, 0, 0)";
                                core._as[i + extraSlideCount].style.visibility = "hidden";
                            }
                        }
                    }
                }
            };
            if (core.trk) {
                extraSlideCount = transformVal = newCi = newPi = null;
                core.trk.style.transform = core.o.ver
                    ? "translate3d(0, ".concat(-core._t.nX, "px, 0)")
                    : "translate3d(".concat(-core._t.nX, "px, 0, 0)");
                newCi = core.ci < 0 ? core.sLen + core.ci : core.ci;
                newPi = core.pi < 0 ? core.sLen + core.pi : core.pi;
                extraSlideCount = core.o.inf ? core.bpo._2Show : 0;
                transformVal =
                    newCi > newPi
                        ? Math.abs(newCi - newPi - extraSlideCount)
                        : Math.abs(newPi - newCi - extraSlideCount);
                transformVal =
                    newCi > newPi ? core.pts[transformVal] : -core.pts[transformVal];
                for (var i = 0; i < core.aLen; i++) {
                    core._as[i].style.opacity = "0";
                    core._as[i].style.transform = "translate3d(0, 0, 0)";
                }
                for (var i = 0; i < core.aLen; i++) {
                    if (i >= newPi &&
                        i < newPi + core.bpo._2Show &&
                        core._as[i + extraSlideCount]) {
                        core._as[i + extraSlideCount].style.transform =
                            core.o.ver
                                ? "translate3d(0, ".concat(transformVal - core.bpo.gutr, "px, 0)")
                                : "translate3d(".concat(transformVal - core.bpo.gutr, "px, 0, 0)");
                        core._as[i + extraSlideCount].style.visibility = "visible";
                        core._as[i + extraSlideCount].style.opacity = "1";
                    }
                    if (i >= newCi &&
                        i < newCi + core.bpo._2Show &&
                        core._as[i + extraSlideCount]) {
                        core._as[i + extraSlideCount].style.visibility = "visible";
                    }
                }
                if (core._t.start && core._t.total && core.ci !== core.pi) {
                    core._t.id = requestAnimationFrame(fadeThisTrack);
                }
            }
        }
    };
    /**
     * Function to animate the track element based on the calculations
     *
     * @param core - Carouzel instance core object
     * @param touchedPixel - Amount of pixels travelled using touch/cursor drag
     *
     */
    var animateTrack = function (core, touchedPixel) {
        if (typeof core.o.bFn === "function" && !core.fLoad) {
            core.o.bFn();
        }
        addClass(core.root, core.ci > core.pi ? core.o.nDirCls : core.o.pDirCls);
        if (core.sync && allLocalInstances[core.sync]) {
            if (core.ci < 0) {
                go2Slide(allLocalInstances[core.sync], core.sLen - core.bpo._2Scroll - 1);
            }
            else if (core.ci >= core.sLen) {
                go2Slide(allLocalInstances[core.sync], 0);
            }
            else {
                go2Slide(allLocalInstances[core.sync], core.ci);
            }
        }
        if (typeof core.pi === "undefined") {
            core.pi = core.o.inf ? -core.bpo._2Show : 0;
        }
        if (!core.o.inf) {
            if (core.ci < 0) {
                core.ci = 0;
            }
            if (core.ci + core.bpo._2Show >= core.sLen) {
                core.ci = core.sLen - core.bpo._2Show;
            }
        }
        if (core.trk && core.fLoad) {
            core.trk.style.transform = core.o.ver
                ? "translate3d(0, ".concat(-core.pts[core.ci], "px, 0)")
                : "translate3d(".concat(-core.pts[core.ci], "px, 0, 0)");
        }
        manageActiveSlides(core);
        updateAttributes(core);
        core._t.start = getNow();
        core._t.pX = core.pts[core.pi];
        core._t.nX = core.pts[core.ci];
        if (core.o.effect === cAnimationEffects[0] && core.trk && !core.fLoad) {
            proceedWithAnimation.scroll(core, touchedPixel);
        }
        if (core.o.effect === cAnimationEffects[1] && core.trk && !core.fLoad) {
            proceedWithAnimation.slide(core, touchedPixel);
        }
        if (core.o.effect === cAnimationEffects[2] && core.ci < 0) {
            core._t.nX = core.pts[core.sLen + core.ci];
        }
        if (core.o.effect === cAnimationEffects[2] && core.trk && !core.fLoad) {
            proceedWithAnimation.fade(core);
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
        var first = parent.querySelectorAll(cSelectors.slide)[0];
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
    var applyLayout = function (core) {
        var viewportWidth = window === null || window === void 0 ? void 0 : window.innerWidth;
        var bpoptions = core.bpall[0];
        var len = 0;
        var slideWidth = 0;
        var trkWidth = 0;
        var temp = 0;
        var as;
        while (len < core.bpall.length) {
            if ((core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) ||
                typeof core.bpall[len + 1] === "undefined") {
                bpoptions = core.bpall[len];
                break;
            }
            len++;
        }
        if (core.root &&
            !hasClass(core.root, core.o.editCls) &&
            (core.bpoOld || {})._2Show !== bpoptions._2Show &&
            core.trk) {
            manageDuplicates(core.trk, bpoptions, core.o.dupCls || "");
        }
        if ((core.bpoOld || {}).bp !== bpoptions.bp) {
            core.bpo = bpoptions;
            core.bpoOld = bpoptions;
        }
        if (core.nav) {
            var dots = core.nav.querySelectorAll(cSelectors.dot);
            for (var i = 0; i < dots.length; i++) {
                core.nav.removeChild(dots[i]);
            }
            for (var i = 0; i < bpoptions.dots.length; i++) {
                core.nav.appendChild(bpoptions.dots[i]);
            }
        }
        if (!bpoptions._arrows && core.ctrlW) {
            addClass(core.ctrlW, core.o.hidCls);
        }
        else if (core.ctrlW) {
            removeClass(core.ctrlW, core.o.hidCls);
        }
        if (!bpoptions._nav && core.navW) {
            addClass(core.navW, core.o.hidCls);
        }
        else if (core.navW) {
            removeClass(core.navW, core.o.hidCls);
        }
        if (core.fLoad && core.o.rtl) {
            core.ci = core.o.startAt = core.sLen - bpoptions._2Scroll;
        }
        if (core.root && core.trkW && core.trkO && core.trk) {
            core.pts = {};
            if (core.o.ver) {
                slideWidth =
                    (bpoptions.verH - (-bpoptions._2Show - 1) * bpoptions.gutr) /
                        (bpoptions._2Show + bpoptions.cntr);
            }
            else {
                slideWidth =
                    (core.trkW.clientWidth - (bpoptions._2Show - 1) * bpoptions.gutr) /
                        (bpoptions._2Show + bpoptions.cntr);
            }
            core.sWid = slideWidth;
            temp =
                core.sLen >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show;
            as = core.trkO.querySelectorAll(cSelectors.slide);
            core._as = [];
            for (var i = 0; i < as.length; i++) {
                core._as.push(as[i]);
            }
            core.aLen = core._as.length;
            trkWidth = slideWidth * temp + bpoptions.gutr * (temp + 1);
            if (core.o.ver) {
                core.trk.style.height = toFixed4(trkWidth) + "px";
                core.trkO.style.height =
                    toFixed4(bpoptions._2Show * slideWidth +
                        bpoptions.gutr * (bpoptions._2Show - 1)) + "px";
            }
            else {
                core.trk.style.width = toFixed4(trkWidth) + "px";
                core.trkO.style.width =
                    toFixed4(bpoptions._2Show * slideWidth +
                        bpoptions.gutr * (bpoptions._2Show - 1)) + "px";
            }
            for (var i = 0; i < core.aLen; i++) {
                if (core.o.ver) {
                    core._as[i].style.height =
                        toFixed4(slideWidth) + "px";
                    if (i === 0) {
                        core._as[i].style.marginTop =
                            toFixed4(bpoptions.gutr) + "px";
                        core._as[i].style.marginBottom =
                            toFixed4(bpoptions.gutr / 2) + "px";
                    }
                    else if (i === core.aLen - 1) {
                        core._as[i].style.marginTop =
                            toFixed4(bpoptions.gutr / 2) + "px";
                        core._as[i].style.marginBottom =
                            toFixed4(bpoptions.gutr) + "px";
                    }
                    else {
                        core._as[i].style.marginTop =
                            toFixed4(bpoptions.gutr / 2) + "px";
                        core._as[i].style.marginBottom =
                            toFixed4(bpoptions.gutr / 2) + "px";
                    }
                }
                else {
                    core._as[i].style.width =
                        toFixed4(slideWidth) + "px";
                    if (i === 0) {
                        core._as[i].style.marginLeft =
                            toFixed4(bpoptions.gutr) + "px";
                        core._as[i].style.marginRight =
                            toFixed4(bpoptions.gutr / 2) + "px";
                    }
                    else if (i === core.aLen - 1) {
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
            }
            for (var i = bpoptions.pDups.length; i > 0; i--) {
                core.pts[-i] = toFixed4((-i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                    bpoptions.gutr);
            }
            for (var i = 0; i < core.sLen; i++) {
                core.pts[i] = toFixed4((i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                    bpoptions.gutr);
            }
            for (var i = core.sLen; i < core.sLen + bpoptions.nDups.length; i++) {
                core.pts[i] = toFixed4((i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                    bpoptions.gutr);
            }
            if (core.totp) {
                core.totp.innerHTML = "".concat(bpoptions.dots.length);
            }
        }
        animateTrack(core, 0);
        // TODO: Scrollbar implementation
        // if (core.o.scbar && core.scbarB && core.scbarT && core.trkO && core.trk) {
        //   transformVal =
        //     (core.trkO.clientWidth / core.trk.clientWidth) * core.trkO.clientWidth;
        //   core.scbarT.style.width = core.trkO.clientWidth - transformVal + `px`;
        //   core.scbarT.style.marginRight = transformVal + `px`;
        //   core.scbarB.style.width = transformVal + `px`;
        //   transformVal = null;
        // } else {
        //   animateTrack(core, 0);
        // }
    };
    /**
     * Function to go to the specific slide number
     *
     * @param core - Carouzel instance core object
     * @param slidenumber - Slide index to which the carouzel should be scrolled to
     *
     */
    var go2Slide = function (core, slidenumber) {
        if (core.ci !== slidenumber * core.bpo._2Scroll) {
            if (slidenumber >= core.sLen) {
                slidenumber = core.sLen - 1;
            }
            else if (slidenumber <= -1) {
                slidenumber = 0;
            }
            core.pi = core.ci;
            core.ci = slidenumber * core.bpo._2Scroll;
            if (core._t.id) {
                cancelAnimationFrame(core._t.id);
            }
            if (core.fLoad) {
                core.fLoad = false;
            }
            animateTrack(core, 0);
        }
    };
    /**
     * Function to go to the previous set of slides
     *
     * @param core - Carouzel instance core object
     * @param touchedPixel - The amount of pixels moved using touch/cursor drag
     *
     */
    var go2Prev = function (core, touchedPixel) {
        core.pi = core.ci;
        core.ci -= core.bpo._2Scroll;
        if (core._t.id) {
            cancelAnimationFrame(core._t.id);
        }
        if (core.o.inf) {
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
        if (core.fLoad) {
            core.fLoad = false;
        }
        animateTrack(core, touchedPixel);
    };
    /**
     * Function to go to the next set of slides
     *
     * @param core - Carouzel instance core object
     * @param touchedPixel - The amount of pixels moved using touch/cursor drag
     *
     */
    var go2Next = function (core, touchedPixel) {
        console.log('==============before core.ci', core.ci);
        console.log('==============before core.pi', core.pi);
        core.pi = core.ci;
        core.ci += core.bpo._2Scroll;
        console.log('==============then core.ci', core.ci);
        console.log('==============then core.pi', core.pi);
        if (core._t.id) {
            cancelAnimationFrame(core._t.id);
        }
        if (core.o.inf) {
            console.log('---------core.ci + core.bpo._2Show', core.ci + core.bpo._2Show > core.sLen);
            if (typeof core.pts[core.ci + core.bpo._2Show] === "undefined") {
                core.pi = core.pi - core.sLen;
                core.ci = 0;
            }
            else {
                core.pi = core.ci - core.bpo._2Scroll;
            }
        }
        if (core.fLoad) {
            core.fLoad = false;
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
        if (core.root && core.o.kb) {
            core.root.setAttribute("tabindex", "-1");
            var keyCode_1 = "";
            core.eH.push(eventHandler(core.root, "keydown", function (event) {
                keyCode_1 = event.key.toLowerCase();
                switch (keyCode_1) {
                    case "arrowleft":
                        go2Prev(core, 0);
                        break;
                    case "arrowright":
                        go2Next(core, 0);
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
    var togglePlayPauseButtons = function (core, shouldPlay) {
        if (core && core.bPause && core.bPlay) {
            if (shouldPlay) {
                addClass(core.bPlay, core.o.hidCls);
                removeClass(core.bPause, core.o.hidCls);
            }
            else {
                addClass(core.bPause, core.o.hidCls);
                removeClass(core.bPlay, core.o.hidCls);
            }
        }
    };
    /**
     * Function to enable pause on hover when autoplay is enabled
     *
     * @param core - Carouzel instance core object
     *
     */
    var togglePauseOnHover = function (core) {
        if (core.root && core.o.pauseHov) {
            core.eH.push(eventHandler(core.root, "mouseenter", function () {
                core.paused = true;
                togglePlayPauseButtons(core, false);
                if (core._t.aId) {
                    cancelAnimationFrame(core._t.aId);
                }
            }));
            core.eH.push(eventHandler(core.root, "mouseleave", function () {
                core.paused = false;
                togglePlayPauseButtons(core, true);
                initializeAutoplay(core);
            }));
        }
        if (!core.o.pauseHov) {
            core.paused = false;
        }
        core._t.aTotal = core.o.autoS;
    };
    /**
     * Function to initialize Autoplay
     *
     * @param core - Carouzel instance core object
     *
     */
    var initializeAutoplay = function (core) {
        var animateAutoplay = function (now) {
            core._t.aElapsed = now - core._t.aStart;
            core._t.aProgress = core._t.aElapsed / core._t.aTotal;
            core._t.aProgress = core._t.aProgress > 1 ? 1 : core._t.aProgress;
            if (!core.paused) {
                if (core._t.aProgress >= 1 && !isDocumentHidden) {
                    core._t.aStart = getNow();
                    go2Next(core, 0);
                }
                core._t.aId = requestAnimationFrame(animateAutoplay);
            }
        };
        core._t.aTotal += core.o.speed;
        if (!core.paused) {
            core._t.aStart = getNow();
            core._t.aId = requestAnimationFrame(animateAutoplay);
        }
    };
    /**
     * Function to add click events to the arrows
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleControlButtons = function (core) {
        if (core.arrowP) {
            core.eH.push(eventHandler(core.arrowP, "click", function (event) {
                event.preventDefault();
                go2Prev(core, 0);
            }));
        }
        if (core.arrowN) {
            core.eH.push(eventHandler(core.arrowN, "click", function (event) {
                event.preventDefault();
                go2Next(core, 0);
            }));
        }
        if (core.o.inf && core.bPause) {
            core.eH.push(eventHandler(core.bPause, "click", function (event) {
                event.preventDefault();
                core.pauseClk = true;
                togglePlayPauseButtons(core, false);
            }));
        }
        if (core.o.inf && core.bPlay) {
            core.eH.push(eventHandler(core.bPlay, "click", function (event) {
                event.preventDefault();
                core.pauseClk = false;
                togglePlayPauseButtons(core, true);
            }));
        }
    };
    /**
     * Function to add touch events to the track
     *
     * @param core - Carouzel instance core object
     * @param el - Determines if the touch events need to be added to the carousel track or the scrollbar thumb
     *
     */
    var toggleTouchEvents = function (core, el) {
        var diffX = 0;
        var diffY = 0;
        var dragging = false;
        var endX = 0;
        var endY = 0;
        var posFinal = 0;
        var posX1 = 0;
        var posX2 = 0;
        var posY1 = 0;
        var posY2 = 0;
        var ratioX = 0;
        var ratioY = 0;
        var startX = 0;
        var startY = 0;
        var canFiniteAnimate = false;
        var threshold = core.o.threshold || 125;
        /**
         * Function to be triggered when the carouzel is touched the cursor is down on it
         *
         */
        var touchStartTrack = function (e) {
            dragging = true;
            if (e.type === "touchstart") {
                startX = e.changedTouches[0].screenX;
                startY = e.changedTouches[0].screenY;
                posX1 = e.changedTouches[0].screenX;
                posY1 = e.changedTouches[0].screenY;
            }
            else {
                startX = e.clientX;
                startY = e.clientY;
                posX1 = e.clientX;
                posY1 = e.clientY;
            }
        };
        /**
         * Function to be triggered when the carouzel is dragged through touch or cursor
         *
         */
        var touchMoveTrack = function (e) {
            if (dragging) {
                if (e.type === "touchmove") {
                    endX = e.changedTouches[0].screenX;
                    endY = e.changedTouches[0].screenY;
                    posX2 = posX1 - e.changedTouches[0].screenX;
                    posY2 = posY1 - e.changedTouches[0].screenY;
                }
                else {
                    endX = e.clientX;
                    endY = e.clientY;
                    posX2 = posX1 - e.clientX;
                    posY2 = posY1 - e.clientY;
                }
                diffX = endX - startX;
                diffY = endY - startY;
                ratioX = Math.abs(diffX / diffY);
                ratioY = Math.abs(diffY / diffX);
                if (!core.ct) {
                    core.ct = -core.pts[core.ci];
                }
                if (core.trk &&
                    (core.o.effect === cAnimationEffects[0] ||
                        core.o.effect === cAnimationEffects[1])) {
                    if (ratioX > ratioY && !core.o.ver) {
                        core.trk.style.transform = "translate3d(".concat(core.ct - posX2, "px, 0, 0px)");
                        if (core.o.effect === cAnimationEffects[1]) {
                            for (var k = 0; k < core.aLen; k++) {
                                core._as[k].style.transform = "translate3d(0, 0, 5px)";
                            }
                            for (var k = core.ci; k < core.ci + core.bpo._2Show; k++) {
                                if (core._as[k + core.bpo._2Show]) {
                                    core._as[k + core.bpo._2Show].style.transform = "translate3d(".concat(posX2, "px, 0, 3px)");
                                }
                            }
                        }
                    }
                    if (ratioX < ratioY && core.o.ver) {
                        core.trk.style.transform = "translate3d(0, ".concat(core.ct - posY2, "px, 0)");
                        if (core.o.effect === cAnimationEffects[1]) {
                            for (var k = 0; k < core.aLen; k++) {
                                core._as[k].style.transform = "translate3d(0, 0, 5px)";
                            }
                            for (var k = core.ci; k < core.ci + core.bpo._2Show; k++) {
                                if (core._as[k + core.bpo._2Show]) {
                                    core._as[k + core.bpo._2Show].style.transform = "translate3d(0, ".concat(posX2, "px, 3px)");
                                }
                            }
                        }
                    }
                }
                if (core.trk && core.o.effect === cAnimationEffects[2]) {
                    for (var k = 0; k < core.aLen; k++) {
                        core._as[k].style.opacity = "1";
                    }
                }
                posFinal = core.o.ver ? posY2 : posX2;
            }
        };
        /**
         * Function to be triggered when the touch is ended or cursor is released
         *
         */
        var touchEndTrack = function (e) {
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
                    if (!core.o.inf) {
                        if ((core.o.ver ? diffY : diffX) > 0) {
                            if (Math.abs(core.ct) <= 0) {
                                core.trk.style.transform = core.o.ver
                                    ? "translate3d(0, ".concat(core.ct, "px, 0)")
                                    : "translate3d(".concat(core.ct, "px, 0, 0)");
                            }
                            else {
                                canFiniteAnimate = true;
                            }
                        }
                        else if ((core.o.ver ? diffY : diffX) < 0) {
                            if (Math.abs(core.ct) + core.sWid * core.bpo._2Show >=
                                core.sWid * core.aLen) {
                                core.trk.style.transform = core.o.ver
                                    ? "translate3d(0, ".concat(core.ct, "px, 0)")
                                    : "translate3d(".concat(core.ct, "px, 0, 0)");
                            }
                            else {
                                canFiniteAnimate = true;
                            }
                        }
                    }
                    if (core.o.effect === cAnimationEffects[2]) {
                        for (var k = 0; k < core.aLen; k++) {
                            core._as[k].style.opacity = "1";
                        }
                    }
                    if (posFinal < -threshold) {
                        if ((core.o.effect === cAnimationEffects[0] ||
                            core.o.effect === cAnimationEffects[1]) &&
                            (canFiniteAnimate || core.o.inf)) {
                            go2Prev(core, posFinal);
                        }
                        if (core.o.effect === cAnimationEffects[2] &&
                            (canFiniteAnimate || core.o.inf)) {
                            go2Prev(core, 1);
                        }
                    }
                    else if (posFinal > threshold) {
                        if ((core.o.effect === cAnimationEffects[0] ||
                            core.o.effect === cAnimationEffects[1]) &&
                            (canFiniteAnimate || core.o.inf)) {
                            go2Next(core, posFinal);
                        }
                        if (core.o.effect === cAnimationEffects[2] &&
                            (canFiniteAnimate || core.o.inf)) {
                            go2Next(core, 1);
                        }
                    }
                    else {
                        if (core.o.effect === cAnimationEffects[0] ||
                            core.o.effect === cAnimationEffects[1]) {
                            for (var k = 0; k < core.aLen; k++) {
                                core._as[k].style.transform = "translate3d(0, 0, 0)";
                            }
                            core.trk.style.transform = core.o.ver
                                ? "translate3d(0, ".concat(core.ct, "px, 0)")
                                : "translate3d(".concat(core.ct, "px, 0, 0)");
                        }
                        if (core.o.effect === cAnimationEffects[2]) {
                            for (var k = 0; k < core.aLen; k++) {
                                core._as[k].style.opacity = "1";
                            }
                        }
                    }
                }
                posX1 = posX2 = posY1 = posY2 = posFinal = 0;
                dragging = false;
            }
        };
        // TODO: Scrollbar implementation
        // const touchStartScb = (e: Event) => {
        //   dragging = true;
        //   if (e.type === `touchstart`) {
        //     startX = (e as TouchEvent).changedTouches[0].screenX;
        //     startY = (e as TouchEvent).changedTouches[0].screenY;
        //     posX1 = (e as TouchEvent).changedTouches[0].screenX;
        //     posY1 = (e as TouchEvent).changedTouches[0].screenY;
        //   } else {
        //     startX = (e as MouseEvent).clientX;
        //     startY = (e as MouseEvent).clientY;
        //     posX1 = (e as MouseEvent).clientX;
        //     posY1 = (e as MouseEvent).clientY;
        //   }
        // };
        // const touchMoveScb = (e: Event) => {
        //   if (dragging) {
        //     if (e.type === `touchmove`) {
        //       endX = (e as TouchEvent).changedTouches[0].screenX;
        //       endY = (e as TouchEvent).changedTouches[0].screenY;
        //       posX2 = posX1 - (e as TouchEvent).changedTouches[0].screenX;
        //       posY2 = posY1 - (e as TouchEvent).changedTouches[0].screenY;
        //     } else {
        //       endX = (e as MouseEvent).clientX;
        //       endY = (e as MouseEvent).clientY;
        //       posX2 = posX1 - (e as MouseEvent).clientX;
        //       posY2 = posY1 - (e as MouseEvent).clientY;
        //     }
        //     diffX = endX - startX;
        //     diffY = endY - startY;
        //     ratioX = Math.abs(diffX / diffY);
        //     ratioY = Math.abs(diffY / diffX);
        //     if (
        //       core.scbarB &&
        //       core.scbarT &&
        //       -posX2 >= 0 &&
        //       -posX2 <= core.scbarT.clientWidth
        //     ) {
        //       core.scbarB.style.transform = `translateX(${-posX2}px)`;
        //     }
        //     // if (core.trkO && core.scbarT && core.scbarB && core.trk) {
        //     //   transformVal =
        //     //     (core.trkO.scrollLeft /
        //     //       (core.trk.clientWidth - core.trkO.clientWidth)) *
        //     //     core.scbarT.clientWidth;
        //     //   core.scbarB.style.left = transformVal + `px`;
        //     //   transformVal = null;
        //     // }
        //     posFinal = core.o.ver ? posY2 : posX2;
        //   }
        // };
        // const touchEndScb = (e: Event) => {
        //   if (dragging && core.trk) {
        //     if (e.type === `touchend`) {
        //       endX = (e as TouchEvent).changedTouches[0].screenX;
        //       endY = (e as TouchEvent).changedTouches[0].screenY;
        //     } else {
        //       endX = (e as MouseEvent).clientX;
        //       endY = (e as MouseEvent).clientY;
        //     }
        //     diffX = endX - startX;
        //     diffY = endY - startY;
        //     ratioX = Math.abs(diffX / diffY);
        //     ratioY = Math.abs(diffY / diffX);
        //     if ( !isNaN(ratioX) && !isNaN(ratioY) &&
        //       ratioY !== Infinity &&
        //       ratioX !== Infinity &&
        //       ratioX !== ratioY
        //     ) {
        //       if (core.scbarB && core.scbarT) {
        //         core.scbarB.style.transform = `translateX(${-diffX}px)`;
        //       }
        //     }
        //     posX1 = posX2 = posY1 = posY2 = posFinal = 0;
        //     dragging = false;
        //   }
        // };
        // if (core.o.swipe && !core.o.scbar && el === `sl`) {
        if (core.o.swipe && el === "sl") {
            core.eH.push(eventHandler(core.trk, "touchstart", function (event) {
                touchStartTrack(event);
            }));
            core.eH.push(eventHandler(core.trk, "touchmove", function (event) {
                touchMoveTrack(event);
            }));
            core.eH.push(eventHandler(core.trk, "touchend", function (event) {
                touchEndTrack(event);
            }));
            core.eH.push(eventHandler(core.trk, "mousedown", function (event) {
                touchStartTrack(event);
            }));
            core.eH.push(eventHandler(core.trk, "mouseup", function (event) {
                touchEndTrack(event);
            }));
            core.eH.push(eventHandler(core.trk, "mouseleave", function (event) {
                touchEndTrack(event);
            }));
            core.eH.push(eventHandler(core.trk, "mousemove", function (event) {
                touchMoveTrack(event);
            }));
        }
        // TODO: Scrollbar implementation
        // if (core.o.scbar && core.scbarB && el === `sb`) {
        //   core.eH.push(
        //     eventHandler(
        //       core.scbarB as HTMLElement,
        //       `touchstart`,
        //       (event: Event) => {
        //         touchStartScb(event);
        //       }
        //     )
        //   );
        //   core.eH.push(
        //     eventHandler(
        //       core.scbarB as HTMLElement,
        //       `touchmove`,
        //       (event: Event) => {
        //         touchMoveScb(event);
        //       }
        //     )
        //   );
        //   core.eH.push(
        //     eventHandler(core.scbarB as HTMLElement, `touchend`, (event: Event) => {
        //       touchEndScb(event);
        //     })
        //   );
        //   core.eH.push(
        //     eventHandler(
        //       core.scbarB as HTMLElement,
        //       `mousedown`,
        //       (event: Event) => {
        //         touchStartScb(event);
        //       }
        //     )
        //   );
        //   core.eH.push(
        //     eventHandler(core.scbarB as HTMLElement, `mouseup`, (event: Event) => {
        //       touchEndScb(event);
        //     })
        //   );
        //   core.eH.push(
        //     eventHandler(
        //       core.scbarB as HTMLElement,
        //       `mouseleave`,
        //       (event: Event) => {
        //         touchEndScb(event);
        //       }
        //     )
        //   );
        //   core.eH.push(
        //     eventHandler(
        //       core.scbarB as HTMLElement,
        //       `mousemove`,
        //       (event: Event) => {
        //         touchMoveScb(event);
        //       }
        //     )
        //   );
        // }
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
            if (core.o.inf && core.sLen > core.bpall[i]._2Show) {
                for (var j = core.sLen -
                    core.bpall[i]._2Show -
                    Math.ceil(core.bpall[i].cntr / 2); j < core.sLen; j++) {
                    if (core._ds[j]) {
                        var elem = core._ds[j].cloneNode(true);
                        addClass(elem, core.o.dupCls || "");
                        core.bpall[i].bpSLen++;
                        core.bpall[i].pDups.push(elem);
                    }
                }
                for (var j = 0; j < core.bpall[i]._2Show + Math.ceil(core.bpall[i].cntr / 2); j++) {
                    if (core._ds[j]) {
                        var elem = core._ds[j].cloneNode(true);
                        addClass(elem, core.o.dupCls || "");
                        core.bpall[i].bpSLen++;
                        core.bpall[i].nDups.push(elem);
                    }
                }
            }
        }
        var _loop_1 = function (i) {
            var pageLength = 1;
            var totalpages = core.sLen - core.bpall[i]._2Show;
            while (totalpages > 0) {
                totalpages -= core.bpall[i]._2Scroll;
                pageLength++;
            }
            var navBtns = [];
            core.bpall[i].dots = [];
            var btnStr = "";
            var _loop_2 = function (j) {
                var liElem = document === null || document === void 0 ? void 0 : document.createElement("li");
                var btnElem = document === null || document === void 0 ? void 0 : document.createElement("button");
                liElem.setAttribute(cSelectors.dot.slice(1, -1), "");
                btnElem.setAttribute("type", "button");
                btnStr = "<div class=\"".concat(core.o.dotNcls, "\">").concat(j + 1, "</div>");
                if (core.o.useTitle &&
                    core.bpall[i]._2Show === 1 &&
                    core._ds[j].getAttribute(cSelectors.stitle.slice(1, -1))) {
                    btnStr += core._ds[j].getAttribute(cSelectors.stitle.slice(1, -1));
                    addClass(liElem, core.o.dotCls);
                }
                btnElem.innerHTML = btnStr;
                liElem.appendChild(btnElem);
                navBtns.push(liElem);
                core.eH.push(eventHandler(btnElem, "click", function (event) {
                    event.preventDefault();
                    if (core.o.rtl) {
                        go2Slide(core, pageLength - j - 1);
                    }
                    else {
                        go2Slide(core, j);
                    }
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
     * Function to remove ghost dragging from images
     *
     * @param core - Carouzel instance core object
     *
     */
    // TODO: FUTURE SCROLLBAR IMPLEMENTATION
    // const generateScrollbar = (core: ICore) => {
    //   if (core.o.scbar && core.root) {
    //     core.scbarW = core.root.querySelector(`${cSelectors.scbarW}`);
    //     core.scbarT = core.root.querySelector(`${cSelectors.scbarT}`);
    //     core.scbarB = core.root.querySelector(`${cSelectors.scbarB}`);
    //     core.root.setAttribute(cSelectors.scbar.slice(1, -1), `true`);
    //   }
    //   const logTrackScroll = () => {
    //     if (core.trkO && core.scbarT && core.scbarB && core.trk) {
    //       transformVal =
    //         (core.trkO.scrollLeft /
    //           (core.trk.clientWidth - core.trkO.clientWidth)) *
    //         core.scbarT.clientWidth;
    //       core.scbarB.style.transform = `translateX(${transformVal}px)`;
    //       transformVal = null;
    //     }
    //   };
    //   if (core.trkO) {
    //     core.eH.push(
    //       eventHandler(core.trkO as HTMLElement, `scroll`, () => {
    //         logTrackScroll();
    //       })
    //     );
    //   }
    //   if (core.scbarB) {
    //     toggleTouchEvents(core, `sb`);
    //   }
    // };
    /**
     * Function to remove ghost dragging from images
     *
     * @param core - Carouzel instance core object
     *
     */
    var makeStuffUndraggable = function (core) {
        if (core.root) {
            var images = core.root.querySelectorAll("img");
            for (var img = 0; img < images.length; img++) {
                core.eH.push(eventHandler(images[img], "dragstart", function (event) {
                    event.preventDefault();
                }));
            }
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
                // throw new TypeError(cDuplicateBreakpointsTypeError);
                console.error(cDuplicateBreakpointsTypeError);
                return {};
            }
        }
        catch (e) {
            // throw new TypeError(cBreakpointsParseTypeError);
            console.error(cBreakpointsParseTypeError);
            return {};
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
            nav: null,
            nDups: [],
            pDups: [],
            swipe: settings.swipe,
            verH: settings.verH,
            verP: 1
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
                if (typeof bp2.verH === "undefined") {
                    bp2.verH = bp1.verH;
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
            // _2Scroll: settings.enableScrollbar ? 1 : settings.slidesToScroll,
            _2Scroll: settings.slidesToScroll,
            _2Show: settings.slidesToShow,
            _arrows: settings.showArrows,
            _nav: settings.showNavigation,
            _urlH: settings.appendUrlHash,
            activeCls: settings.activeClass,
            aFn: settings.afterScrollFn,
            auto: settings.autoplay,
            autoS: settings.autoplaySpeed,
            bFn: settings.beforeScrollFn,
            cntr: settings.centerBetween,
            disableCls: settings.disabledClass,
            dotCls: settings.dotTitleClass,
            dotNcls: settings.dotIndexClass,
            dupCls: settings.duplicateClass,
            editCls: settings.editModeClass,
            gutr: settings.slideGutter,
            hidCls: settings.hiddenClass,
            // inf: settings.enableScrollbar ? false : settings.isInfinite,
            inf: settings.isInfinite,
            kb: settings.enableKeyboard,
            nDirCls: settings.nextDirectionClass,
            pauseHov: settings.pauseOnHover,
            pDirCls: settings.previousDirectionClass,
            res: [],
            rtl: settings.isRtl,
            // scbar: settings.enableScrollbar,
            speed: settings.animationSpeed,
            startAt: settings.animationSpeed,
            swipe: settings.enableTouchSwipe,
            threshold: settings.touchThreshold,
            useTitle: settings.useTitlesAsDots,
            ver: settings.isVertical,
            verH: settings.verticalHeight,
            verP: 1,
            effect: (function () {
                if (cAnimationEffects.indexOf(settings.animationEffect) > -1) {
                    return settings.animationEffect;
                }
                console.warn(cNoEffectFoundError);
                return cAnimationEffects[0];
            })(),
            easeFn: (function () {
                if (cEasingFunctions[settings.easingFunction]) {
                    return settings.easingFunction;
                }
                console.warn(cNoEasingFoundError);
                return Object.keys(cEasingFunctions)[0];
            })()
        };
        if (settings.breakpoints && settings.breakpoints.length > 0) {
            for (var i = 0; i < settings.breakpoints.length; i++) {
                var obj = {
                    // _2Scroll: settings.enableScrollbar
                    //   ? 1
                    //   : settings.breakpoints[i].slidesToScroll,
                    _2Scroll: settings.breakpoints[i].slidesToScroll,
                    _2Show: settings.breakpoints[i].slidesToShow,
                    _arrows: settings.breakpoints[i].showArrows,
                    _nav: settings.breakpoints[i].showNavigation,
                    bp: settings.breakpoints[i].minWidth,
                    bpSLen: 0,
                    cntr: settings.breakpoints[i].centerBetween,
                    dots: [],
                    gutr: settings.breakpoints[i].slideGutter,
                    nav: null,
                    nDups: [],
                    pDups: [],
                    swipe: settings.breakpoints[i].enableTouchSwipe,
                    verH: settings.breakpoints[i].verticalHeight,
                    verP: 1
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
     * @param root - The root element which needs to be initialized as Carouzel slider
     * @param settings - The options applicable to the same Carouzel slider
     *
     */
    var init = function (root, settings) {
        var _a;
        if (typeof settings.beforeInitFn === "function") {
            settings.beforeInitFn();
        }
        var cCore = {};
        cCore.root = root;
        cCore.o = mapSettings(settings);
        var ds = root.querySelectorAll("".concat(cSelectors.slide));
        cCore._ds = [];
        for (var i = 0; i < ds.length; i++) {
            cCore._ds.push(ds[i]);
        }
        cCore.arrowN = root.querySelector("".concat(cSelectors.arrowN));
        cCore.arrowP = root.querySelector("".concat(cSelectors.arrowP));
        cCore.bPause = root.querySelector("".concat(cSelectors.pauseBtn));
        cCore.bPlay = root.querySelector("".concat(cSelectors.playBtn));
        cCore.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
        cCore.ctrlW = root.querySelector("".concat(cSelectors.ctrlW));
        cCore.eH = [];
        cCore.nav = root.querySelector("".concat(cSelectors.nav));
        cCore.navW = root.querySelector("".concat(cSelectors.navW));
        cCore.pts = {};
        cCore.sLen = cCore._ds.length;
        cCore.trk = root.querySelector("".concat(cSelectors.trk));
        cCore.trkM = root.querySelector("".concat(cSelectors.trkM));
        cCore.trkO = root.querySelector("".concat(cSelectors.trkO));
        cCore.trkW = root.querySelector("".concat(cSelectors.trkW));
        cCore.curp = root.querySelector("".concat(cSelectors.curp));
        cCore.totp = root.querySelector("".concat(cSelectors.totp));
        cCore.fLoad = true;
        if ((settings.syncWith || "").length > 0) {
            cCore.sync = settings.syncWith;
        }
        if (cCore.o.rtl) {
            cCore.root.setAttribute(cSelectors.rtl.slice(1, -1), "true");
        }
        cCore._t = {};
        cCore._t.total = cCore.o.speed;
        if (!cCore._ds[cCore.ci]) {
            cCore.ci = settings.startAtIndex = 0;
        }
        if (cCore.trk && cCore.sLen > 0) {
            if (cCore.o.auto) {
                cCore.o.inf = true;
                togglePauseOnHover(cCore);
            }
            cCore.bpall = updateBreakpoints(cCore.o);
            if (cCore.bpall.length > 0) {
                makeStuffUndraggable(cCore);
                toggleKeyboard(cCore);
                generateElements(cCore);
                // generateScrollbar(cCore);
                toggleControlButtons(cCore);
                toggleTouchEvents(cCore, "sl");
                applyLayout(cCore);
            }
        }
        addClass(cCore.root, cCore.o.activeCls);
        if (cCore.o.ver) {
            cCore.root.setAttribute(cSelectors.ver.slice(1, -1), "true");
        }
        if (!isNaN(cCore.o.cntr) && cCore.o.cntr > 0) {
            cCore.root.setAttribute(cSelectors.cntr.slice(1, -1), "true");
        }
        for (var r = 0; r < cCore.o.res.length; r++) {
            if (!isNaN(cCore.o.res[r].cntr) && cCore.o.res[r].cntr > 0) {
                cCore.root.setAttribute(cSelectors.cntr.slice(1, -1), "true");
            }
        }
        if (cCore.o.auto) {
            initializeAutoplay(cCore);
        }
        if (typeof settings.afterInitFn === "function") {
            settings.afterInitFn();
        }
        if (settings.trackUrlHash && ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hash)) {
            var windowHash = window.location.hash || "";
            if (windowHash.charAt(0) === "#") {
                windowHash = windowHash.slice(1, windowHash.length);
            }
            if ((windowHash || "").length > 0) {
                var thisSlides = cCore.root.querySelectorAll("".concat(cSelectors.slide));
                var foundSlideIndex = -1;
                for (var s = 0; s < thisSlides.length; s++) {
                    if (thisSlides[s].getAttribute("id") === windowHash) {
                        foundSlideIndex = s;
                        break;
                    }
                }
                if (foundSlideIndex !== -1) {
                    go2Slide(cCore, foundSlideIndex);
                }
            }
        }
        return cCore;
    };
    /**
     * Function to get the Carouzel based on the query string provided.
     *
     * @param query - The CSS selector for which the Carouzel needs to be initialized.
     *
     * @returns an array of all available core instances on page
     */
    var getCores = function (query) {
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
     * Function to destroy the carouzel core and delete it from the root instance
     *
     * @param core - The carouzel core which needs to be deleted
     *
     */
    var destroy = function (core) {
        var _a;
        var id = (_a = core.root) === null || _a === void 0 ? void 0 : _a.getAttribute("id");
        var allElems = core.root.querySelectorAll("*");
        for (var i = allElems.length - 1; i >= 0; i--) {
            removeEventListeners(core, allElems[i]);
            if (core.trk && hasClass(allElems[i], core.o.dupCls)) {
                core.trk.removeChild(allElems[i]);
            }
            if (core.nav && allElems[i].hasAttribute(cSelectors.dot.slice(1, -1))) {
                core.nav.removeChild(allElems[i]);
            }
            allElems[i].removeAttribute("style");
            removeClass(allElems[i], "".concat(core.o.activeCls, " ").concat(core.o.editCls, " ").concat(core.o.disableCls, " ").concat(core.o.dupCls));
            if (allElems[i].hasAttribute("disabled")) {
                allElems[i].removeAttribute("disabled");
            }
        }
        removeClass(core.root, "".concat(core.o.activeCls, " ").concat(core.o.editCls, " ").concat(core.o.disableCls, " ").concat(core.o.dupCls));
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
        /**
         * Constructor
         * @constructor
         */
        function Core(thisid, root, options) {
            allLocalInstances[thisid] = init(root, __assign(__assign({}, cDefaults), options));
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
         * Constructor
         * @constructor
         */
        function Root() {
            var _this = this;
            /**
             * Function to return count of all available carouzel objects
             *
             * @returns count of all available carouzel objects
             *
             */
            this.getLength = function () { return getCoreInstancesLength(); };
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
                    for (iloop = 0; iloop < elementsLength; iloop++) {
                        var id = elements[iloop].getAttribute("id");
                        var isElementPresent = false;
                        if (id) {
                            for (jloop = 0; jloop < instanceLength; jloop++) {
                                if (allLocalInstances[id]) {
                                    isElementPresent = true;
                                    break;
                                }
                            }
                        }
                        if (!isElementPresent) {
                            var newOptions = void 0;
                            var autoDataAttr = elements[iloop].getAttribute(cSelectors.rootAuto.slice(1, -1)) || "";
                            if (autoDataAttr) {
                                try {
                                    newOptions = JSON.parse(stringTrim(autoDataAttr).replace(/'/g, "\""));
                                }
                                catch (e) {
                                    // throw new TypeError(cOptionsParseTypeError);
                                    console.error(cOptionsParseTypeError);
                                }
                            }
                            else {
                                newOptions = options;
                            }
                            if (id) {
                                new Core(id, elements[iloop], newOptions);
                            }
                            else {
                                var thisid = id
                                    ? id
                                    : __assign(__assign({}, cDefaults), newOptions).idPrefix +
                                        "_" +
                                        new Date().getTime() +
                                        "_root_" +
                                        (iloop + 1);
                                elements[iloop].setAttribute("id", thisid);
                                new Core(thisid, elements[iloop], newOptions);
                            }
                        }
                    }
                    if (window && getCoreInstancesLength() > 0 && !isWindowEventAttached) {
                        isWindowEventAttached = true;
                        window.addEventListener("resize", winResizeFn, false);
                    }
                }
                else {
                    if (query !== cSelectors.rootAuto) {
                        // throw new TypeError(cRootSelectorTypeError);
                        console.error("init() \"".concat(query, "\": ").concat(cRootSelectorTypeError));
                    }
                }
            };
            /**
             * Function to auto-initialize the Carouzel plugin for specific carouzels
             */
            this.initGlobal = function () {
                _this.init(cSelectors.rootAuto, {});
            };
            /**
             * Function to animate to a certain slide based on a provided direction or number
             *
             * @param query - The CSS selector for which the Carouzels need to be animated
             * @param target - Either the direction `previous` or `next`, or the slide index
             *
             */
            this.goToSlide = function (query, target) {
                var cores = getCores(query);
                if (cores.length > 0) {
                    for (iloop = 0; iloop < cores.length; iloop++) {
                        if (cAnimationDirections.indexOf(target) !== -1) {
                            target === cAnimationDirections[0]
                                ? go2Prev(cores[iloop], 0)
                                : go2Next(cores[iloop], 0);
                        }
                        else if (!isNaN(parseInt(target, 10))) {
                            go2Slide(cores[iloop], parseInt(target, 10) - 1);
                        }
                    }
                }
                else {
                    // throw new TypeError(cRootSelectorTypeError);
                    console.error("goToSlide() \"".concat(query, "\": ").concat(cRootSelectorTypeError));
                }
            };
            /**
             * Function to destroy the Carouzel plugin for provided query strings.
             *
             * @param query - The CSS selector for which the Carouzel needs to be destroyed.
             *
             */
            this.destroy = function (query) {
                var cores = getCores(query);
                if (cores.length > 0) {
                    for (iloop = 0; iloop < cores.length; iloop++) {
                        destroy(cores[iloop]);
                    }
                    if (window && getCoreInstancesLength() === 0) {
                        window.removeEventListener("resize", winResizeFn, false);
                    }
                }
                else {
                    // throw new TypeError(cRootSelectorTypeError);
                    console.error("destroy() \"".concat(query, "\": ").concat(cRootSelectorTypeError));
                }
            };
            if (document) {
                document.addEventListener("visibilitychange", documentVisibilityFn, false);
            }
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
Carouzel.Root.getInstance().initGlobal();
if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = Carouzel;
}

//# sourceMappingURL=carouzel.js.map
