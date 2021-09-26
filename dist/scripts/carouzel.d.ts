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
        breakpoint?: number | string;
        dragThreshold?: number;
        enableSwipe?: boolean;
        showArrows?: boolean;
        showNav?: boolean;
        slidesToScroll?: number;
        slidesToShow?: number;
        speed?: number;
        timingFunction?: string;
    }
    interface ICarouzelSettings {
        activeCls?: string;
        activeSlideCls?: string;
        arrowsSelector?: string;
        buttonSelector?: string;
        disableCls?: string;
        dragThreshold?: number;
        enableSwipe?: boolean;
        hideCls?: string;
        idPrefix?: string;
        innerSelector?: string;
        navBtnElem?: string;
        navInnerSelector?: string;
        navSelector?: string;
        nextArrowSelector?: string;
        prevArrowSelector?: string;
        responsive: ICarouzelBreakpoint[];
        rootAutoSelector?: string;
        rootCls?: string;
        rootSelector?: string;
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