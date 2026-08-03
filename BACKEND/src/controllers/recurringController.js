const RecurringPayment = require("../models/RecurringPayment");

// Create Recurring Payment
exports.createRecurringPayment = async (req, res) => {
    try {
        const { title, amount, category, frequency, nextDueDate } = req.body;

        if (!title || !amount || !category || !nextDueDate) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const payment = await RecurringPayment.create({
            userId: req.user.id,
            title,
            amount,
            category,
            frequency: frequency || "monthly",
            nextDueDate: new Date(nextDueDate)
        });

        res.status(201).json({
            success: true,
            payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all user's recurring payments
exports.getRecurringPayments = async (req, res) => {
    try {
        const payments = await RecurringPayment.find({ userId: req.user.id });
        res.json({
            success: true,
            payments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle active state or update amount
exports.updateRecurringPayment = async (req, res) => {
    try {
        const { title, amount, category, frequency, nextDueDate, active } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (amount !== undefined) updateData.amount = amount;
        if (category !== undefined) updateData.category = category;
        if (frequency !== undefined) updateData.frequency = frequency;
        if (nextDueDate !== undefined) updateData.nextDueDate = new Date(nextDueDate);
        if (active !== undefined) updateData.active = active;

        const payment = await RecurringPayment.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updateData,
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: "Recurring payment not found" });
        }

        res.json({
            success: true,
            payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Recurring Payment
exports.deleteRecurringPayment = async (req, res) => {
    try {
        const payment = await RecurringPayment.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!payment) {
            return res.status(404).json({ message: "Recurring payment not found" });
        }

        res.json({
            success: true,
            message: "Recurring payment schedule deleted",
            id: req.params.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
