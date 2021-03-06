/***
 *     ██████  █████  ██████   ██████  ██    ██ ███████ ███████ ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██    ███  ██      ██
 *    ██      ███████ ██████  ██    ██ ██    ██   ███   █████   ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██  ███    ██      ██
 *     ██████ ██   ██ ██   ██  ██████   ██████  ███████ ███████ ███████
 *
 *
 */
declare namespace Carouzel {
    interface IBreakpoint {
        minWidth: number | string;
        centerBetween: number;
        enableTouchSwipe: boolean;
        showArrows: boolean;
        showNavigation: boolean;
        slideGutter: number;
        slidesToScroll: number;
        slidesToShow: number;
        verticalHeight: number;
    }
    interface ISettings {
        activeClass: string;
        afterInitFn?: () => void;
        afterScrollFn?: () => void;
        animationEffect: string;
        animationSpeed: number;
        appendUrlHash: boolean;
        autoplay: boolean;
        autoplaySpeed: number;
        beforeInitFn?: () => void;
        beforeScrollFn?: () => void;
        breakpoints?: IBreakpoint[];
        centerBetween: number;
        disabledClass: string;
        dotIndexClass: string;
        dotTitleClass: string;
        duplicateClass: string;
        easingFunction: string;
        editModeClass: string;
        enableKeyboard: boolean;
        enableTouchSwipe: boolean;
        hiddenClass: string;
        idPrefix: string;
        isInfinite: boolean;
        isRtl: boolean;
        isVertical: boolean;
        nextDirectionClass: string;
        pauseOnHover: boolean;
        previousDirectionClass: string;
        showArrows: boolean;
        showNavigation: boolean;
        slideGutter: number;
        slidesToScroll: number;
        slidesToShow: number;
        startAtIndex: number;
        syncWith: string;
        touchThreshold: number;
        trackUrlHash: boolean;
        useTitlesAsDots: boolean;
        verticalHeight: number;
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
        protected static instance: Root | null;
        /**
         * Constructor
         * @constructor
         */
        constructor();
        /**
         * Function to return single instance
         *
         * @returns Single Carouzel Instance
         *
         */
        static getInstance(): Root;
        /**
         * Function to return count of all available carouzel objects
         *
         * @returns count of all available carouzel objects
         *
         */
        protected getLength: () => number;
        /**
         * Function to initialize the Carouzel plugin for provided query strings.
         *
         * @param query - The CSS selector for which the Carouzel needs to be initialized.
         * @param options - The optional object to customize every Carouzel instance.
         *
         */
        init: (query: string, options?: ISettings | undefined) => void;
        /**
         * Function to auto-initialize the Carouzel plugin for specific carouzels
         */
        initGlobal: () => void;
        /**
         * Function to animate to a certain slide based on a provided direction or number
         *
         * @param query - The CSS selector for which the Carouzels need to be animated
         * @param target - Either the direction `previous` or `next`, or the slide index
         *
         */
        protected goToSlide: (query: string, target: string) => void;
        /**
         * Function to destroy the Carouzel plugin for provided query strings.
         *
         * @param query - The CSS selector for which the Carouzel needs to be destroyed.
         *
         */
        protected destroy: (query: string) => void;
    }
    export {};
}
