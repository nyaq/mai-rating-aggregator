module.exports = async function (MAIpage, onlyOriginals = false) {
    await MAIpage.waitFor(1500);

    // МАИ
    await waitNclick(MAIpage, '#place', "#place option:nth-child(2)");

    // Бакалавриат
    await waitNclick(MAIpage, '#level_select', "#level_select option:nth-child(2)");

    // Прикладная математика
    await waitNclick(MAIpage, '#spec_select', "#spec_select option:nth-child(2)");

    // Очная форма обучения
    await waitNclick(MAIpage, '#form_select', "#form_select option:nth-child(2)");

    // Бюджет
    await waitNclick(MAIpage, '#pay_select', "#pay_select option:nth-child(2)");

    // Согласие на зачисление
    if (onlyOriginals)
        await MAIpage.click('#original');

    return MAIpage;
};

async function waitNclick(MAIpage, clickSelector, optionSelector/* optionValue */) {
    await MAIpage.waitForSelector(clickSelector);
    await MAIpage.click(clickSelector);

    await MAIpage.waitFor(1500);

    // const optionSelector = `option[value="${optionValue}"]`;

    await MAIpage.waitForSelector(optionSelector);
    await MAIpage.click(optionSelector);
}