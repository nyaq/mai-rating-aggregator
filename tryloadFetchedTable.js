const fs = require('fs').promises;
const threshold = 3 * 60 * 1000; // miliseconds

module.exports = async function (type, studyField, url) {
    const path = `./fetched tables/${studyField}/${type}/`;

    if (type !== 'mai' || type !== 'admlist')
        throw new Error("tryloadFetchedTable: Type should be 'mai' or 'admlist' but is " + type);

    const lastFetched = await fs.readFile(path + 'lastFetched.txt', { encoding: 'utf-8' });
    const elapsed = new Date().getTime() - lastFetched;

    // if there is fresh data
    if (elapsed <= threshold) {
        // load file
        return fs.readFile(path + 'fetchedData.html', { encoding: 'utf8', });
    }

    const html = await fetch(url);

    // save fetched data
    await fs.writeFile(path + 'fetchedData.html', html, { encoding: 'utf8', });

    return html;
};