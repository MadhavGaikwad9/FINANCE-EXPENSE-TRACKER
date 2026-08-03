const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { updateCurrency, updateMonthlyBudget } = require("../controllers/UserController");

// PUT /api/user/currency
router.put("/currency", authMiddleware, updateCurrency);

// PUT /api/user/budget
router.put("/budget", authMiddleware, updateMonthlyBudget);

module.exports = router;
