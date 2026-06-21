const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {

        const response = await fetch(
            "https://finance-tracker-backend-voau.onrender.com/api/auth/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Account created successfully! Redirecting to Login Page...");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error("Signup Error:", error);

        alert("Server Error. Please try again later.");

    }

});