// storage.js - Local storage functionality for the budget tracker

// Initialize local storage with default data if needed
function initializeStorage() {
    // Initialize transactions if not exists
    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }

    // Initialize goals if not exists
    if (!localStorage.getItem('goals')) {
        localStorage.setItem('goals', JSON.stringify([]));
    }

    return true;
}

// Get all transactions
function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
}

// Save transaction
function saveTransaction(transaction) {
    const transactions = getTransactions();
    transaction.id = Date.now().toString(); // Simple unique ID
    transaction.timestamp = new Date().toISOString();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return transaction;
}

// Get all goals
function getGoals() {
    return JSON.parse(localStorage.getItem('goals') || '[]');
}

// Save goal
function saveGoal(goal) {
    const goals = getGoals();
    goal.id = Date.now().toString(); // Simple unique ID
    goal.timestamp = new Date().toISOString();
    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
    return goal;
}

// Update goal
function updateGoal(goalId, updates) {
    const goals = getGoals();
    const index = goals.findIndex(g => g.id === goalId);
    if (index !== -1) {
        goals[index] = { ...goals[index], ...updates };
        localStorage.setItem('goals', JSON.stringify(goals));
        return goals[index];
    }
    return null;
}

// Delete goal
function deleteGoal(goalId) {
    const goals = getGoals();
    const filteredGoals = goals.filter(g => g.id !== goalId);
    localStorage.setItem('goals', JSON.stringify(filteredGoals));
}

// Clear all data (for testing/reset purposes)
function clearAllData() {
    localStorage.removeItem('transactions');
    localStorage.removeItem('goals');
    initializeStorage();
}

export {
    initializeStorage,
    getTransactions,
    saveTransaction,
    getGoals,
    saveGoal,
    updateGoal,
    deleteGoal,
    clearAllData
};
