const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const dateText = document.getElementById("date-text");
const ctx = document.getElementById("myChart").getContext("2d");
let transactions = [];
// Function to handle form submission
const formSubmission = function() {
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        // Render the transaction and store it
        renderTrans();
        form.reset();
    });
};
// Function to render transactions
const renderTrans = function() {
    // Get form values
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    // Generate transaction markup
    const listEl = `<li class='transactionListEl'><span class=${type === "expense" ? "expense" : "income"}>${type}</span>${description} $${amount}<span class="close">X</span></li>`;
    // Render transaction on the page
    transactionList.insertAdjacentHTML("afterbegin", listEl);
    // Create transaction object
    const transaction = {
        id: Date.now(),
        description,
        amount,
        type
    };
    // Add transaction to the transactions array
    transactions.push(transaction);
    // Store updated transactions array in local storage
    localStorage.setItem("trans", JSON.stringify(transactions));
    console.log(transaction);
};
// Function to load and render transactions from local storage
const loadData = function() {
    // Retrieve transactions from local storage
    const storedTransactions = JSON.parse(localStorage.getItem("trans"));
    if (storedTransactions) {
        transactions = storedTransactions; // Update the transactions array
        storedTransactions.forEach((transaction)=>{
            // Render each transaction
            const listEl = `<li class='transactionListEl'><span class=${transaction.type === "expense" ? "expense" : "income"}>${transaction.type}</span>${transaction.description} $${transaction.amount}<span class="close">X</span></li>`;
            transactionList.insertAdjacentHTML("beforeend", listEl);
        });
    }
};
const deleteData = function() {
    const listEL = document.querySelector(".transactionListEl");
    const closeEl = document.querySelector(".close");
    closeEl.addEventListener("click", function() {
        listEL.remove();
    });
};
// Setting The Current Date On the Black Navbar
const currentDate = new Date().toDateString().slice(0, 10);
dateText.innerHTML = `${currentDate}`;
// Initialize the application
const init = function() {
    formSubmission();
    loadData();
    deleteData();
};
init();

//# sourceMappingURL=index.7c0ccee6.js.map
