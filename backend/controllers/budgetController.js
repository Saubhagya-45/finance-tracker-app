const db = require("../config/db");

// Add Budget
const addBudget = (req, res) => {


const {
    user_id,
    category,
    budget_amount
} = req.body;

const sql = `
    INSERT INTO budgets
    (user_id, category, budget_amount)
    VALUES (?, ?, ?)
`;

db.query(
    sql,
    [user_id, category, budget_amount],
    (err) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        res.status(201).json({
            message: "Budget Added Successfully"
        });

    }
);
};

// Get User Budgets with Spending
const getBudgets = (req, res) => {

const { userId } = req.params;

const sql = `
    SELECT
        b.id,
        b.category,
        b.budget_amount,

        COALESCE(
            SUM(
                CASE
                    WHEN t.type = 'Expense'
                    THEN t.amount
                    ELSE 0
                END
            ),
            0
        ) AS spent

    FROM budgets b

    LEFT JOIN transactions t
        ON b.user_id = t.user_id
        AND b.category = t.category

    WHERE b.user_id = ?

    GROUP BY
        b.id,
        b.category,
        b.budget_amount

    ORDER BY b.category
`;

db.query(
    sql,
    [userId],
    (err, results) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        res.status(200).json(results);

    }
);

};

module.exports = {
addBudget,
getBudgets
};
