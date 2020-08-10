const fetchTable = require('./fetchTable');
const tableToJson = require('tabletojson').Tabletojson;

(async function () {
    const HTMLtable = await fetchTable();

    const tables = tableToJson.convert(HTMLtable);

    const dormRequired = tables.map(
        table => table.filter(
            applicant => applicant['Нуждаемость в общежитии']
        )
    );

    const dormRequiredHighScores = dormRequired.map(table => table.filter(applicant =>
        Number(applicant['Сумма конкурсных баллов']) >= 264)
    );

    const dormRequiredHighScoresOriginals = dormRequiredHighScores.map(table =>
        table.filter(applicant => applicant['Согласие на зачисление'])
    );

    const dormRequiredHighScoresOriginalsLength = dormRequiredHighScoresOriginals.reduce(
        (sum, table) => sum += table.length,
        0
    );

    console.log('\nВ полном списке я нахожусь на месте:');
    console.log(findMyPlace(tables));

    console.log('\nCреди тех, кому нужно общежитие, я нахожусь на месте:');
    console.log(findMyPlace(dormRequired));

    console.log('\nПоследний человек с суммой баллов >= 264 среди тех, кому нужно общежитие и кто подал согласие, находится на месте:');
    console.log(dormRequiredHighScoresOriginalsLength);

    console.log('\nЯ буду на месте или выше:');
    console.log(dormRequiredHighScoresOriginalsLength + 1);
})();

function findMyIndex(tables) {
    return findIndexByName(tables, 'Бояркин Владислав Витальевич');
}
function findMyPlace(tables) {
    return findPlaceByName(tables, 'Бояркин Владислав Витальевич');
}

function findIndexByName(tables, FIO) {
    return tables[3].findIndex(
        applicant => applicant['ФИО'] === FIO
    );
}
function findPlaceByName(tables, FIO) {
    // учесть БВИ, целевиков, особую квоту
    return tables[0].length +
        tables[1].length +
        tables[2].length +
        findIndexByName(tables, FIO) + 1; // нумерация с единицы 
}
