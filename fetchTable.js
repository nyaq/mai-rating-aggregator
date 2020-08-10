const fetch = require('node-fetch');

module.exports = async function(){
    const response = await fetch('https://priem.mai.ru/rating/');
    // const s = await response.
    const html = await response.text();

    const valueIndex = html.search(/value="p/) + 7;

    const value = html.substr(valueIndex, 15);
    
    const query = `_1_l1_s2_f1_p1`;
    const URL = `https://public.mai.ru/priem/rating/data/${value}${query}.html`;

    console.log('URL :>> ', URL);

    const queryResponse = await fetch(URL);
    const text = await queryResponse.text();

    return text;
};