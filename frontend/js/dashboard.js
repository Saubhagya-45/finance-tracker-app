const token = localStorage.getItem("token");

let expenseChart = null;
let monthlyExpenseChart = null;

// Protect Dashboard
if (!token) {
alert("Please login first");
window.location.href = "index.html";
}

// Logout
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", () => {


localStorage.removeItem("token");
localStorage.removeItem("userId");

alert("Logged Out Successfully");

window.location.href = "index.html";


});
const profileBtn =
document.getElementById("profile-btn");

if (profileBtn) {
    

profileBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "profile.html";

    }
);


}

// Add Transaction
const transactionForm =
document.getElementById("transaction-form");

transactionForm.addEventListener(
"submit",
async (e) => {


    e.preventDefault();

    const description =
        document.getElementById("description").value;

    const amount =
        document.getElementById("amount").value;

    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    try {

        const response = await fetch(
            "https://finance-tracker-backend-voau.onrender.com/api/transactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: localStorage.getItem("userId"),
                    description,
                    amount,
                    type,
                    category
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        transactionForm.reset();

        loadTransactions();

    } catch (error) {

        console.error(error);

        alert("Failed to add transaction");

    }

}


);


function renderExpenseChart(transactions) {


const categoryTotals = {};

transactions.forEach(transaction => {

    if (transaction.type === "Expense") {

        const category =
            transaction.category || "Other";

        categoryTotals[category] =
            (categoryTotals[category] || 0)
            + Number(transaction.amount);

    }

});

const labels =
    Object.keys(categoryTotals);

const values =
    Object.values(categoryTotals);

const ctx =
    document.getElementById("expenseChart");

if (!ctx) return;

if (expenseChart) {
    expenseChart.destroy();
}

expenseChart = new Chart(ctx, {

    type: "pie",

    data: {

        labels,

        datasets: [
            {
                data: values
            }
        ]

    },

    options: {

        responsive: true,

        plugins: {
            legend: {
                position: "bottom"
            }
        }

    }

});


}
function renderMonthlyExpenseChart(transactions) {


const monthlyTotals = {};

transactions.forEach(transaction => {

    if (transaction.type === "Expense") {

        const date =
            new Date(transaction.created_at);

        const month =
            date.toLocaleString(
                "default",
                { month: "short" }
            );

        monthlyTotals[month] =
            (monthlyTotals[month] || 0)
            + Number(transaction.amount);

    }

});

const months =
    Object.keys(monthlyTotals);

const amounts =
    Object.values(monthlyTotals);

const ctx =
    document.getElementById(
        "monthlyExpenseChart"
    );

if (!ctx) return;

if (monthlyExpenseChart) {
    monthlyExpenseChart.destroy();
}

monthlyExpenseChart =
    new Chart(ctx, {

        type: "bar",

        data: {

            labels: months,

            datasets: [
                {
                    label: "Monthly Expenses",
                    data: amounts
                }
            ]

        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });


}

async function loadTransactions() {


try {

    const userId = localStorage.getItem("userId");

    const response = await fetch(
        `https://finance-tracker-backend-voau.onrender.com/api/transactions/${userId}`
    );

    const transactions =
        await response.json();

    const transactionList =
        document.getElementById(
            "transaction-list"
        );

    transactionList.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {

        const li =
            document.createElement("li");

        if (
            transaction.type === "Income"
        ) {

            totalIncome +=
                Number(transaction.amount);

            li.innerHTML = `
                <span>
                    ${transaction.description}
                    (${transaction.category || "Other"})
                </span>

                <span class="positive">
                    + ₹${transaction.amount}
                </span>

                <button onclick="editTransaction(
                    ${transaction.id},
                    '${transaction.description}',
                    '${transaction.amount}',
                    '${transaction.type}',
                    '${transaction.category || "Other"}'
                )">
                    Edit
                </button>

                <button onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            `;

        } else {

            totalExpense +=
                Number(transaction.amount);

            li.innerHTML = `
                <span>
                    ${transaction.description}
                    (${transaction.category || "Other"})
                </span>

                <span class="negative">
                    - ₹${transaction.amount}
                </span>

                <button onclick="editTransaction(
                    ${transaction.id},
                    '${transaction.description}',
                    '${transaction.amount}',
                    '${transaction.type}',
                    '${transaction.category || "Other"}'
                )">
                    Edit
                </button>

                <button onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            `;

        }

        transactionList.appendChild(li);

    });

    document.getElementById(
        "income"
    ).textContent =
        `₹${totalIncome}`;

    document.getElementById(
        "expense"
    ).textContent =
        `₹${totalExpense}`;

    document.getElementById(
        "balance"
    ).textContent =
        `₹${totalIncome - totalExpense}`;

    renderExpenseChart(transactions);
    renderMonthlyExpenseChart(transactions);

} catch (error) {

    console.error(error);

}


}
async function editTransaction(
id,
oldDescription,
oldAmount,
oldType,
oldCategory
) {


const description =
    prompt(
        "Enter Description",
        oldDescription
    );

if (!description) return;

const amount =
    prompt(
        "Enter Amount",
        oldAmount
    );

if (!amount) return;

const type =
    prompt(
        "Income or Expense",
        oldType
    );

if (!type) return;

const category =
    prompt(
        "Enter Category",
        oldCategory
    );

if (!category) return;

try {

    const response = await fetch(
        `https://finance-tracker-backend-voau.onrender.com/api/transactions/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                description,
                amount,
                type,
                category
            })
        }
    );

    const data =
        await response.json();

    alert(data.message);

    loadTransactions();

} catch (error) {

    console.error(error);

    alert(
        "Failed to update transaction"
    );

}


}

async function deleteTransaction(id) {


const confirmDelete =
    confirm("Delete this transaction?");

if (!confirmDelete) return;

try {

    const response = await fetch(
        `https://finance-tracker-backend-voau.onrender.com/api/transactions/${id}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    alert(data.message);

    loadTransactions();

} catch (error) {

    console.error(error);

    alert("Failed to delete transaction");


}


}
const budgetForm =
    document.getElementById("budget-form");

if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const category =
                document.getElementById(
                    "budget-category"
                ).value;

            const budget_amount =
                document.getElementById(
                    "budget-amount"
                ).value;

            try {

                const response =
                    await fetch(
                        "https://finance-tracker-backend-voau.onrender.com/api/budgets",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                user_id:
                                    localStorage.getItem(
                                        "userId"
                                    ),
                                category,
                                budget_amount
                            })
                        }
                    );

                const data =
                    await response.json();

                alert(data.message);

                budgetForm.reset();

                loadBudgets();

            } catch (error) {

                console.error(error);

                alert(
                    "Failed to save budget"
                );

            }

        }
    );

}
async function loadBudgets() {

    try {

        const userId =
            localStorage.getItem("userId");

        const response =
            await fetch(
                `https://finance-tracker-backend-voau.onrender.com/api/budgets/${userId}`
            );

        const budgets =
            await response.json();

        const budgetList =
            document.getElementById(
                "budget-list"
            );

        if (!budgetList) return;

        budgetList.innerHTML = "";

        budgets.forEach((budget) => {

            const div =
                document.createElement("div");

            div.classList.add(
                "budget-card"
            );

            const spent =
    Number(budget.spent);

const budgetAmount =
    Number(budget.budget_amount);

const remaining =
    budgetAmount - spent;

let status = "";

if (remaining >= 0) {

    status =
        `✅ Remaining: ₹${remaining}`;

} else {

    status =
        `⚠ Over Budget by ₹${Math.abs(remaining)}`;

}

const percentage =
    Math.min(
        (spent / budgetAmount) * 100,
        100
    );

const progressColor =
    spent > budgetAmount
        ? "#ef4444"
        : "#22c55e";
div.innerHTML = `
    <h3>${budget.category}</h3>

    <p>
        Budget:
        ₹${budgetAmount}
    </p>

    <p>
        Spent:
        ₹${spent}
    </p>

    <div class="progress-bar">

        <div
            class="progress-fill"
            style="
    width:${percentage}%;
    background:${progressColor};
    height:100%;
"
        </div>

    </div>

    <p>
        ${status}
    </p>
`;

            budgetList.appendChild(div);

        });

    } catch (error) {

        console.error(error);

    }

}
loadTransactions();
loadBudgets();