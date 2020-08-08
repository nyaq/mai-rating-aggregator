const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');

let browser;

module.exports.closePuppeteer = async function () {
    if (process.env.CHROME_WS_ENDPOINT)
        return;

    return await browser.close();
};

module.exports.runPuppeteer = async function () {
    // Attach to chrome
    if (process.env.CHROME_WS_ENDPOINT)
        return attachToChrome(process.env.CHROME_WS_ENDPOINT);

    else if (process.env.CHROME_DEBUG_PORT) {
        const chromeWsEndpoint = await getChromeWsEndpoint(process.env.CHROME_DEBUG_PORT);
        return attachToChrome(chromeWsEndpoint);
    }

    else
        return launchPuppeteer();
};

async function attachToChrome(chromeWsEndpointURL) {
    return puppeteer.connect({
        browserWSEndpoint: chromeWsEndpointURL,
        executablePath: `"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222  --profile-directory="Puppeteer"`,
    });
}

async function launchPuppeteer() {

    // return puppeteer.launch({
    //     timeout: 95000,
    // });



    browser = await puppeteer.launch({
        executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
        // devtools: true,
        headless: false,
        // args: ['--remote-debugging-port=9222', '--profile-directory="Puppeteer"'],
        // userDataDir: `C:\\Users\\Kanata\\AppData\\Local\\Google\\Chrome\\User Data\\Puppeteer`
    });

    return browser;
}

async function getChromeWsEndpoint(port) {
    const res = await fetch(`http://localhost:${port}/json/version`);

    const json = await res.json();

    return json.webSocketDebuggerUrl;
}