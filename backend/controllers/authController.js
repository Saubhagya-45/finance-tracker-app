const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {

                if (err) {

    console.log("SIGNUP ERROR:", err);

    return res.status(500).json({
        message: err.sqlMessage || err.message
    });
}

                res.status(201).json({
                    message: "User registered successfully"
                });
            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }
};

const login = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {

    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
        message: err.sqlMessage || err.message
    });
}

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

        res.status(200).json({
    message: "Login Successful",
    token,
    userId: user.id
});

    });
};
module.exports = {
    signup,
    login
};