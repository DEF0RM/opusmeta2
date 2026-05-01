const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 5000 });
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
    } catch (e) {
        console.error(e.message);
    }
})();
