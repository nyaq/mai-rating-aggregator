const { fetchProcessAndAnalyzeData, printTable } = require('./index');

const FIO = 'Безногова Алёна Александровн';
const rusScores = '81';
const studyField = 'авиастроение';


(async function () {
    const { analyticsTable, flattenMaiTable } = await fetchProcessAndAnalyzeData(studyField, FIO, rusScores);

    printTable(analyticsTable, 'Мои места', 40);
})();