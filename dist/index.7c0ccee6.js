const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const ctx = document.getElementById("myChart").getContext("2d");
let transactions = [];
console.log(transactions);
const formSubmission = function() {
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        // Form Values
        renderTrans();
        form.reset();
    });
};
const renderTrans = function() {
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const listEl = `<li><span class=${type === "expense" ? "expense" : "income"}>${type}</span>${description} $${amount}</li> `;
    transactionList.insertAdjacentHTML("beforeend", listEl);
    const transaction = {
        description,
        amount,
        type
    };
    localStorage.setItem("trans", JSON.stringify(transactions));
    transactions.push(transaction);
};
const loadData = function() {
    const storedTransactions = localStorage.getItem("trans");
    console.log(storedTransactions);
//storedTransactions.forEach((tran) => renderTrans(tran));
};
// Update chart
const init = function() {
    formSubmission();
    loadData();
};
init();

//# sourceMappingURL=index.7c0ccee6.js.map
