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
        hasTouchSwipe: boolean;
        showArrows: boolean;
        showNavigation: boolean;
        slidesToScroll: number;
        slidesToShow: number;
    }
    interface ICarouzelSettings {
        activeClass?: string;
        animationEffect?: string;
        animationSpeed?: number;
        centeredClass?: string;
        centerMode?: boolean;
        disabledClass?: string;
        duplicateClass?: string;
        hasTouchSwipe: boolean;
        isInfinite?: boolean;
        isRTL?: boolean;
        responsive?: ICarouzelBreakpoint[];
        rtlClass?: string;
        showArrows: boolean;
        showNavigation: boolean;
        slidesToScroll: number;
        slidesToShow: number;
        startAtIndex?: number;
        timeFunction?: string;
        touchThreshold?: number;
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
        private getInsLen;
        private winResize;
        /**
         * Function to return single instance
         *
         * @returns Single AMegMen Instance
         *
         */
        static getInstance(): Root;
        /**
         * Function to initialize the AMegMen plugin for provided query strings.
         *
         * @param query - The CSS selector for which the AMegMen needs to be initialized.
         * @param options - The optional object to customize every AMegMen instance.
         *
         */
        init: (query: string, options?: ICarouzelSettings | undefined) => void;
        globalInit: () => void;
        /**
         * Function to destroy the AMegMen plugin for provided query strings.
         *
         * @param query - The CSS selector for which the AMegMen needs to be initialized.
         *
         */
        protected destroy: (query: string) => void;
    }
    export {};
}
//# sourceMappingURL=carouzel.d.ts.map