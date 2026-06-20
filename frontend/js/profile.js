const token = localStorage.getItem("token");

if (!token) {
alert("Please login first");

window.location.href = "index.html";

}

const userId =
localStorage.getItem("userId");

const profileForm =
document.getElementById("profile-form");

const backBtn =
document.getElementById("back-btn");

backBtn.addEventListener(
"click",
() => {

    window.location.href =
        "dashboard.html";

}

);

async function loadProfile() {
try {

    const response = await fetch(
        `https://finance-tracker-backend-voau.onrender.com/api/users/${userId}`
    );

    const user =
        await response.json();

    document.getElementById(
        "name"
    ).value =
        user.name;

    document.getElementById(
        "email"
    ).value =
        user.email;

} catch (error) {

    console.error(error);

    alert("Failed to load profile");

}

}

profileForm.addEventListener(
"submit",
async (e) => {

    e.preventDefault();

    const name =
        document.getElementById(
            "name"
        ).value;

    const password =
        document.getElementById(
            "password"
        ).value;

    try {

        const response =
            await fetch(
                `https://finance-tracker-backend-voau.onrender.com/api/users/${userId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        password
                    })
                }
            );

        const data =
            await response.json();

        alert(data.message);

    } catch (error) {

        console.error(error);

        alert(
            "Failed to update profile"
        );

    }

}
);

loadProfile();
