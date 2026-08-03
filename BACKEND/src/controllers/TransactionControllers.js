const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const User = require("../models/User");
const { checkBudgetAlert } = require("../services/notificationServices");

// Add Transaction (Income or Expense)
exports.addTransaction = async (req, res) => {
    try {
        const { title, amount, category, type, description, date } = req.body;

        if (!title || !amount || !category || !type) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const transaction = await Transaction.create({
            userId: req.user.id,
            title,
            amount,
            category,
            type,
            description,
            date: date || new Date()
        });

        // Trigger real-time budget checking if it is an expense
        if (type === "expense") {
            // Calculate total category expenses in current month
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const endOfMonth = new Date();
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            endOfMonth.setDate(0);
            endOfMonth.setHours(23, 59, 59, 999);

            const categoryExpenses = await Transaction.aggregate([
                {
                    $match: {
                        userId: transaction.userId,
                        type: "expense",
                        category: category,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const categorySpent = categoryExpenses.length > 0 ? categoryExpenses[0].total : 0;

            // 1. Check category-specific budget
            const budgetObj = await Budget.findOne({
                userId: req.user.id,
                category: category
            });

            if (budgetObj) {
                checkBudgetAlert(req.user.id, category, categorySpent, budgetObj.limit);
            }

            // 2. Check overall user monthly budget
            const userObj = await User.findById(req.user.id);
            if (userObj && userObj.monthlyBudget > 0) {
                const totalExpenses = await Transaction.aggregate([
                    {
                        $match: {
                            userId: transaction.userId,
                            type: "expense",
                            date: { $gte: startOfMonth, $lte: endOfMonth }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$amount" }
                        }
                    }
                ]);

                const overallSpent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
                checkBudgetAlert(req.user.id, "Overall Monthly", overallSpent, userObj.monthlyBudget);
            }
        }

        res.status(201).json({
            success: true,
            transaction
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Transactions (with filtering and search)
exports.getTransactions = async (req, res) => {
    try {
        const { type, category, search } = req.query;
        let query = { userId: req.user.id };

        if (type) {
            query.type = type;
        }
        if (category) {
            query.category = category;
        }
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Sort by newest date first
        const data = await Transaction.find(query).sort({ date: -1 });
        res.json({
            success: true,
            transactions: data
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({
            success: true,
            message: "Transaction deleted successfully",
            id: req.params.id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Expense Analytics (by Category & Monthly progression)
exports.getExpenseAnalytics = async (req, res) => {
    try {
        // Aggregated category spending for Pie Chart
        const categoryAnalytics = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user.id,
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Monthly totals for current year for Bar Chart (6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyAnalytics = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user.id,
                    type: "expense",
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            categoryAnalytics,
            monthlyAnalytics
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Budgets endpoints inside transaction controller
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.json({
            success: true,
            budgets
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBudget = async (req, res) => {
    try {
        const { category, limit } = req.body;
        if (!category || typeof limit !== "number" || limit < 0) {
            return res.status(400).json({ message: "Invalid budget payload" });
        }

        const budget = await Budget.findOneAndUpdate(
            { userId: req.user.id, category },
            { limit },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            budget
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.json({
            success: true,
            message: "Budget limit cleared",
            id: req.params.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};