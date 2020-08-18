const fetchTable = require('./fetchTable');
const tableToJson = require('tabletojson').Tabletojson;
const consoleTable = require('console-table-printer').printTable;
const fetchAdmlistData = require('./fetchAdmlistData');
const combineMaiAndAdmlist = require('./combineMaiAndAdmlist');
const getAnalytics = require('./getAnalytics');

const FIO = 'Бояркин Владислав Витальевич';
const studyField = {
    studyField: 'Прикладная математика',
    code: '01.03.04',
    admlistURL: 'http://admlist.ru/mai/6e9d426ceb62e999577b9e195cbcc865.html',
    maiQuery: '_1_l1_s2_f1_p1',
};

(async function () {
    const HTMLtablePromise = fetchTable(studyField);
    const admlistDataPromise = fetchAdmlistData(studyField);

    // Async load mai and admlist ratings
    const [HTMLtable, admlistData] = await Promise.all([HTMLtablePromise, admlistDataPromise]);

    const maiTables = tableToJson.convert(HTMLtable);


    const applicants = combineMaiAndAdmlist(maiTables, admlistData);

    const analytics = getAnalytics(FIO, applicants);

    analytics.forEach(entry => {
        console.log('');
        console.log(entry.description);
        console.log(entry.place);
    });


    const dorm2019 = [
        { 'Место': 27, 'Баллы': 260, 'Место в общем рейтинге': 315, 'Волна': 'I волна' },
        { 'Место': 28, 'Баллы': 259, 'Место в общем рейтинге': 332, 'Волна': 'I волна' },
        { 'Место': 29, 'Баллы': 259, 'Место в общем рейтинге': 320, 'Волна': 'I волна' },
        { 'Место': 30, 'Баллы': 259, 'Место в общем рейтинге': 331, 'Волна': 'I волна' },
        { 'Место': 31, 'Баллы': 273, 'Место в общем рейтинге': 114, 'Волна': 'II волна' },
    ];

    printTable(dorm2019);


    const scoresNow = [114, 315, 320, 331, 332].map(
        oldPosition => ({
            'Место в рейтинге в 2019': oldPosition,
            'Баллы этого места в рейтинге сейчас': getScoresByRatingPosition(maiTables, oldPosition)
        })
    );

    printTable(scoresNow);
})();



function printTable(table) {
    // console.log(consoleTable(table).toString());
    console.table(table);
}

