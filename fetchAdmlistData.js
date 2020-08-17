const tableToJson = require('tabletojson').Tabletojson;
const fetch = require('node-fetch');
const tryloadFetchedTable = require('./tryloadFetchedTable');

// const armlistMAIurl = 'http://admlist.ru/mai/6e9d426ceb62e999577b9e195cbcc865.html';

module.exports = async function (armlistMAIurl) {
    let html;

    try {
        html = await tryloadFetchedTable('admlist', 'прикладная математика', armlistMAIurl);
    } catch (err) {
        debugger;

        html = await fetch(url);
    }

    const tables = await tableToJson.convertUrl(armlistMAIurl);
    const tablesHTML = await tableToJson.convertUrl(armlistMAIurl, {
        stripHtmlFromCells: false,
    });
    const table = tables[2];
    const tableHTML = tablesHTML[2];



    return { table, tableHTML };
};