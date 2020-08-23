const { getShrinkedName } = require('./filterApplicants');

module.exports.prepareMaiData = function prepareMaiData(maiTables) {
    // На сайте не пишут, но БВИ предполагает согласие на зачисление
    if (!maiTables) {
        throw new Error('Получил пустые данные с сайта маи. Проверь, правильно ли ты ввёл направление!');
    }

    if (maiTables.length > 1)
        maiTables[0].forEach(applicant => applicant['Согласие на зачисление'] = '✓');

    maiTables[0] = maiTables[0] || [];
    maiTables[1] = maiTables[1] || [];
    maiTables[2] = maiTables[2] || [];
    maiTables[3] = maiTables[3] || [];


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

    console.log('Prepared MAI table, its length is', flattenTable.length);

    return flattenTable;
}
module.exports.prepareAdmlistData = function prepareAdmlistData({ table: admlist, tableHTML }) {
    // Проверяет, подал ли абитуриент согласие в другой вуз 
    // (тогда этот вуз будет выделен жирным на admlist)
    admlist = admlist || [];

    admlist.forEach((applicant, index) =>
        applicant['Подано согласие в другой вуз'] = tableHTML[index]['Другие ОП'].includes('<b>')
    );

    admlist.forEach(applicant => applicant.id = getApplicantId(applicant));


    console.log('Prepared ADMlist table, its length is', admlist.length);

    return admlist;
}

function getApplicantId(applicant) {
    const scores = applicant['Сумма конкурсных баллов'] || applicant['∑'] || 0;

    return getShrinkedName(applicant) + ' ' + scores;
}