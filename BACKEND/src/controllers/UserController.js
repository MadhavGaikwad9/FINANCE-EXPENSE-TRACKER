const User = require("../models/User");

// Update Currency
exports.updateCurrency = async (req, res) => {
    try {
        const { currency } = req.body;
        if (!currency || !["USD", "EUR", "INR", "GBP"].includes(currency)) {
            return res.status(400).json({ message: "Invalid currency code" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { currency },
            { new: true }
        ).select("-password");

        res.json({
            success: true,
            currency: user.currency,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Overall Monthly Budget Limit
exports.updateMonthlyBudget = async (req, res) => {
    try {
        const { monthlyBudget } = req.body;
        if (typeof monthlyBudget !== "number" || monthlyBudget < 0) {
            return res.status(400).json({ message: "Invalid budget limit value" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { monthlyBudget },
            { new: true }
        ).select("-password");

        res.json({
            success: true,
            monthlyBudget: user.monthlyBudget,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};