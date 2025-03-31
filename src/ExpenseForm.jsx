import { useState, useContext } from "react";
import { ExpenseContext } from "./ExpenseContext";
import { v4 as uuidv4 } from "uuid";
import './ExpenseForm.css';

const ExpenseForm = () => {
    const { 
        addExpense, 
        showExpenseForm, 
        setShowExpenseForm,
        balance 
    } = useContext(ExpenseContext);
    
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food",
        date: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.title.trim() || !formData.amount || !formData.date) {
            return setError("All fields are required");
        }

        const amountValue = parseFloat(formData.amount);
        if (isNaN(amountValue)) {  // Fixed: Added missing parenthesis
            return setError("Please enter a valid amount");
        }

        if (amountValue <= 0) {
            return setError("Amount must be greater than 0");
        }

        if (amountValue > balance) {
            return setError("Expense exceeds available balance");
        }

        const expense = { 
            id: uuidv4(), 
            title: formData.title.trim(),
            amount: amountValue,
            category: formData.category,
            date: new Date(formData.date).toLocaleDateString() 
        };
        
        if (addExpense(expense)) {
            setFormData({
                title: "",
                amount: "",
                category: "Food",
                date: ""
            });
            setShowExpenseForm(false);
        }
    };

    if (!showExpenseForm) return null;

    return (
        <div className="form-modal-overlay">
            <form onSubmit={handleSubmit} className="form-modal">
                <h3>Add Expense</h3>
                
                {error && <div className="form-error">{error}</div>}
                
                <div className="form-row">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={50}
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>
                
                <div className="form-row">
                    <select 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Travel">Travel</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        Add Expense
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setShowExpenseForm(false)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;