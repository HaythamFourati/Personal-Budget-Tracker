import Chart from 'chart.js/auto';
import { getTransactions, getGoals } from './storage.js';

// Constants for budgeting
export const CATEGORY_BUDGETS = {
    'Food': 500,
    'Transport': 200,
    'Utilities': 300,
    'Entertainment': 200,
    'Shopping': 300,
    'Healthcare': 200,
    'Other': 200
};

export const MONTHLY_INCOME = 2000;

// Initialize tabs
export function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            const content = document.getElementById(tabId);
            if (content) {
                content.classList.add('active');
            }

            // Initialize specific tab content
            switch (tabId) {
                case 'categories':
                    initializeCategories();
                    break;
                case 'analytics':
                    initializeAnalytics();
                    break;
                case 'goals':
                    initializeGoals();
                    break;
            }
        });
    });
}

// Initialize categories view
function initializeCategories() {
    const categoriesContainer = document.querySelector('.categories-container');
    if (!categoriesContainer) return;

    const transactions = getTransactions();
    categoriesContainer.innerHTML = '';

    Object.entries(CATEGORY_BUDGETS).forEach(([category, budget]) => {
        const spent = transactions
            .filter(t => t.category === category && t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const percentage = (spent / budget) * 100;
        const remaining = budget - spent;

        const categoryCard = document.createElement('div');
        categoryCard.className = `category-card ${percentage > 90 ? 'warning' : ''} ${percentage > 100 ? 'over' : ''}`;
        
        categoryCard.innerHTML = `
            <h3>${category}</h3>
            <div class="budget-info">
                <span>Budget: $${budget}</span>
                <span>Spent: $${spent.toFixed(2)}</span>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <p>Remaining: $${remaining.toFixed(2)}</p>
        `;

        categoriesContainer.appendChild(categoryCard);
    });
}

// Initialize analytics view
function initializeAnalytics() {
    const transactions = getTransactions();
    
    // Expense Distribution Chart
    const expenseCtx = document.getElementById('expenseChart');
    if (expenseCtx) {
        const expensesByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
                return acc;
            }, {});

        new Chart(expenseCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(expensesByCategory),
                datasets: [{
                    data: Object.values(expensesByCategory),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF99CC'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Expense Distribution by Category'
                    }
                }
            }
        });
    }

    // Monthly Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        const monthlyData = transactions.reduce((acc, t) => {
            const date = new Date(t.timestamp);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!acc[month]) {
                acc[month] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                acc[month].income += t.amount;
            } else {
                acc[month].expense += Math.abs(t.amount);
            }
            return acc;
        }, {});

        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: Object.keys(monthlyData),
                datasets: [
                    {
                        label: 'Income',
                        data: Object.values(monthlyData).map(d => d.income),
                        borderColor: '#4BC0C0',
                        tension: 0.1
                    },
                    {
                        label: 'Expenses',
                        data: Object.values(monthlyData).map(d => d.expense),
                        borderColor: '#FF6384',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Income vs Expenses'
                    }
                }
            }
        });
    }
}

// Initialize goals view
function initializeGoals() {
    const goalsGrid = document.querySelector('.goals-grid');
    if (!goalsGrid) return;

    const goals = getGoals();
    goalsGrid.innerHTML = '';

    if (goals.length === 0) {
        goalsGrid.innerHTML = '<div class="empty-state">No goals yet. Add one above!</div>';
        return;
    }

    goals.forEach(goal => {
        // Ensure we have valid numbers
        const target = parseFloat(goal.target) || 0;
        const current = parseFloat(goal.current) || 0;
        const progress = target > 0 ? (current / target) * 100 : 0;
        
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        
        goalCard.innerHTML = `
            <h3>${goal.name || 'Unnamed Goal'}</h3>
            <div class="goal-info">
                <p>Target: $${target.toFixed(2)}</p>
                <p>Current: $${current.toFixed(2)}</p>
                <p>Progress: ${progress.toFixed(1)}%</p>
                <p>Target Date: ${goal.date || 'Not set'}</p>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>
        `;

        goalsGrid.appendChild(goalCard);
    });
}
