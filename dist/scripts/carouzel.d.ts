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
    interface ICarouzelBreakpoint {
        breakpoint: number | string;
        centerBetween: number;
        hasTouchSwipe: boolean;
        showArrows: boolean;
        showNavigation: boolean;
        slidesToScroll: number;
        slidesToShow: number;
    }
    interface ICarouzelSettings {
        activeClass: string;
        afterScroll?: Function;
        animationEffect: string;
        animationSpeed: number;
        autoplay: boolean;
        autoplaySpeed: number;
        beforeInit?: Function;
        beforeScroll?: Function;
        centerBetween: number;
        centeredClass: string;
        disabledClass: string;
        duplicateClass: string;
        enableKeyboard: boolean;
        hasTouchSwipe: boolean;
        hiddenClass: string;
        idPrefix: string;
        isInfinite: boolean;
        isRTL?: boolean;
        onInit?: Function;
        pauseOnHover: boolean;
        responsive?: ICarouzelBreakpoint[];
        rtlClass?: string;
        showArrows: boolean;
        showNavigation: boolean;
        slidesToScroll: number;
        slidesToShow: number;
        startAtIndex: number;
        timingFunction: string;
        touchThreshold: number;
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
        private instances;
        protected static instance: Root | null;
        /**
         * Constructor to initiate polyfills
         *
         */
        constructor();
        private getInstancesLength;
        private winResize;
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
        globalInit: () => void;
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