const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getSpendingSuggestion } = require("../controllers/aiControllers");

// GET /api/ai/suggestions
router.get("/suggestions", authMiddleware, getSpendingSuggestion);

module.exports = router;