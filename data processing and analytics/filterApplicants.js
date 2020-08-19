module.exports.filterExceptName = function filterExceptName(applicantsTable,
    { FIO, dormRequired, originalsInMai, originalsIsNotInOtherUni }) {

    applicantsTable = applicantsTable.filter(applicant => {
        if (getShrinkedName(applicant['ФИО']) === getShrinkedName(FIO))
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

module.exports.findOnesPlace = function (table, FIO) {
    // Add 1 since index is starting from zero
    return 1 + table.findIndex(applicant =>
        // applicant['ФИО'].toLowerCase() === FIO.toLowerCase()
        getShrinkedName(applicant['ФИО']) === getShrinkedName(FIO)
    );
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

    fio = fio.replace(/ё/g, 'е');

    return fio;
}