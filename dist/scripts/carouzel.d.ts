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
    interface IRoot {
        [key: string]: any;
    }
    interface ICarouzelBreakpoint {
        breakpoint: number | string;
        centerBetween: number;
        hasTouchSwipe: boolean;
        showArrows: boolean;
        showNavigation: boolean;
        slidesToScroll: number;
        slidesToShow: number;
        spaceBetween: number;
    }
    interface ICarouzelSettings {
        activeClass: string;
        afterInit?: Function;
        afterScroll?: Function;
        animationEffect: string;
        animationSpeed: number;
        appendUrlHash: boolean;
        autoplay: boolean;
        autoplaySpeed: number;
        beforeInit?: Function;
        beforeScroll?: Function;
        centerBetween: number;
        disabledClass: string;
        dotIndexClass: string;
        dotTitleClass: string;
        duplicateClass: string;
        editClass: string;
        enableKeyboard: boolean;
        hasTouchSwipe: boolean;
        hiddenClass: string;
        idPrefix: string;
        isInfinite: boolean;
        isRTL: boolean;
        pauseOnHover: boolean;
        responsive?: ICarouzelBreakpoint[];
        showArrows: boolean;
        showNavigation: boolean;
        slidesToScroll: number;
        slidesToShow: number;
        spaceBetween: number;
        startAtIndex: number;
        timingFunction: string;
        touchThreshold: number;
        trackUrlHash: boolean;
        useTitlesAsDots: boolean;
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
         * Constructor to initiate polyfills
         *
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
         * Function to initialize the Carouzel plugin for provided query strings.
         *
         * @param query - The CSS selector for which the Carouzel needs to be initialized.
         * @param options - The optional object to customize every Carouzel instance.
         *
         */
        init: (query: string, options?: ICarouzelSettings | undefined) => void;
        /**
         * Function to initialize all the carouzel which have `data-carouzelauto` set
         *
         */
        globalInit: () => void;
        /**
         * Function to get the Carouzel based on the query string provided.
         *
         * @param query - The CSS selector for which the Carouzel needs to be initialized.
         *
         */
        protected getRoots: (query: string) => IRoot;
        /**
         * Function to return count of all available carouzel objects
         *
         * @returns count of all available carouzel objects
         *
         */
        protected getCount: () => number;
        /**
         * Function to destroy the Carouzel plugin for provided query strings.
         *
         * @param query - The CSS selector for which the Carouzel needs to be initialized.
         *
         */
        protected destroy: (query: string) => void;
    }
    export {};
}
//# sourceMappingURL=carouzel.d.ts.map