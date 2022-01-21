describe('Carouzel', () => {
  beforeAll(async () => {
    // const indexPath = `file://${process.cwd()}/index.html`;
    const indexPath = `http://localhost:1234`;
    await page.goto(indexPath, {
      waitUntil: 'load',
      timeout: 54321,
    });
  });
  test('The 0st fibonacci number', async () =>
    expect(await page.$('#__carouzel_1')).not.toBe(null));
});
