let __carouzel_instance;
const desktop = { width: 1200, height: 980 };
const tablet = { width: 768, height: 980 };
const mobile = { width: 375, height: 980 };

const GetProperty = async (element, property) => {
  return await (await element.getProperty(property)).jsonValue();
};

describe('Carouzel', () => {
  jest.setTimeout(50000);
  beforeAll(async () => {
    // const indexPath = `file://${process.cwd()}/tests/fixture.html`;
    const indexPath = `http://localhost:1234`;
    await page.goto(indexPath, {
      waitUntil: 'load',
      timeout: 54321,
    });
  });
  test('The Carouzel instance', async () => {
    __carouzel_instance = () => {
      return page.evaluate(async () => {
        return await new Promise((resolve) => {
          resolve(Carouzel.Root.getInstance());
        });
      });
    };
    expect(__carouzel_instance).not.toBe(undefined);
  });
  test('The number of instances: should be 1 because of the fixture containing on "data-carouzel-auto"', async () => {
    const defaultLength = await page.evaluate(() => {
      const __carouzel_instance = Carouzel.Root.getInstance();
      return __carouzel_instance.getLength();
    });
    expect(defaultLength).toBe(1);
  });
  test('The simple Carouzel slider', async () => {
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_1');
    });
    const __carouzelSlides = await page.$$(
      '#__carouzel_1 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlides || []).length).toBe(1);
  });
  test('The multiple Carouzel slider', async () => {
    await page.setViewport(desktop);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_2', {
        slidesToShow: 3,
        slidesToScroll: 3,
      });
    });
    const __carouzelSlides = await page.$$(
      '#__carouzel_2 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlides || []).length).toBe(3);
  });
  test('The responsive Carouzel slider', async () => {
    await page.setViewport(mobile);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_3', {
        slidesToShow: 1,
        breakpoints: [
          {
            minWidth: 700,
            slidesToScroll: 2,
            slidesToShow: 2,
            showNav: true,
          },
          {
            minWidth: 1100,
            slidesToScroll: 4,
            slidesToShow: 4,
          },
        ],
      });
    });
    let __carouzelSlidesM = await page.$$(
      '#__carouzel_3 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlidesM || []).length).toBe(1);
    await page.setViewport(tablet);
    await new Promise((r) => setTimeout(r, 2000));
    let __carouzelSlidesT = await page.$$(
      '#__carouzel_3 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlidesT || []).length).toBe(2);
    await page.setViewport(desktop);
    await new Promise((r) => setTimeout(r, 2000));
    let __carouzelSlidesD = await page.$$(
      '#__carouzel_3 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlidesD || []).length).toBe(4);
  });
  test('The fading Carouzel slider', async () => {
    await page.setViewport(desktop);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_4', {
        slidesToShow: 1,
        animationEffect: 'fade',
        breakpoints: [
          {
            minWidth: 700,
            slidesToScroll: 3,
            slidesToShow: 3,
          },
        ],
      });
    });
    await page.evaluate(() => {
      document.querySelector('#__carouzel_4 [data-carouzel-nextarrow]').click();
    });
    let __carouzelSlides = await page.$$(
      '#__carouzel_4 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlides || []).length).toBe(3);
  });
  test('The autoplay Carouzel slider', async () => {
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_6', {
        slidesToScroll: 3,
        slidesToShow: 3,
        autoplay: true,
        pauseOnHover: true,
      });
    });
    let __carouzelSlides = await page.$$('#__carouzel_6 [data-carouzel-slide]');
    let index = -1;
    let classList = '';
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(3);
    await new Promise((r) => setTimeout(r, 5500));
    __carouzelSlides = await page.$$('#__carouzel_6 [data-carouzel-slide]');
    index = -1;
    classList = '';
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(6);
    await new Promise((r) => setTimeout(r, 5500));
    __carouzelSlides = await page.$$('#__carouzel_6 [data-carouzel-slide]');
    index = -1;
    classList = '';
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(9);
  });
  test('The finite Carouzel slider', async () => {
    await page.setViewport(desktop);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_7', {
        slidesToShow: 1,
        isInfinite: false,
        breakpoints: [
          {
            minWidth: 700,
            slidesToScroll: 2,
            slidesToShow: 2,
          },
          {
            minWidth: 1100,
            slidesToScroll: 3,
            slidesToShow: 3,
          },
        ],
      });
    });
    let leftArrow = await page.$$(
      '#__carouzel_7 [data-carouzel-previousarrow]'
    );
    let nextArrow = await page.$$('#__carouzel_7 [data-carouzel-nextarrow]');
    let leftClass = (await GetProperty(leftArrow[0], 'className')) || '';
    let nextClass = (await GetProperty(nextArrow[0], 'className')) || '';
    expect(leftClass.indexOf('__carouzel-disabled')).not.toBe(-1);
    expect(nextClass.indexOf('__carouzel-disabled')).toBe(-1);
    await page.evaluate(() => {
      document.querySelector('#__carouzel_7 [data-carouzel-nextarrow]').click();
    });
    await new Promise((r) => setTimeout(r, 5500));
    leftArrow = await page.$$('#__carouzel_7 [data-carouzel-previousarrow]');
    nextArrow = await page.$$('#__carouzel_7 [data-carouzel-nextarrow]');
    leftClass = (await GetProperty(leftArrow[0], 'className')) || '';
    nextClass = (await GetProperty(nextArrow[0], 'className')) || '';
    expect(leftClass.indexOf('__carouzel-disabled')).toBe(-1);
    expect(nextClass.indexOf('__carouzel-disabled')).not.toBe(-1);
  });
});
