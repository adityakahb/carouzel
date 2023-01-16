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
export namespace Carouzel {
  const __version = `2.0.0`;

  const $$ = (str: string) => {
    return document.querySelectorAll(str) || [];
  };

  interface IInstances {
    [key: string]: any;
  }

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
    // enableScrollbar: boolean;
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

  interface IEventHandler {
    element: Element | Document | Window;
    remove: () => void;
  }

  let instances: IInstances = {};

  class Root {
    constructor(el?: Node, settings?: ISettings) {}
    public getInstance() {}
    public goToNext() {}
    public goToPrevious() {}
    public goToSlide() {}
    public destroy() {}
  }

  const initGlobal = () => {
    $$('[data-carouzel]').forEach((el: Node) => {
      new Root(el);
    });
  };

  export const init = (el?: Node, settings?: ISettings) => {
    return new Root(el, settings);
  };

  export const getVersion = () => {
    return __version;
  };

  initGlobal();
  console.log('=======instances', instances);
}
const temp = Carouzel.init();
console.log('=======temp', temp);
