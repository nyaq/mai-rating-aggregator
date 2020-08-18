module.exports.filterExceptName = function filterExceptName(applicantsTable,
    { FIO, dormRequired, originalsInMai, originalsIsNotInOtherUni }) {

    applicantsTable = applicantsTable.filter(applicant => {
        if (applicant['ФИО'] === FIO)
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
        applicant['ФИО'].toLowerCase() === FIO.toLowerCase()
    );
};