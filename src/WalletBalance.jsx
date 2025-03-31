import { useContext } from "react";
import { ExpenseContext } from "./ExpenseContext";
import './WalletBalance.css';

const WalletBalance = () => {
    const { 
        balance, 
        income, 
        setShowIncomeForm, 
        setShowExpenseForm,
        expenses // Added for total expenses display
    } = useContext(ExpenseContext);
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="dashboard">
            <div className="action-section">
                <div className="action-box income-box">
                    <h3>Wallet Summary</h3>
                    <div className="balance-display">
                        <span>Balance: </span>
                        <span>₹{balance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="income-display">
                        <span>Total Income: </span>
                        <span>₹{income.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                        onClick={() => setShowIncomeForm(true)} 
                        className="action-button income-button"
                        aria-label="Add income"
                    >
                        + Add Income
                    </button>
                </div>
                <div className="action-box expense-box">
                    <h3>Expenses</h3>
                    <div className="expense-display">
                        <span>Total Expenses: </span>
                        <span>₹{totalExpenses.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                        onClick={() => setShowExpenseForm(true)} 
                        className="action-button expense-button"
                        aria-label="Add expense"
                    >
                        + Add Expense
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletBalance;