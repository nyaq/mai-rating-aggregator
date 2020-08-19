const tableToJson = require('tabletojson').Tabletojson;
// const STUDY_FIELDS = require('./STUDY_FIELDS');
// const ADMLIST_URL = 'http://admlist.ru/mai/index.html';
const fs = require('fs-extra');
const PDFParser = require('pdf2json');
const { getShrinkedStudyField } = require('../data fetching/getStudyField');

const PATH = "./pdf2json/test.json";
const regexp = /\d\d[.]\d\d[.]\d\d \([\wа-яА-Я]*\) —[\s\w#&;а-яА-Я]*/gi;


(async function () {
    // const studyApplicantsMap = getStudyFieldToApplicantsWithDormMap('./1st wave.html');

    const studyFieldsData = JSON.parse(fs.readFileSync('./CONST/STUDY_FIELDS_COMBINED.json', { encoding: 'utf-8' }));
    studyFieldsData.forEach(studyField => {
        studyField[0] = studyField[1]['Код специальности'];
    });

    fs.writeFileSync('./CONST/STUDY_FIELDS_BY_CODE.json', JSON.stringify(studyFieldsData), { encoding: 'utf-8' });

})();


function getStudyFieldToApplicantsWithDormMap(path) {
    const html = fs.readFileSync(path, { encoding: 'utf-8' });

    const matches = html.match(regexp);
    const studies = html.split(regexp).slice(1);

    const applicantsGotDorm = studies.map(extractApplicantsGotDorm);


    const map = new Map();

    for (let i = 0; i < matches.length; i++) {
        const studyFieldName = matches[i];
        const applicants = applicantsGotDorm[i];

        map.set(studyFieldName, applicants);
    }

    return map;
}

function extractApplicantsGotDorm(html) {
    const dorm = html.split(/С предоставлением места в общежитии/)[1];

    if (!dorm)
        return [];

    // Make regexp for extracting applicants
    const trash = `[%/@!\\(\\)\\-#;:"'=<>&^\\s\\w\\d]*`;
    // номер в списке, рег. номер, ФИО, год рождения, гражданство
    const regexpStr = [`(\\d{1,3})</p>`, `([а-яё]{1,4}-\\d{1,5}-\\d{1,20})`, `([а-яё\\-\\s]*)`, `(\\d{4})`, `([а-яё()]*)`,
        // баллы за предметы, ид, сумма баллов
        `(\\d{1,3})`, `(\\d{1,3})`, `(\\d{1,3})`, `(\\d{1,2})`, `(\\d{1,3})`]
        .join(trash);
    const regexp = new RegExp(regexpStr, 'gim');

    const resultsRaw = [...dorm.matchAll(regexp)];
    console.log('Found', resultsRaw.length, 'applicants that got dorm');

    const results = resultsRaw.map(fields => {
        applicant = {};

        applicant['№'] = fields[1];
        applicant['Рег. номер'] = fields[2];
        applicant['ФИО'] = fields[3];
        applicant['Год рождения'] = fields[4];
        applicant['Гражданство'] = fields[5];
        applicant['1 экз'] = fields[6];
        applicant['2 экз'] = fields[7];
        applicant['3 экз'] = fields[8];
        applicant['Индивидуальные достижения'] = fields[9];
        applicant['Сумма баллов'] = fields[10];

        return applicant;
    });

    return results;
}

function processPDF() {
    const file = fs.readFileSync("./pdf2json/test.json", { encoding: "utf8" });
    const parsed = decodeURI(file);
    const json = JSON.parse(parsed);

    debugger
}
function readPDF() {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.ensureFileSync("./pdf2json/test.json");
        fs.writeFileSync("./pdf2json/test.json", JSON.stringify(pdfData));
    });

    // const file = await fs.readFile('./1st wave.pdf', { encoding: 'utf-8' });

    pdfParser.loadPDF('./1st wave.pdf');
}

// (async function () {
//     const admlistStudyFields = await tableToJson.convertUrl(ADMLIST_URL);
//     const admlistStudyFieldsHTML = await tableToJson.convertUrl(ADMLIST_URL, { stripHtmlFromCells: false });
//     let studyFields = admlistStudyFields[1].slice(1);
//     const studyFieldsHTML = admlistStudyFieldsHTML[1].slice(1);

//     studyFields.forEach((field, index) => {
//         const htmlLink = studyFieldsHTML[index]['Специальность, ОП'];
//         const linkRaw = htmlLink.match(/href=".*"/)[0];
//         // cut href=""
//         const link = linkRaw.slice(6, linkRaw.length - 1);

//         field.admlistURL = `http://admlist.ru/mai/${link}`;
//     });

//     const studyFieldsWithCodes = studyFields.map(study =>
//         [study['Специальность, ОП'].match(/\d\d[.]\d\d[.]\d\d/)[0], study]
//     );
//     const studyMap = new Map(studyFieldsWithCodes);

//     // const notInMap = [];

//     for (const STUDY in STUDY_FIELDS) {
//         const maiQuery = STUDY_FIELDS[STUDY];
//         const code = STUDY.match(/\d\d[.]\d\d[.]\d\d/)[0];

//         const admStudy = studyMap.get(code);
//         admStudy.maiQuery = maiQuery;
//     }

//     const result = Array.from(studyMap.values());

//     const array = result.map(res => [res['Специальность, ОП'], res]);
//     const jsonString = JSON.stringify(array, null, 4);

//     fs.writeJson('./FS-JSON.json', array, { replacer: null, spaces: 4 })
// })();