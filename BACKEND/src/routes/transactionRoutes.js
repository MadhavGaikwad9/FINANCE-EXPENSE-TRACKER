const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    addTransaction,
    getTransactions,
    deleteTransaction,
    getExpenseAnalytics,
    getBudgets,
    updateBudget,
    deleteBudget
} = require("../controllers/TransactionControllers");

// Transactions CRUD
router.post("/", authMiddleware, addTransaction);
router.get("/", authMiddleware, getTransactions);
router.delete("/:id", authMiddleware, deleteTransaction);

// Analytics
router.get("/analytics", authMiddleware, getExpenseAnalytics);

// Budgets CRUD
router.get("/budgets", authMiddleware, getBudgets);
router.post("/budgets", authMiddleware, updateBudget);
router.delete("/budgets/:id", authMiddleware, deleteBudget);

module.exports = router;
