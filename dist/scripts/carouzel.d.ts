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
        animation?: string;
        breakpoint?: number | string;
        centeredCls?: string;
        centerAmong?: number;
        enableSwipe?: boolean;
        showArrows?: boolean;
        showNav?: boolean;
        slidesToScroll?: number;
        slidesToShow?: number;
    }
    interface ICarouzelSettings {
        activeClass?: string;
        activeSlideClass?: string;
        animation?: string;
        arrowsSelector?: string;
        buttonSelector?: string;
        centerAmong?: number;
        centeredCls?: string;
        disableClass?: string;
        dragThreshold?: number;
        enableSwipe?: boolean;
        hiddenClass?: string;
        idPrefix?: string;
        innerSelector?: string;
        isRTL?: boolean;
        navBtnElem?: string;
        navInnerSelector?: string;
        navSelector?: string;
        nextArrowSelector?: string;
        prevArrowSelector?: string;
        responsive: ICarouzelBreakpoint[];
        rootAutoSelector?: string;
        rootElemClass?: string;
        rootSelector?: string;
        rtlClass?: string;
        showArrows?: boolean;
        showNav?: boolean;
        slideSelector?: string;
        slidesToScroll?: number;
        slidesToShow?: number;
        speed?: number;
        startAtIndex?: number;
        timingFunction?: string;
        titleSelector?: string;
        trackInnerSelector?: string;
        trackOuterSelector?: string;
        trackSelector?: string;
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
        private windowResize;
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