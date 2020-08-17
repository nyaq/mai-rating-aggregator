module.exports = function (maiTables, admlist) {
    const flattenTable = prepareMaiData(maiTables);
    admlist = prepareAdmlistData(admlist);

    const combinedTable = combineApplicants(flattenTable, admlist);

    return combinedTable;
};

function prepareMaiData(maiTables) {
    // На сайте не пишут, но БВИ предполагает согласие на зачисление
    maiTables[0].forEach(applicant => applicant['Согласие на зачисление'] = ' 	✓');

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
function prepareAdmlistData({ table: admlist, tableHTML }) {
    // Проверяет, подал ли абитуриент согласие в другой вуз 
    // (тогда этот вуз будет выделен жирным на admlist)
    admlist.forEach((applicant, index) =>
        applicant['Подано согласие в другой вуз'] = tableHTML[index]['Другие ОП'].includes('<b>')
    );

    admlist.forEach(applicant => applicant.id = getApplicantId(applicant));

    return admlist;
}

function combineApplicants(flattenTable, admlist) {
    //test if there are duplicates
    const fioPlusRus = flattenTable.map(maiApplicant =>
        [maiApplicant.id, [maiApplicant]]
    );
    const fioPlusRusMap = new Map(fioPlusRus);

    // { shrinked fio, applicant}
    const notInMaiMap = new Map();

    admlist.forEach(admApplicant => {

        if (fioPlusRusMap.has(admApplicant.id)) {
            maiApp = fioPlusRusMap.get(admApplicant.id);
            maiApp.push(admApplicant);
        } else
            // notInMaiList.push(admApplicant);
            notInMaiMap.set(getShrinkedName(admApplicant), admApplicant);

    });

    // notInMaiList.filter(applicant => applicant['∑'] !== 0);

    const combinedTable = [];

    // combine
    for (const applicantsData of fioPlusRusMap) {
        let applicants = applicantsData[1];
        // no match
        if (applicants.length === 1) {
            const combinedApplicant = combineMismatchedApplicants(applicants[0], notInMaiMap);

            combinedTable.push(combinedApplicant);
            continue;
        }
        // too much matches
        else if (applicants.length >= 3) {
            console.log('three or more applicants!!!!');
            console.log('applicants :>> ', applicants);
        }

        // anyways, combine
        const combinedApplicant = combineTwoApplicants(applicants[0], applicants[1]);

        if (!combinedApplicant) {
            debugger;
            console.log('An aspplicant is undefined!');
        }

        combinedTable.push(combinedApplicant);
    }

    return combinedTable;
}

function combineMismatchedApplicants(maiApplicant, notInMaiMap) {
    const shrinkedName = getShrinkedName(maiApplicant);

    // If they have different scores
    if (notInMaiMap.has(shrinkedName))
        return combineTwoApplicants(maiApplicant, notInMaiMap.get(shrinkedName));
    else
        return combineTwoApplicants(maiApplicant, null);
}

function combineTwoApplicants(maiApplicant, admApplicant) {
    const uselessProps = ['∑'];

    // Add everything excluding uselessProps
    for (const prop in admApplicant) {
        if (admApplicant.hasOwnProperty(prop) && !uselessProps.includes(prop)) {
            maiApplicant[prop] = admApplicant[prop];
        }
    }

    // fill empty props

    if (admApplicant === null)
        console.log('admApplicant is null, not filling any props');

    return maiApplicant;
}

function getApplicantId(applicant) {
    const scores = applicant['Сумма конкурсных баллов'] || applicant['∑'] || 0;

    return getShrinkedName(applicant) + ' ' + scores;
}

function getShrinkedName(applicant) {
    let fio = applicant['ФИО'].toLowerCase();

    fio = fio.replace(/ё/g, 'е');

    return fio;
}