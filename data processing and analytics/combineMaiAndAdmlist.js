const { getShrinkedName } = require('./filterApplicants');

module.exports = function combineApplicants(flattenTable, admlist) {
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
            console.log('An applicant is undefined!');
        }

        combinedTable.push(combinedApplicant);
    }

    return combinedTable;
}

function combineMismatchedApplicants(maiApplicant, notInMaiMap) {
    const shrinkedName = getShrinkedName(maiApplicant);

    // If they have different scores
    if (notInMaiMap.has(shrinkedName)) {
        console.log('Combined mismatched applicants with shrinkedName');
        return combineTwoApplicants(maiApplicant, notInMaiMap.get(shrinkedName));
    }
    else {
        return combineTwoApplicants(maiApplicant, null);
    }
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