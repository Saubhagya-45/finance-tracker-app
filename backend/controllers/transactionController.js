const db = require("../config/db");

// Add Transaction
const addTransaction = (req, res) => {

    const {
        user_id,
        description,
        amount,
        type,
        category
    } = req.body;

    const sql = `
        INSERT INTO transactions
        (user_id, description, amount, type, category)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            description,
            amount,
            type,
            category
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            res.status(201).json({
                message: "Transaction Added Successfully"
            });

        }
    );

};

// Get Transactions By User
const getTransactions = (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT *
        FROM transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            res.status(200).json(results);

        }
    );

};

// Update Transaction
const updateTransaction = (req, res) => {

    const { id } = req.params;

    const {
        description,
        amount,
        type,
        category
    } = req.body;

    const sql = `
        UPDATE transactions
        SET description = ?,
            amount = ?,
            type = ?,
            category = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            description,
            amount,
            type,
            category,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            res.status(200).json({
                message: "Transaction Updated Successfully"
            });

        }
    );

};

// Delete Transaction
const deleteTransaction = (req, res) => {

    const { id } = req.params;

    const sql =
        "DELETE FROM transactions WHERE id = ?";

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            res.status(200).json({
                message:
                    "Transaction Deleted Successfully"
            });

        }
    );

};

module.exports = {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};