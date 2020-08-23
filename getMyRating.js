const { fetchProcessAndAnalyzeData, printTable } = require('./index');
const compareToDorm2019 = require('./data processing and analytics/compareToDorm2019');


const FIO = 'бояркин владислав витальевич';
const rusScores = '91';
const studyField = {
    studyField: 'Прикладная математика',
    code: '01.03.04',
    admlistURL: 'http://admlist.ru/mai/6e9d426ceb62e999577b9e195cbcc865.html',
    maiQuery: '_1_l1_s2_f1_p1',
};


(async function () {
    const { analyticsTable, flattenMaiTable } = await fetchProcessAndAnalyzeData(studyField.studyField, FIO, rusScores);

    printTable(analyticsTable, 'Мои места', 40);

    const dorm2019 = compareToDorm2019(flattenMaiTable);

    printTable(dorm2019, 'Места в рейтинге и баллы тех, кому выдали общежитие в 2019', 15);

})();