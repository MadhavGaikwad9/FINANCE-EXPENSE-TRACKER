const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    createRecurringPayment,
    getRecurringPayments,
    updateRecurringPayment,
    deleteRecurringPayment
} = require("../controllers/recurringController");

// Recurring Payments endpoints
router.post("/", authMiddleware, createRecurringPayment);
router.get("/", authMiddleware, getRecurringPayments);
router.put("/:id", authMiddleware, updateRecurringPayment);
router.delete("/:id", authMiddleware, deleteRecurringPayment);

module.exports = router;
