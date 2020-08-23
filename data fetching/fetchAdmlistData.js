const tableToJson = require('tabletojson').Tabletojson;
const fetch = require('node-fetch');
const tryloadFetchedTable = require('./tryloadFetchedTable');

// const armlistMAIurl = 'http://admlist.ru/mai/6e9d426ceb62e999577b9e195cbcc865.html';

module.exports = async function (studyFieldName, admlistURL) {
    const html = await tryloadFetchedTable('admlist', studyFieldName, admlistURL);

    const tables = await tableToJson.convert(html);
    const tablesHTML = await tableToJson.convert(html, {
        stripHtmlFromCells: false,
    });
    const table = tables[2];
    const tableHTML = tablesHTML[2];

    return { table, tableHTML };
};