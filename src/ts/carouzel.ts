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
    return `Carouzel Version ${__version}`;
  };
}
export class Carouzel {
  init() {
    console.log('=========here');
  }
  getVersion() {
    return CarouzelHelper.getV();
  }
}
new Carouzel().init();
