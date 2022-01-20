describe('Carouzel', () => {
  beforeAll(async () => {
    const indexPath = `file://${process.cwd()}/index.html`;
    await page.goto(indexPath);
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
        Carouzel: JSON.stringify(window.Carouzel),
      };
    });
    console.log('Dimensions:', dimensions);
  });

  it('test 1', async () => {
    // await expect(page.__carouzel_instance).resolves.not.toBe(null);
  });
});
