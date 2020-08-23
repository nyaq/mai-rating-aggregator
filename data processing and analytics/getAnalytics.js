const { filterExceptName, findOnesPlace } = require('./filterApplicants');

module.exports = function (FIO, rusScores, applicants) {
    const dormRequired = filterExceptName(applicants, {
        FIO, rusScores, dormRequired: true,
    });

    const originalsInMai = filterExceptName(applicants, {
        FIO, rusScores, originalsInMai: true,
    });

    const originalsNotInOtherUni = filterExceptName(applicants, {
        FIO, rusScores, originalsIsNotInOtherUni: true,
    });

    const dormRequiredOriginalsInMai = filterExceptName(applicants, {
        FIO, rusScores, dormRequired: true, originalsInMai: true,
    });

    const dormRequiredExcludeOriginalsInOtherUni = filterExceptName(applicants, {
        FIO, rusScores, dormRequired: true, originalsIsNotInOtherUni: true,
    });

    return [{
        description: 'Место в полном списке',
        place: findOnesPlace(applicants, FIO, rusScores)
    }, {
        description: 'Среди НЕ подавших согласие в другое место',
        place: findOnesPlace(originalsNotInOtherUni, FIO, rusScores)
    }, {
        description: 'Среди подавших согласие',
        place: findOnesPlace(originalsInMai, FIO, rusScores)
    }, {
        description: 'Среди нуждающихся в общежитии',
        place: findOnesPlace(dormRequired, FIO, rusScores)
    }, {
        description: 'Среди нуждающихся в общежитии И НЕ подавших согласие в другое место',
        place: findOnesPlace(dormRequiredExcludeOriginalsInOtherUni, FIO, rusScores)
    }, {
        description: 'Среди нуждающихся в общежитии И подавших согласие',
        place: findOnesPlace(dormRequiredOriginalsInMai, FIO, rusScores)
    }];
};