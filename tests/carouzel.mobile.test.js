// const puppeteer = require('puppeteer');
// const iPhone = puppeteer.devices['iPhone 6'];

// const GetProperty3 = async (element, property) => {
//   return await (await element.getProperty(property)).jsonValue();
// };

// describe('Carouzel', () => {
//   jest.setTimeout(1800000);
//   beforeAll(async () => {
//     const indexPath = `http://localhost:1234`;
//     await page.emulate(iPhone);
//     await page.goto(indexPath, {
//       waitUntil: 'load',
//       timeout: 54321,
//     });
//     page.on('console', (msg) => {
//       for (let i = 0; i < msg.args().length; i++) {
//         console.log(msg.args()[i]);
//       }
//     });
//   });
//   test('The touch events on Carouzel slider', async () => {
//     await page.evaluate(() => {
//       let __carouzel_instance = Carouzel.Root.getInstance();
//       __carouzel_instance.destroy('#__carouzel_1');
//       __carouzel_instance.init('#__carouzel_1');
//     });
//     expect('true').toBe('true');
//   });
// });
