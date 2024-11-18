const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const ctx = document.getElementById("myChart").getContext("2d");

let transactions = [];
console.log(transactions);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Form Values
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  // Render Transaction
  const li = document.createElement("li");

  li.innerHTML = `${type}: ${description} $${amount} `;

  transactionList.appendChild(li);

  // Push The Transaction To the Transactions arr
  const transaction = { description, amount, type };
  transactions.push(transaction);
  console.log(transaction);

  // Reste Form After Submission
  form.reset();
});

// Update chart
function updateChart() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Budget Overview",
          data: [income, expense],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
