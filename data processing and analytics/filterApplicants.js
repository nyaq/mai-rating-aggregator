module.exports.filterExceptName = function filterExceptName(applicantsTable,
    { FIO, rusScores, dormRequired, originalsInMai, originalsIsNotInOtherUni }) {

    applicantsTable = applicantsTable.filter(applicant => {
        if (identifyWithFioAndRusScore(applicant, FIO, rusScores))
            return true;

        if (originalsInMai)
            if (!applicant['Согласие на зачисление'])
                return false;

        if (dormRequired)
            if (!applicant['Нуждаемость в общежитии'])
                return false;

        if (originalsIsNotInOtherUni)
            if (applicant['Подано согласие в другой вуз'])
                return false;

        return true;
    });

    return applicantsTable;
};

function identifyWithFioAndRusScore(applicant, FIO, rusScores) {
    // if (getShrinkedName(applicant['ФИО']) === getShrinkedName(FIO)) debugger
    // if (applicant['ФИО'].includes('Бояр')) debugger
    const rus = applicant['Р'] || applicant['рус']

    return getShrinkedName(applicant['ФИО']) === getShrinkedName(FIO) &&
        Number(rus) === Number(rusScores);
}

module.exports.findOnesPlace = function (table, FIO, rusScores) {
    // Add 1 since index is starting from zero
    return 1 + table.findIndex(applicant => identifyWithFioAndRusScore(applicant, FIO, rusScores));
};

module.exports.getScoresByRatingPosition = function (table, position) {
    return Number(table[position - 1]['Сумма конкурсных баллов']);
};

module.exports.getShrinkedName = getShrinkedName;

function getShrinkedName(applicantOrFio) {
    let fio = applicantOrFio['ФИО'] || applicantOrFio;

    if (typeof fio !== 'string')
        throw new Error('FIO should be either a string or an applicant! But fio is', typeof fio, fio);

    fio = fio.toLowerCase();

    fio = fio.replace(/ё/gi, 'е');
    fio = fio.replace(/ë/gi, 'е');

    return fio;
}