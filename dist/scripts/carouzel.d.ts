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
    interface ICarouzelBreakpoints {
        breakpoint?: number | string;
        showArrows?: boolean;
        showNav?: boolean;
        slidesToScroll?: number;
        slidesToShow?: number;
    }
    interface ICarouzelSettings {
        activeCls?: string;
        arrowsSelector?: string;
        responsive: ICarouzelBreakpoints[];
        buttonSelector?: string;
        idPrefix?: string;
        innerSelector?: string;
        navSelector?: string;
        nextArrowSelector?: string;
        prevArrowSelector?: string;
        rootCls?: string;
        rootSelector?: string;
        showArrows?: boolean;
        showNav?: boolean;
        slideSelector?: string;
        slidesToScroll?: number;
        slidesToShow?: number;
        titleSelector?: string;
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
        protected init: (query: string, options?: ICarouzelSettings | undefined) => void;
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