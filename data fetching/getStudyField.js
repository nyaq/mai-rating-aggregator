const fs = require('fs-extra');

const STUDY_FIELDS_PATH = './CONST/STUDY_FIELDS_COMBINED.json';
const STUDY_FIELDS_BY_CODEPATH = './CONST/STUDY_FIELDS_BY_CODE.json';


let _studyFieldsMap;
async function loadStudyFieldsMap() {
    if (_studyFieldsMap) return _studyFieldsMap;

    const file = await fs.readFile(STUDY_FIELDS_PATH, { encoding: 'utf-8' });
    const json = JSON.parse(file);

    _studyFieldsMap = new Map(json);

    return _studyFieldsMap;
}
let _studyFieldsByCodeMap;
async function loadStudyFieldsByCodeMap() {
    if (_studyFieldsByCodeMap) return _studyFieldsByCodeMap;

    const file = await fs.readFile(STUDY_FIELDS_BY_CODEPATH, { encoding: 'utf-8' });
    const json = JSON.parse(file);

    _studyFieldsByCodeMap = new Map(json);

    return _studyFieldsByCodeMap;
}

module.exports.getStudyField = async function (studyFieldRaw) {
    const studyFieldShrinkedName = getShrinkedStudyField(studyFieldRaw);

    // check if studyField code is provided
    if (studyFieldShrinkedName.length == 0)
        return getStudyFieldByCode(studyFieldRaw);

    const studyFieldsMap = await loadStudyFieldsMap();
    const resultingStudyField = studyFieldsMap.get(studyFieldShrinkedName);

    console.log('Got study field "' + resultingStudyField['Специальность, ОП'] + '" by code "' + code + '"');

    return resultingStudyField;
};


async function getStudyFieldByCode(code) {
    code = code.match(/\d\d\.\d\d\.\d\d/)[0];

    const studyFieldsMap = await loadStudyFieldsByCodeMap();
    const resultingStudyField = studyFieldsMap.get(code);

    console.log('Got study field "' + resultingStudyField['Специальность, ОП'] + '" by code "' + code + '"');

    return resultingStudyField;
}

function getShrinkedStudyField(studyFieldRaw) {
    return (studyFieldRaw.toLowerCase()
        .replace(/[^а-я]/g, '')
        .replace(/[ьъ]/g, '')
        .replace(/ё/g, 'е')
        .replace(/й/g, 'и')
    );
}

module.exports.getShrinkedStudyField = getShrinkedStudyField;
module.exports.getStudyFieldByCode = getStudyFieldByCode;