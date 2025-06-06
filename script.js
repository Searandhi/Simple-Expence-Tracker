// DOM Elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income-amount");
const expenseEl = document.getElementById("expense-amount");
const transactionForm = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionsList = document.getElementById("transactions-list");
const allFilter = document.getElementById("all");
const incomeFilter = document.getElementById("income-filter");
const expenseFilter = document.getElementById("expense-filter");
const incomeBar = document.querySelector(".income-bar");
const expenseBar = document.querySelector(".expense-bar");

// Transactions Array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Initialize App
function init() {
    updateBalance();
    renderTransactions();
    updateChart();
}

// Add Transaction
transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const text = textInput.value.trim();
    const amount = +amountInput.value;
    const type = typeInput.value;

    if (text === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter valid description and amount!");
        return;
    }

    const transaction = {
        id: Date.now(),
        text,
        amount,
        type
    };

    transactions.push(transaction);
    saveToLocalStorage();
    updateBalance();
    renderTransactions();
    updateChart();

    // Reset form
    textInput.value = "";
    amountInput.value = "";
});

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
    updateBalance();
    renderTransactions();
    updateChart();
}

// Update Balance
function updateBalance() {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    balanceEl.textContent = `$${balance.toFixed(2)}`;
    incomeEl.textContent = `+$${income.toFixed(2)}`;
    expenseEl.textContent = `-$${expense.toFixed(2)}`;
}

// Render Transactions
function renderTransactions(filter = "all") {
    transactionsList.innerHTML = "";

    const filteredTransactions = filter === "all" 
        ? transactions 
        : transactions.filter(t => t.type === filter);

    filteredTransactions.forEach(transaction => {
        const li = document.createElement("li");
        li.className = transaction.type;
        li.innerHTML = `
            <span>${transaction.text}</span>
            <span>${transaction.type === "income" ? "+" : "-"}$${transaction.amount.toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
        `;
        transactionsList.appendChild(li);
    });
}

// Filter Transactions
allFilter.addEventListener("click", () => {
    allFilter.classList.add("active");
    incomeFilter.classList.remove("active");
    expenseFilter.classList.remove("active");
    renderTransactions("all");
});

incomeFilter.addEventListener("click", () => {
    allFilter.classList.remove("active");
    incomeFilter.classList.add("active");
    expenseFilter.classList.remove("active");
    renderTransactions("income");
});

expenseFilter.addEventListener("click", () => {
    allFilter.classList.remove("active");
    incomeFilter.classList.remove("active");
    expenseFilter.classList.add("active");
    renderTransactions("expense");
});

// Update Chart (Simple CSS Bars)
function updateChart() {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const max = Math.max(income, expense) || 1;
    const incomeHeight = (income / max) * 100;
    const expenseHeight = (expense / max) * 100;

    incomeBar.style.height = `${incomeHeight}%`;
    expenseBar.style.height = `${expenseHeight}%`;
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize App
init();