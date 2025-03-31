import { useState, useContext } from "react";
import { ExpenseContext } from "./ExpenseContext";
import './IncomeForm.css';

const IncomeForm = () => {
    const { addIncome, showIncomeForm, setShowIncomeForm } = useContext(ExpenseContext);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount) return alert("Amount is required");
        
        if (addIncome(parseFloat(amount), description)) {  // Fixed: Added missing closing parenthesis
            setAmount("");
            setDescription("");
            setShowIncomeForm(false);
        }
    };

    if (!showIncomeForm) return null;

    return (
        <div className="form-modal-overlay">
            <form onSubmit={handleSubmit} className="form-modal">
                <h3>Add Income</h3>
                <input
                    type="number"
                    placeholder="Income Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="form-actions">
                    <button type="submit">Add Income</button>
                    <button type="button" onClick={() => setShowIncomeForm(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default IncomeForm;