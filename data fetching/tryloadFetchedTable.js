const fs = require('fs-extra');
const fetch = require('node-fetch');
const threshold = 5 * 60 * 1000; // 5 min in miliseconds

const WORKDIR = 'D:/repos/NyaqStudios/mai-rating';

module.exports = async function (type, studyField, url, getUrlCallback) {
    try {
        if (type !== 'mai' && type !== 'admlist')
            throw new Error("tryloadFetchedTable: Type should be 'mai' or 'admlist' but is " + type);

        const path = `${WORKDIR}/data fetching/fetched tables/${studyField}/${type}/`;
        const lastFetchedPath = path + 'lastFetched.txt';

        // Ensure lastFetched.txt exists
        await fs.ensureFile(lastFetchedPath);

        // If lastFetched.txt has just been created, elapsed will be really big and that's ok
        const lastFetched = await fs.readFile(lastFetchedPath, { encoding: 'utf-8' });
        const elapsed = new Date().getTime() - lastFetched;

        // if there is fresh data
        if (elapsed <= threshold) {
            // load file
            return fs.readFile(path + 'fetchedData.html', { encoding: 'utf8', });
        }

        // Fetch html. If no url provided, get it from the callback
        if (!url)
            url = await getUrlCallback();
        const queryResponse = await fetch(url);
        const html = await queryResponse.text();

        // async save fetched data
        fs.writeFile(path + 'fetchedData.html', html, { encoding: 'utf8', })
            .then(() => fs.writeFileSync(lastFetchedPath, new Date().getTime()))
            .then(() => console.log(`Saved ${path}fetchedData.html successfully`))
            .catch((err) => console.error('Error on saving fetchedData.html: ', err));

        return html;
    } catch (err) {
        console.error('tryloadFetchedTable error:');
        console.error(err);

        const queryResponse = await fetch(url);
        const html = await queryResponse.text();

        return html;
    }
};