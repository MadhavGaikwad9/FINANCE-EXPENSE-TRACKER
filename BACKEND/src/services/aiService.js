const generateSuggestion = async (data) => {

    const {
        category,
        currentExpense,
        previousExpense
    } = data;


    const increase =
        ((currentExpense - previousExpense)
        / previousExpense) * 100;


    let suggestion = "";


    if(increase > 20){

        suggestion =
        `Your ${category} expenses increased by ${increase.toFixed(0)}%.
        Recommended ${category} budget:
        $350/month`;

    }
    else{

        suggestion =
        `Your ${category} spending is under control.`;

    }


    return suggestion;

};


module.exports = generateSuggestion;