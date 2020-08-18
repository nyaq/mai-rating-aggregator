const { filterExceptName, findOnesPlace } = require('./filterApplicants');

module.exports = function (FIO, applicants) {
    const dormRequired = filterExceptName(applicants, {
        FIO, dormRequired: true,
    });

    const originalsInMai = filterExceptName(applicants, {
        FIO, originalsInMai: true,
    });

    const originalsNotInOtherUni = filterExceptName(applicants, {
        FIO, originalsIsNotInOtherUni: true,
    });

    const dormRequiredOriginalsInMai = filterExceptName(applicants, {
        FIO, dormRequired: true, originalsInMai: true,
    });

    const dormRequiredExcludeOriginalsInOtherUni = filterExceptName(applicants, {
        FIO, dormRequired: true, originalsIsNotInOtherUni: true,
    });

    return [{
        description: 'Место в полном списке',
        place: findOnesPlace(applicants, FIO)
    }, {
        description: 'Среди нуждающихся в общежитии',
        place: findOnesPlace(dormRequired, FIO)
    }, {
        description: 'Среди подавших оригинал на это направление',
        place: findOnesPlace(originalsInMai, FIO)
    }, {
        description: 'Среди подавших оригинал на это направление И нуждающихся в общежитии',
        place: findOnesPlace(dormRequiredOriginalsInMai, FIO)
    }, {
        description: 'Среди НЕ подавших оригинал на ДРУГИЕ направления',
        place: findOnesPlace(originalsNotInOtherUni, FIO)
    }, {
        description: 'Среди нуждающихся в общежитии И НЕ подавших оригинал на ДРУГИЕ направления',
        place: findOnesPlace(dormRequiredExcludeOriginalsInOtherUni, FIO)
    },
    ];
};