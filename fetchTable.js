const fetch = require('node-fetch');
const tryloadFetchedTable =require('./tryloadFetchedTable');

module.exports = async function ({ studyField, maiQuery }) {
    // Provide not url, but callback to get the one
    return tryloadFetchedTable('mai', studyField, null, getMaiUrl.bind(null, maiQuery));
};

async function getMaiUrl(maiQuery) {
    const response = await fetch('https://priem.mai.ru/rating/');
    const html = await response.text();

    // Время? Нужно для запроса
    const valueIndex = html.search(/value="p/) + 7;
    const value = html.substr(valueIndex, 15);

    const URL = `https://public.mai.ru/priem/rating/data/${value}${maiQuery}.html`;
    
    console.log('URL :>> ', URL);

    return URL;
}