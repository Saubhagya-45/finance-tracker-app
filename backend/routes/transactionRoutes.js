const express = require("express");
const router = express.Router();

const {
    addTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction
} = require("../controllers/transactionController");

router.post("/", addTransaction);

router.get("/:userId", getTransactions);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

module.exports = router;