let __carouzel_instance;
describe('Carouzel', () => {
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
  test('The 1st Carouzel slider', async () => {
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_1');
    });
    const __carouzel1Slides = await page.$$(
      '#__carouzel_1 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzel1Slides || []).length).toBe(1);
  });
});
