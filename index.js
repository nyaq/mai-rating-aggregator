const tableToJson = require('tabletojson').Tabletojson;
const consoleTable = require('console-table-printer').printTable;

const fetchAdmlistData = require('./data fetching/fetchAdmlistData');
const fetchTable = require('./data fetching/fetchTable');
const combineMaiAndAdmlist = require('./data processing and analytics/combineMaiAndAdmlist');
const getAnalytics = require('./data processing and analytics/getAnalytics');
const { prepareAdmlistData, prepareMaiData } = require('./data processing and analytics/prepareData');
const { getStudyField } = require('./data fetching/getStudyField');


module.exports.fetchProcessAndAnalyzeData = async function (studyFieldName, FIO, rusScores) {
    const studyField = await getStudyField(studyFieldName);

    const HTMLtablePromise = fetchTable(studyField["Специальность, ОП"], studyField.maiQuery);
    const admlistDataPromise = fetchAdmlistData(studyField["Специальность, ОП"], studyField.admlistURL);

    // Async load mai and admlist ratings
    const [HTMLtable, admlistData] = await Promise.all([HTMLtablePromise, admlistDataPromise]);

    let maiTables = tableToJson.convert(HTMLtable);
    // try {
    //     maiTables = tableToJson.convert(HTMLtable);
    // } catch (err) {
    //     console.log('error on convertimg mai table to json!', err);
    //     maiTables = [];
    // }

    let flattenMaiTable = prepareMaiData(maiTables);
    const admlist = prepareAdmlistData(admlistData);

    const applicants = combineMaiAndAdmlist(flattenMaiTable, admlist);

    const analytics = getAnalytics(FIO, rusScores, applicants);

    analytics.forEach(entry => {
        console.log('');
        console.log(entry.description);
        console.log(entry.place);
    });

    const analyticsTable = {
        'Во всём списке': {
            'Во всём списке': analytics[0].place,
            'Среди НЕ подавших согласие в другое место': analytics[1].place,
            'Среди подавших согласие': analytics[2].place,
        },
        'Среди нуждающихся в общежитии': {
            'Во всём списке': analytics[3].place,
            'Среди НЕ подавших согласие в другое место': analytics[4].place,
            'Среди подавших согласие': analytics[5].place,
        },
    };

    return { analytics, analyticsTable, flattenMaiTable };
};


module.exports.printTable = function printTable(table, title, fillXtimes = 10) {
    const filler = ' '.repeat(fillXtimes);
    console.log('\n' + `${filler}=== ${title} ===`);

    // console.log(consoleTable(table).toString());
    console.table(table);
    console.log('');
};