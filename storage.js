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
    transaction.id = Date.now().toString();
    transaction.date = new Date().toISOString().split('T')[0]; // Add date in YYYY-MM-DD format
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return transaction;
}

// Delete transaction
function deleteTransaction(transactionId) {
    const transactions = getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== transactionId);
    localStorage.setItem('transactions', JSON.stringify(filteredTransactions));
}

// Get all goals
function getGoals() {
    return JSON.parse(localStorage.getItem('goals') || '[]');
}

// Save goal
function saveGoal(goal) {
    // Ensure goal has all required properties with proper types
    const validatedGoal = {
        id: goal.id || Date.now().toString(),
        name: goal.name || 'Unnamed Goal',
        target: parseFloat(goal.target) || 0,
        current: parseFloat(goal.current) || 0,
        date: goal.date || new Date().toISOString().split('T')[0],
        timestamp: Date.now()
    };

    const goals = getGoals();
    goals.push(validatedGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    return validatedGoal;
}

// Update goal
function updateGoal(goalId, updates) {
    const goals = getGoals();
    const index = goals.findIndex(g => g.id === goalId);
    if (index !== -1) {
        // Ensure updates maintain proper types
        const currentGoal = goals[index];
        const validatedUpdates = {
            ...updates,
            target: updates.target !== undefined ? parseFloat(updates.target) : currentGoal.target,
            current: updates.current !== undefined ? parseFloat(updates.current) : currentGoal.current
        };

        goals[index] = { ...currentGoal, ...validatedUpdates };
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

// Get daily expenses for the last 30 days
function getDailyExpenses() {
    const transactions = getTransactions();
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Filter transactions for last 30 days and group by date
    const dailyExpenses = transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= thirtyDaysAgo && 
                   transactionDate <= today && 
                   t.type === 'expense';
        })
        .reduce((acc, t) => {
            const date = t.date; // Use the stored date directly
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += parseFloat(t.amount);
            return acc;
        }, {});

    return dailyExpenses;
}

// Get daily expenses formatted for chart display
function getDailyExpensesForChart() {
    const dailyExpenses = getDailyExpenses();
    const today = new Date();
    const dates = [];
    const amounts = [];

    // Generate all dates for the last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dates.push(dateStr);
        amounts.push(dailyExpenses[dateStr] || 0);
    }

    return {
        labels: dates,
        data: amounts
    };
}

// Calculate 30-day total expenses
function getThirtyDayTotal() {
    const dailyExpenses = getDailyExpenses();
    return Object.values(dailyExpenses).reduce((total, amount) => total + amount, 0);
}

// Calculate daily average expenses
function getDailyAverage() {
    const total = getThirtyDayTotal();
    return total / 30;
}

export {
    initializeStorage,
    getTransactions,
    saveTransaction,
    deleteTransaction,
    getGoals,
    saveGoal,
    updateGoal,
    deleteGoal,
    clearAllData,
    getDailyExpenses,
    getDailyExpensesForChart,
    getThirtyDayTotal,
    getDailyAverage
};
