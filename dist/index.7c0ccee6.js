// Firebase configuration (replace with your own config)
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "personal-budgeting-app-ea761",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
//   };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
// const ctx = document.getElementById('myChart').getContext('2d');
let transactions = [];
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // Form Values
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const li = document.createElement('li');
    const transaction = {
        description,
        amount,
        type
    };
    // Push The Transaction To the Transactions arr
    transactions.push(transaction);
    // Render Transaction
    li.textContent = `${type}: ${description} $${amount} `;
    transactionList.appendChild(li);
    // Reste Form After Submission
    form.reset();
}); // // Fetch transactions from Firestore
 // db.collection("transactions").onSnapshot((snapshot) => {
 //   transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 //   renderTransactions();
 //   updateChart();
 // });
 // Add transaction
 // // Update chart
 // function updateChart() {
 //   const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
 //   const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
 //   new Chart(ctx, {
 //     type: 'bar',
 //     data: {
 //       labels: ['Income', 'Expenses'],
 //       datasets: [{
 //         label: 'Budget Overview',
 //         data: [income, expense],
 //         backgroundColor: ['#4caf50', '#f44336']
 //       }]
 //     },
 //     options: {
 //       responsive: true,
 //       maintainAspectRatio: false
 //     }
 //   });
 // }

//# sourceMappingURL=index.7c0ccee6.js.map
