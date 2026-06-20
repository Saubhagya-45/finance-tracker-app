const db = require("../config/db");
const bcrypt = require("bcrypt");

// Get User Profile
const getUserProfile = (req, res) => {

const { id } = req.params;

const sql =
    "SELECT id, name, email, created_at FROM users WHERE id = ?";

db.query(sql, [id], (err, results) => {

    if (err) {
        return res.status(500).json({
            message: "Database Error"
        });
    }

    if (results.length === 0) {
        return res.status(404).json({
            message: "User Not Found"
        });
    }

    res.status(200).json(results[0]);

});
};

// Update User Profile
const updateUserProfile = async (req, res) => {

const { id } = req.params;

const { name, password } = req.body;

try {

    let sql;
    let values;

    if (password && password.trim() !== "") {

        const hashedPassword =
            await bcrypt.hash(password, 10);

        sql =
            "UPDATE users SET name = ?, password = ? WHERE id = ?";

        values = [
            name,
            hashedPassword,
            id
        ];

    } else {

        sql =
            "UPDATE users SET name = ? WHERE id = ?";

        values = [
            name,
            id
        ];

    }

    db.query(sql, values, (err) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.status(200).json({
            message: "Profile Updated Successfully"
        });

    });

} catch (error) {

    console.error(error);

    res.status(500).json({
        message: "Server Error"
    });

}

};

module.exports = {
getUserProfile,
updateUserProfile
};
