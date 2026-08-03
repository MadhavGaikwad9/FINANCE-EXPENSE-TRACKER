const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const User = require("../models/User");

exports.getSpendingSuggestion = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch user transactions
        const transactions = await Transaction.find({ userId });
        const budgets = await Budget.find({ userId });

        if (transactions.length === 0) {
            return res.json({
                success: true,
                suggestion: "Welcome to your AI Financial Advisor! Start by adding transactions to unlock dynamic, personalized financial recommendations."
            });
        }

        // Calculations
        let totalIncome = 0;
        let totalExpense = 0;
        const categoryMap = {};

        transactions.forEach(t => {
            if (t.type === "income") {
                totalIncome += t.amount;
            } else {
                totalExpense += t.amount;
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            }
        });

        const netSavings = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100) : 0;

        let suggestionsList = [];

        // 1. Check Savings Rate Status
        if (savingsRate < 0) {
            suggestionsList.push(`⚠️ WARNING: You are running a deficit of ${user.currency || "INR"} ${Math.abs(netSavings).toLocaleString()}. Your expenses exceed your income. We recommend identifying non-essential subscriptions or lifestyle purchases to cut immediately.`);
        } else if (savingsRate < 15) {
            suggestionsList.push(`💡 BUDGET TIP: Your current savings rate is ${savingsRate.toFixed(1)}%. Aiming for at least 20% is recommended. Try allocating 50% for needs, 30% for wants, and 20% directly into savings.`);
        } else {
            suggestionsList.push(`🎉 GREAT JOB: Your savings rate is a healthy ${savingsRate.toFixed(1)}%! Consider setting up an automated investment plan for your surplus funds.`);
        }

        // 2. Budget limits checking
        let budgetWarnings = 0;
        budgets.forEach(b => {
            const spent = categoryMap[b.category] || 0;
            if (spent > b.limit) {
                suggestionsList.push(`🚨 BUDGET EXCEEDED: You spent ${user.currency || "INR"} ${spent.toLocaleString()} on "${b.category}", which exceeds your category budget limit of ${user.currency || "INR"} ${b.limit.toLocaleString()} by ${((spent - b.limit) / b.limit * 100).toFixed(0)}%.`);
                budgetWarnings++;
            } else if (spent > b.limit * 0.8) {
                suggestionsList.push(`⚠️ WARNING: You have utilized ${((spent / b.limit) * 100).toFixed(0)}% of your "${b.category}" budget (${spent}/${b.limit}). Try to put a freeze on this category for the remainder of the month.`);
            }
        });

        // 3. Highest categories advice
        const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
        if (sortedCategories.length > 0) {
            const [topCategory, topAmount] = sortedCategories[0];
            const pctOfExpenses = totalExpense > 0 ? ((topAmount / totalExpense) * 100) : 0;
            if (pctOfExpenses > 35) {
                suggestionsList.push(`📈 INSIGHT: "${topCategory}" is your highest expense category, making up ${pctOfExpenses.toFixed(0)}% of your overall monthly spending. Look for alternatives or ways to optimize costs in this specific category.`);
            }
        }

        // Fallback
        if (suggestionsList.length === 0) {
            suggestionsList.push("Your expenses are well distributed. Keep tracking details to maintain this trajectory.");
        }

        // Joint advice
        const responseAdvice = suggestionsList.join("\n\n");

        res.json({
            success: true,
            suggestion: responseAdvice,
            metrics: {
                totalIncome,
                totalExpense,
                netSavings,
                savingsRate: parseFloat(savingsRate.toFixed(1)),
                budgetWarnings
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};