// Import required modules
import { 
    initializeStorage, 
    getTransactions, 
    saveTransaction,
    deleteTransaction,
    getGoals,
    saveGoal 
} from './storage.js';
import { initializeTabs } from './tabs.js';

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const transactionsList = document.getElementById('transactionsList');
const goalForm = document.getElementById('goal-form');

// Initialize the application
function initializeApp() {
    try {
        // Initialize storage and tabs
        initializeStorage();
        initializeTabs();
        
        // Load initial data
        loadTransactions();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update date text
        updateDateText();
        updateCurrentDate();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize the application.');
    }
}

// Update date text
function updateDateText() {
    const dateText = document.getElementById('date-text');
    if (dateText) {
        const now = new Date();
        dateText.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Update current date in header
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    dateElement.textContent = currentDate;
}

// Show error message
function showError(message) {
    console.error(message);
    // You could add a toast or notification system here
}

// Load transactions
function loadTransactions() {
    try {
        const transactions = getTransactions();
        renderTransactions(transactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
        showError('Failed to load transactions.');
    }
}

// Render transactions in the list
function renderTransactions(transactions) {
    if (!transactionsList) return;
    
    transactionsList.innerHTML = '';
    
    transactions.sort((a, b) => b.timestamp - a.timestamp)
        .forEach(transaction => {
            const row = document.createElement('tr');
            const date = new Date(transaction.timestamp);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}</td>
                <td>
                    <button class="delete-btn" data-id="${transaction.id}">Delete</button>
                </td>
            `;
            
            transactionsList.appendChild(row);
        });
}

// Setup event listeners
function setupEventListeners() {
    // Transaction form submit
    if (transactionForm) {
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const transaction = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                description: document.getElementById('description').value,
                amount: parseFloat(document.getElementById('amount').value),
                type: document.getElementById('type').value,
                category: document.getElementById('category').value
            };

            // Adjust amount based on type
            if (transaction.type === 'expense') {
                transaction.amount = -Math.abs(transaction.amount);
            }
            
            try {
                saveTransaction(transaction);
                loadTransactions();
                transactionForm.reset();
            } catch (error) {
                console.error('Error saving transaction:', error);
                showError('Failed to save transaction.');
            }
        });
    }

    // Goal form submit
    if (goalForm) {
        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const goal = {
                id: Date.now().toString(),
                name: document.getElementById('goal-name').value,
                target: parseFloat(document.getElementById('goal-amount').value),
                date: document.getElementById('goal-date').value,
                current: 0
            };
            
            try {
                saveGoal(goal);
                goalForm.reset();
            } catch (error) {
                console.error('Error saving goal:', error);
                showError('Failed to save goal.');
            }
        });
    }

    // Delete transaction buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.delete-btn')) {
            const id = e.target.dataset.id;
            if (id) {
                try {
                    deleteTransaction(id);
                    loadTransactions();
                } catch (error) {
                    console.error('Error deleting transaction:', error);
                    showError('Failed to delete transaction.');
                }
            }
        }
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
