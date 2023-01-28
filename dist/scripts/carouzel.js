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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carouzel = void 0;
/***
 *     ██████  █████  ██████   ██████  ██    ██ ███████ ███████ ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██    ███  ██      ██
 *    ██      ███████ ██████  ██    ██ ██    ██   ███   █████   ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██  ███    ██      ██
 *     ██████ ██   ██ ██   ██  ██████   ██████  ███████ ███████ ███████
 *
 *
 */
/**
 * v-2.0.0
 */
var Carouzel;
(function (Carouzel) {
    var __version = "2.0.0";
    var $$ = function (str) {
        return document.querySelectorAll(str) || [];
    };
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
        opts: "[data-carouzel-options]",
        pauseBtn: "[data-carouzel-pause]",
        playBtn: "[data-carouzel-play]",
        root: "[data-carouzel]",
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
    var allInstances = {};
    var instanceIndex = 0;
    var Root = /** @class */ (function () {
        function Root(el, settings) {
        }
        Root.prototype.getInstance = function () { };
        Root.prototype.goToNext = function () { };
        Root.prototype.goToPrevious = function () { };
        Root.prototype.goToSlide = function () { };
        Root.prototype.destroy = function () { };
        return Root;
    }());
    var generate = function (el, options) {
        var element = el;
        var elementId = element.getAttribute("id");
        if (!elementId) {
            elementId = "".concat(__assign(__assign({}, cDefaults), options).idPrefix, "_").concat(new Date().getTime(), "_root_").concat(instanceIndex++);
            element.setAttribute("id", elementId);
        }
        if (!allInstances[elementId]) {
            allInstances[elementId] = new Root(el);
        }
        return allInstances[elementId];
    };
    var initGlobal = function () {
        $$(cSelectors.root).forEach(function (el) {
            var element = el;
            var newOptions;
            var optionsDataAttr = element.getAttribute(cSelectors.opts.slice(1, -1)) || "";
            if (optionsDataAttr) {
                try {
                    newOptions = JSON.parse(optionsDataAttr.trim().replace(/'/g, "\""));
                }
                catch (e) {
                    // throw new TypeError(cOptionsParseTypeError);
                    console.error(cOptionsParseTypeError);
                }
            }
            else {
                newOptions = {};
            }
            generate(el, newOptions);
        });
    };
    Carouzel.init = function (el, settings) {
        return generate(el, settings || {});
    };
    Carouzel.getVersion = function () {
        return __version;
    };
    initGlobal();
})(Carouzel = exports.Carouzel || (exports.Carouzel = {}));

//# sourceMappingURL=carouzel.js.map
