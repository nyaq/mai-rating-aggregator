// module.exports.findIndexByName = function findIndexByName(tables, FIO) {
//     console.log('findIndexByName is REEEALLY deprecated!');
//     return tables[3].findIndex(
//         applicant => applicant['ФИО'] === FIO
//     );
// }
// module.exports.findPlaceByName = function findPlaceByName(tables, FIO) {
//     console.log('findPlaceByName is deprecated!');

//     // учесть БВИ, целевиков, особую квоту
//     return tables[0].length +
//         tables[1].length +
//         tables[2].length +
//         findIndexByName(tables, FIO) + 1; // нумерация с единицы 
// }
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


    // // если оригинал в маи, оригинал точно не в другом вузе
    // if (originalsInMai)
    //     applicantTable = applicantTable.filter(
    //         applicant => (applicant['Согласие на зачисление'] || applicant['ФИО'] === FIO)
    //     );

    // else if (originalsIsNotInOtherUni)
    //     applicantTable = applicantTable.map(applicant =>
    //         jk)

    // if (dormRequired)
    //     applicantTable = applicantTable.filter(
    //         applicant => (applicant['Нуждаемость в общежитии'] || applicant['ФИО'] === FIO)
    //     );

    return applicantsTable;
};

module.exports.findOnesPlace = function (table, FIO) {
    // Add 1 since index is starting from zero
    return 1 + table.findIndex(applicant =>
        applicant['ФИО'].toLowerCase() === FIO.toLowerCase()
    );
};