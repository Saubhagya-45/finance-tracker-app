const express = require("express");

const router = express.Router();

const {
    addBudget,
    getBudgets
} = require("../controllers/budgetController");

router.post("/", addBudget);

router.get("/:userId", getBudgets);

module.exports = router;