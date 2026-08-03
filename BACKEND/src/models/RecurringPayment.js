const mongoose = require("mongoose");

const RecurringPaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "monthly"
    },
    nextDueDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("RecurringPayment", RecurringPaymentSchema);
