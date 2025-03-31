import { createContext, useState, useEffect } from "react";

const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
    const [balance, setBalance] = useState(() => {
        return parseFloat(localStorage.getItem("balance")) || 75000;
    });
    const [expenses, setExpenses] = useState(() => {
        return JSON.parse(localStorage.getItem("expenses")) || [];
    });
    const [income, setIncome] = useState(() => {
        return parseFloat(localStorage.getItem("income")) || 0;
    });
    const [transactions, setTransactions] = useState(() => {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    });
    const [showIncomeForm, setShowIncomeForm] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);

    useEffect(() => {
        localStorage.setItem("balance", balance);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        localStorage.setItem("income", income);
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [balance, expenses, income, transactions]);

    const addIncome = (amount, description) => {
        if (!isNaN(amount) && amount > 0) {
            setBalance(prev => prev + amount);
            setIncome(prev => prev + amount);
            setTransactions(prev => [
                { type: 'income', amount, description, date: new Date().toLocaleDateString() },
                ...prev
            ]);
            return true;
        }
        return false;
    };

    const addExpense = (expense) => {
        if (expense.amount > 0 && expense.amount <= balance) {
            setBalance(prev => prev - expense.amount);
            setExpenses(prev => [...prev, expense]);
            setTransactions(prev => [
                { 
                    type: 'expense', 
                    amount: expense.amount, 
                    category: expense.category, 
                    description: expense.title, 
                    date: expense.date 
                },
                ...prev
            ]);
            return true;
        }
        return false;
    };

    const deleteExpense = (id) => {
        const updatedExpenses = expenses.filter((exp) => exp.id !== id);
        const deletedExpense = expenses.find((exp) => exp.id === id);
        if (deletedExpense) {
            setExpenses(updatedExpenses);
            setBalance((prevBalance) => prevBalance + deletedExpense.amount);
        }
    };

    return (
        <ExpenseContext.Provider value={{ 
            balance, 
            expenses, 
            income, 
            transactions,
            showIncomeForm,
            showExpenseForm,
            setShowIncomeForm,
            setShowExpenseForm,
            addIncome,
            addExpense, 
            deleteExpense 
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export { ExpenseProvider, ExpenseContext };