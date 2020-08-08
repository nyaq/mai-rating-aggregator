const puppeteer = require('puppeteer-core');

const choosePrimat = require('./choosePRIMAT');
const { runPuppeteer } = require('./runPuppeteer');

(async function () {
    // const browser = await puppeteer.launch({
    //     executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
    // });
    const browser = await runPuppeteer();

    const MAIpage = await browser.newPage();
    await MAIpage.goto('https://priem.mai.ru/rating/', {
        waitUntil: "networkidle0",
    });

    // Show PRIMAT table
    // await choosePrimat(MAIpage);

    await MAIpage.waitForSelector('#place');
    await MAIpage.waitFor(1666);

    await MAIpage.click('#place', {
        delay: 15,
    })
    console.log('clicked');

    await MAIpage.waitFor(5000)

    await MAIpage.click('#place')
    console.log('clicked');
    

})();