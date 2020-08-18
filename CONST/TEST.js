const tableToJson = require('tabletojson').Tabletojson;
const STUDY_FIELDS = require('./STUDY_FIELDS');
const { fstat } = require('fs-extra');
const ADMLIST_URL = 'http://admlist.ru/mai/index.html';
const fs = require('fs-extra');

(async function () {
    const admlistStudyFields = await tableToJson.convertUrl(ADMLIST_URL);
    const admlistStudyFieldsHTML = await tableToJson.convertUrl(ADMLIST_URL, { stripHtmlFromCells: false });
    let studyFields = admlistStudyFields[1].slice(1);
    const studyFieldsHTML = admlistStudyFieldsHTML[1].slice(1);

    studyFields.forEach((field, index) => {
        const htmlLink = studyFieldsHTML[index]['Специальность, ОП'];
        const linkRaw = htmlLink.match(/href=".*"/)[0];
        // cut href=""
        const link = linkRaw.slice(6, linkRaw.length - 1);

        field.admlistURL = `http://admlist.ru/mai/${link}`;
    });

    const studyFieldsWithCodes = studyFields.map(study =>
        [study['Специальность, ОП'].match(/\d\d[.]\d\d[.]\d\d/)[0], study]
    );
    const studyMap = new Map(studyFieldsWithCodes);

    // const notInMap = [];

    for (const STUDY in STUDY_FIELDS) {
        const maiQuery = STUDY_FIELDS[STUDY];
        const code = STUDY.match(/\d\d[.]\d\d[.]\d\d/)[0];

        const admStudy = studyMap.get(code);
        admStudy.maiQuery = maiQuery;
    }

    const result = Array.from(studyMap.values());

    const array = result.map(res => [res['Специальность, ОП'], res]);
    const jsonString = JSON.stringify(array, null, 4);

    fs.writeJson('./FS-JSON.json', array, { replacer: null, spaces: 4 })
})();