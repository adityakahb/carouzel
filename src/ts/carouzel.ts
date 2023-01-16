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
namespace CarouzelHelper {
  const __version = `2.0.0`;

  export const getV = () => {
    return __version;
  };
}
export default class Carouzel {
  init() {
    console.log(document.querySelectorAll('[data-carouzel]'));
  }
  getInstance() {
    console.log('========');
  }
  getVersion() {
    return CarouzelHelper.getV();
  }
}
new Carouzel().init();
