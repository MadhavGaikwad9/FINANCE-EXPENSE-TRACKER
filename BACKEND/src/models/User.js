const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "INR", "GBP"],
        default: "INR"
    },
    monthlyBudget: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
