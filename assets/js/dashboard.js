console.log("Dashboard JS loaded");
console.log("userRole:", localStorage.getItem("userRole"));
console.log("userName:", localStorage.getItem("userName"));
console.log("userEmail:", localStorage.getItem("userEmail"));
console.log("loggedInUser:", localStorage.getItem("loggedInUser"));
const userRole = localStorage.getItem("userRole") || "user";
const userName = localStorage.getItem("userName");

document.querySelector(
  ".dashboard-greeting"
).textContent = `Welcome Back ,  ${userName}!`;
if (userRole === "admin") {
  document.querySelector(".profile-picture").src = "assets/img/admin-pdp.png";
  document.querySelector(".username-name").textContent = userName + " (Admin)";
  document.querySelector(".username-mail").textContent =
    localStorage.getItem("userEmail");
} else {
  document.querySelector(".profile-picture").src =
    "assets/img/user-profile-picture.png";
  document.querySelector(".username-name").textContent = userName;
  document.querySelector(".username-mail").textContent =
    localStorage.getItem("userEmail");
}

// MONEY FLOW CHART

const ctx = document.getElementById("moneyFlowChart").getContext("2d");

const moneyFlowChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Income",
        data: [9000, 10500, 10000, 12000, 11500, 8500, 11000],
        backgroundColor: "#7c3aed",
        borderRadius: 8,
        barThickness: 24,
      },
      {
        label: "Expense",
        data: [8500, 11000, 9500, 11500, 11000, 8000, 10000],
        backgroundColor: "#c4b5fd",
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        borderRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return "$" + context.parsed.y.toLocaleString();
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 13,
          },
        },
      },
      y: {
        border: {
          display: false,
          dash: [5, 5],
        },
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 13,
          },
          callback: function (value) {
            return "$" + value / 1000 + "k";
          },
          stepSize: 5000,
        },
        beginAtZero: true,
        max: 15000,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  },
});

const chartData = {
  "This year": {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    income: [
      9000, 10500, 10000, 12000, 11500, 8500, 11000, 12500, 13000, 14000, 15000,
      16000,
    ],
    expense: [
      8500, 11000, 9500, 11500, 11000, 8000, 10000, 12000, 12500, 13000, 13500,
      14000,
    ],
  },
  "Last year": {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    income: [
      8000, 9500, 9000, 11000, 10500, 7500, 10000, 11500, 12000, 12500, 13000,
      13500,
    ],
    expense: [
      7500, 10000, 8500, 10500, 10000, 7000, 9000, 11000, 11500, 12000, 12500,
      13000,
    ],
  },
  "Last 6 months": {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [11000, 12500, 13000, 14000, 15000, 16000],
    expense: [10000, 12000, 12500, 13000, 13500, 14000],
  },
};

// FIX: Use correct class selector for the time period filter
const filterSelect = document.querySelectorAll(".filter-select")[1];

filterSelect.addEventListener("change", function () {
  const selectedPeriod = filterSelect.value;
  updateChart(selectedPeriod);
});

function updateChart(period) {
  const data = chartData[period];
  moneyFlowChart.data.labels = data.labels;
  moneyFlowChart.data.datasets[0].data = data.income;
  moneyFlowChart.data.datasets[1].data = data.expense;
  moneyFlowChart.update();
}

// Initial chart update
updateChart("This year");

let transactions = [];

const formTransaction = document.querySelector(".transaction-form");

formTransaction.addEventListener("submit", function (e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const date = document.getElementById("date").value;

  const newTransaction = {
    amount: parseFloat(amount),
    category: category,
    type: type,
    date: date,
  };

  transactions.push(newTransaction);

  console.log("New Transaction Added:", newTransaction);
  console.log("All Transactions:", transactions);

  formTransaction.reset();

  updateChartWithTransactions();
  updatePieChartWithTransactions();
});

function processTransactionData() {
  const newData = {
    labels: chartData["This year"].labels,
    income: [...chartData["This year"].income],
    expense: [...chartData["This year"].expense],
  };

  transactions.forEach(function (transaction) {
    const transactionDate = new Date(transaction.date);
    const monthIndex = transactionDate.getMonth();

    if (transaction.type === "income") {
      newData.income[monthIndex] += parseFloat(transaction.amount);
    } else if (transaction.type === "expense") {
      newData.expense[monthIndex] += parseFloat(transaction.amount);
    }
  });

  return newData;
}

function updateChartWithTransactions() {
  const liveData = processTransactionData();

  moneyFlowChart.data.labels = liveData.labels;
  moneyFlowChart.data.datasets[0].data = liveData.income;
  moneyFlowChart.data.datasets[1].data = liveData.expense;

  moneyFlowChart.update();

  console.log("Chart updated with new transactions:", liveData);
}

// ===== PIE CHART =====
const categoryData = {
  "Food-Groceries": 2500,
  "Cafe-Restau": 1200,
  Shopping: 800,
  Transport: 600,
  Bills: 1500,
  Entertainment: 900,
  Other: 450,
};

// FIX: Check if element exists before creating chart
const pieCanvasElement = document.getElementById("budgetPieChart");
let budgetPieChart = null;

if (pieCanvasElement) {
  const pieCtx = pieCanvasElement.getContext("2d");

  budgetPieChart = new Chart(pieCtx, {
    type: "doughnut",
    data: {
      labels: [
        "Food & Groceries",
        "Cafe & Restaurants",
        "Shopping",
        "Transport",
        "Bills",
        "Entertainment",
        "Other",
      ],
      datasets: [
        {
          data: [2500, 1200, 800, 600, 1500, 900, 450],
          backgroundColor: [
            "#7c3aed",
            "#c4b5fd",
            "#a78bfa",
            "#ddd6fe",
            "#ede9fe",
            "#f3e8ff",
            "#faf5ff",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#1f2937",
          padding: 12,
          borderRadius: 8,
          callbacks: {
            label: function (context) {
              return "$" + context.parsed.toLocaleString();
            },
          },
        },
      },
    },
  });
}

function updatePieChartWithTransactions() {
  if (!budgetPieChart) return; // Exit if pie chart doesn't exist

  const updatedCategoryData = {
    "Food-Groceries": 2500,
    "Cafe-Restau": 1200,
    Shopping: 800,
    Transport: 600,
    Bills: 1500,
    Entertainment: 900,
    Other: 450,
  };

  transactions.forEach(function (transaction) {
    if (transaction.type === "expense") {
      if (updatedCategoryData[transaction.category] !== undefined) {
        updatedCategoryData[transaction.category] += parseFloat(
          transaction.amount
        );
      } else {
        updatedCategoryData[transaction.category] = parseFloat(
          transaction.amount
        );
      }
    }
  });

  const categoryValues = Object.values(updatedCategoryData);
  budgetPieChart.data.datasets[0].data = categoryValues;
  budgetPieChart.update();

  console.log("Pie chart updated:", updatedCategoryData);
}

//SINGLE PAGE APPLICATION LOGIC
document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active from all nav items
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add active to clicked item
    this.classList.add("active"); // FIXED: was classlist

    // Hide all content sections
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active"); // Changed from add("hidden") to remove("active")
    });

    // Show the selected section
    const page = this.getAttribute("data-page");
    document.getElementById(page + "-content").classList.add("active");
    // Show the selected section
    const po = this.getAttribute("data-page");
    console.log("Page:", page);
    console.log("Header element:", document.querySelector(".header-left"));

    document.getElementById(page + "-content").classList.add("active");
    const headerLeft = document.querySelector(".header-left");
    if (headerLeft) {
      if (page !== "dashboard") {
        headerLeft.classList.add("hidden");
      } else {
        headerLeft.classList.remove("hidden");
      }
    }
  });
});

//----------------------------------------Goals page-------------------------

let goalsArray = [];
let editingIndex = null;

const goalsForm = document.querySelector(".goalsgroup-form");
const goalTable = document.getElementById("goal-table");

// Handle form submission
goalsForm.addEventListener("submit", function (e) {
  //fch ncliquiw sur add goal dkchi iban fi tableau
  e.preventDefault();
  GoalSubmit();
});

function GoalSubmit() {
  const data = RetreiveData();

  if (editingIndex !== null) {
    goalsArray[editingIndex] = data; //hadi lakna fi modification
    editingIndex = null; //fi modification fin kikon index not null
  } else {
    goalsArray.push(data); // knajoutiw new goal to the array
  }

  displayGoals(); // update the table
  goalsForm.reset();
  document.querySelector(".add-goal-btn").innerText = "Add Goal";
}

function RetreiveData() {
  const goals = {
    Title: document.getElementById("goal-name").value,
    TargetAmount: parseFloat(document.getElementById("goal-amount").value), //parsefloat kt rj3 text to number
    CurrentAmount: parseFloat(
      document.getElementById("current-saved-amount").value
    ),
  };

  goals.Percentage = ((goals.CurrentAmount / goals.TargetAmount) * 100).toFixed(
    2
  );

  return goals;
}

function displayGoals() {
  const tbody = goalTable.getElementsByTagName("tbody")[0];
  tbody.innerHTML = ""; // Clear table

  goalsArray.forEach((goal, idx) => {
    const newRow = tbody.insertRow();

    newRow.insertCell(0).innerText = goal.Title;
    newRow.insertCell(1).innerText = "$" + goal.TargetAmount;
    newRow.insertCell(2).innerText = "$" + goal.CurrentAmount;

    const actionsCell = newRow.insertCell(3);
    actionsCell.innerHTML = `
      <button class="modifier-goal-btn" onclick="editGoal(${idx})">Edit</button>
      <button class="delete-goal-btn" onclick="deleteGoal(${idx})">Delete</button> 
    `; //button fach ktclicky 3liha kt3yt lfonction o kt3tiha index dyal goal
  });
}

function editGoal(idx) {
  const goal = goalsArray[idx]; //knmchiw lgoal  l3ndo dkindex

  document.getElementById("goal-name").value = goal.Title; //n3mru lform b data dyal goal bach tb9a t9dr t3dl 3liha ki wli formulair fih data dialna
  document.getElementById("goal-amount").value = goal.TargetAmount;
  document.getElementById("current-saved-amount").value = goal.CurrentAmount;

  editingIndex = idx;
  document.querySelector(".add-goal-btn").innerText = "Update Goal"; //bch n3rfu blly hna f modification
}

function deleteGoal(idx) {
  if (confirm("Delete this goal?")) {
    goalsArray.splice(idx, 1); //hnaya kanmshu lgoal b dk index o kan
    displayGoals(); // nupdate table
  }
}

// --------------------------------WALLET------------------------

function GenerateCardNumber() {
  let CardNumber = "";
  for (let i = 0; i < 16; i++) {
    CardNumber += Math.floor(Math.random() * 10);
  }
  return CardNumber;
}

function generateExpiry() {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const year = String(Math.floor(Math.random() * 30) + 25);
  return month + "/" + year;
}

function GenerateCVV() {
  return String(Math.floor(Math.random() * 900) + 100);
}

// Random card styles instead of colors
function getRandomCardStyle() {
  const styles = ["gold-edition", "oceanic", "carbon"];
  return styles[Math.floor(Math.random() * styles.length)];
}

const creditCardData = {
  holder: userName,
  number: "",
  expiry: "",
  cvv: "",
  style: "",
};

const savingsCardData = {
  holder: userName,
  number: "",
  expiry: "",
  cvv: "",
  style: "",
};

function displayCreditCard() {
  const card = document.getElementById("credit-card");
  const lastfour = creditCardData.number.slice(-4);

  card.querySelector(".card-holder").textContent = creditCardData.holder;
  card.querySelector(".card-number").textContent = `•••• •••• •••• ${lastfour}`;
  card.querySelector(".card-expiry").textContent = creditCardData.expiry;

  // Remove old styles and add new one
  card.className = "credit-card " + creditCardData.style;
}

function displaySavingCard() {
  const card = document.getElementById("savings-card");
  const lastfour = savingsCardData.number.slice(-4);

  card.querySelector(".card-holder").textContent = creditCardData.holder;
  card.querySelector(".card-number").textContent = `•••• •••• •••• ${lastfour}`;
  card.querySelector(".card-expiry").textContent = savingsCardData.expiry;

  // Remove old styles and add new one
  card.className = "savings-card " + savingsCardData.style;
}

function GenerateCardCard() {
  creditCardData.number = GenerateCardNumber();
  creditCardData.expiry = generateExpiry();
  creditCardData.cvv = GenerateCVV();
  creditCardData.style = getRandomCardStyle();

    document.getElementById('credit-card').style.display = 'block';

  localStorage.setItem("creditCard", JSON.stringify(creditCardData));
  displayCreditCard();
}

function GenerateSavingsCard() {
  savingsCardData.number = GenerateCardNumber();
  savingsCardData.expiry = generateExpiry();
  savingsCardData.cvv = GenerateCVV();
  savingsCardData.style = getRandomCardStyle();

  localStorage.setItem("savingsCard", JSON.stringify(savingsCardData));

  document.getElementById("savings-card").style.display = "block";
  document.getElementById("create-savings-btn").style.display = "none";
  document.getElementById("delete-savings-btn").style.display = "block";
  displaySavingCard();
}

function deleteCreditCard() {
  if (confirm("Delete credit card?")) {
    localStorage.removeItem("creditCard");
    creditCardData.holder = "";
    creditCardData.number = "";
    creditCardData.expiry = "";
    creditCardData.cvv = "";
    creditCardData.style = "";
    document.getElementById("credit-card").style.display = "none";
  }
}

function deleteSavingsCard() {
  if (confirm("Delete savings card?")) {
    localStorage.removeItem("savingsCard");
    savingsCardData.holder = "";
    savingsCardData.number = "";
    savingsCardData.expiry = "";
    savingsCardData.cvv = "";
    savingsCardData.style = "";
    document.getElementById("savings-card").style.display = "none";
    document.getElementById("create-savings-btn").style.display = "block";
    document.getElementById("delete-savings-btn").style.display = "none";
  }
}

function loadCards() {
  // Check for credit card
  const savedCredit = localStorage.getItem("creditCard");
  if (savedCredit) {
    Object.assign(creditCardData, JSON.parse(savedCredit));
    displayCreditCard();
  }

  // Check for savings card
  const savedSavings = localStorage.getItem("savingsCard");
  if (savedSavings) {
    Object.assign(savingsCardData, JSON.parse(savedSavings));
    document.getElementById("savings-card").style.display = "block";
    document.getElementById("create-savings-btn").style.display = "none";
    document.getElementById("delete-savings-btn").style.display = "block";
    displaySavingCard();
  } else {
    document.getElementById("savings-card").style.display = "none";
    document.getElementById("create-savings-btn").style.display = "block";
    document.getElementById("delete-savings-btn").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", loadCards);
