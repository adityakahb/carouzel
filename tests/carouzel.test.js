let Carouzel;
let __carouzel_instance;
describe('Carouzel', () => {
  beforeAll(async () => {
    const indexPath = `file://${process.cwd()}/tests/fixture.html`;
    await page.goto(indexPath, {
      waitUntil: 'load',
      timeout: 54321,
    });
  });
  test('The main Carouzel Plugin', async () => {
    Carouzel = await page.evaluate('Carouzel');
    expect(Carouzel).not.toBe(undefined);
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
});
