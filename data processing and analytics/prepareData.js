const {getShrinkedName} = require('./filterApplicants');

module.exports.prepareMaiData = function prepareMaiData(maiTables) {
    // На сайте не пишут, но БВИ предполагает согласие на зачисление
    maiTables[0].forEach(applicant => applicant['Согласие на зачисление'] = '✓');

    const flattenTable = maiTables[0]
        .concat(maiTables[1])
        .concat(maiTables[2])
        .concat(maiTables[3]);

    // If no scores (бви по олимпиаде), fill it with zero
    flattenTable.forEach(applicant =>
        applicant['Сумма конкурсных баллов'] = applicant['Сумма конкурсных баллов'] || 0
    );

    // Make ids like '{ФИО} {баллы}'
    flattenTable.forEach(applicant => applicant.id = getApplicantId(applicant));

    return flattenTable;
}
module.exports.prepareAdmlistData = function prepareAdmlistData({ table: admlist, tableHTML }) {
    // Проверяет, подал ли абитуриент согласие в другой вуз 
    // (тогда этот вуз будет выделен жирным на admlist)
    admlist.forEach((applicant, index) =>
        applicant['Подано согласие в другой вуз'] = tableHTML[index]['Другие ОП'].includes('<b>')
    );

    admlist.forEach(applicant => applicant.id = getApplicantId(applicant));

    return admlist;
}

function getApplicantId(applicant) {
    const scores = applicant['Сумма конкурсных баллов'] || applicant['∑'] || 0;

    return getShrinkedName(applicant) + ' ' + scores;
}