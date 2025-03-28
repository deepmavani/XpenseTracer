import { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './ExpenseTracker.css';

const ExpenseTracker = () => {
  const [balance, setBalance] = useState(75000);
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
const [date, setDate] = useState('');


  const handleAddIncome = () => {
    const incomeAmount = parseFloat(amount);
    if (!isNaN(incomeAmount) && incomeAmount > 0) {
      setBalance(prev => prev + incomeAmount);
      setIncome(prev => prev + incomeAmount);
      setTransactions(prev => [
        { type: 'income', amount: incomeAmount, description, date: new Date().toLocaleDateString() },
        ...prev
      ]);
      setAmount('');
      setShowIncomeForm(false);
    }
  };

  const handleAddExpense = () => {
    const expenseAmount = parseFloat(amount);
    if (!isNaN(expenseAmount) && expenseAmount > 0 && expenseAmount <= balance) {
      setBalance(prev => prev - expenseAmount);
      setExpenses(prev => prev + expenseAmount);
      setTransactions(prev => [
        { type: 'expense', amount: expenseAmount, category, description, date: new Date().toLocaleDateString() },
        ...prev
      ]);
      setAmount('');
      setDescription('');
      setShowExpenseForm(false);
    }
  };

  const pieData = [
    { name: 'Food', value: transactions.filter(t => t.type === 'expense' && t.category === 'Food').reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Entertainment', value: transactions.filter(t => t.type === 'expense' && t.category === 'Entertainment').reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Travel', value: transactions.filter(t => t.type === 'expense' && t.category === 'Travel').reduce((sum, t) => sum + t.amount, 0) },
  ];

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const topExpenses = [...expenseTransactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="expense-tracker">
      <h1>Expense Tracker</h1>
      
      <div className="dashboard">
        {/* Left side - Action boxes */}
        <div className="action-section">
          {/* Income Box */}
          <div className="action-box income-box">
            <h3>Add Income</h3>
            <div className="balance-display">Wallet Balance: ₹{balance.toLocaleString()}</div>
            <button 
              onClick={() => setShowIncomeForm(true)} 
              className="action-button income-button"
            >
              + Add Income
            </button>
          </div>

          {/* Expense Box */}
          <div className="action-box expense-box">
            <h3>Add Expense</h3>
            <div className="expense-display">Total Expenses: ₹{expenses.toLocaleString()}</div>
            <button 
              onClick={() => setShowExpenseForm(true)} 
              className="action-button expense-button"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Right side - Pie Chart */}
        <div className="chart-section">
          <h2>Expense Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Forms */}
      {showIncomeForm && (
        <div className="form-modal">
          <h3>Add Income</h3>
          <input
            type="number"
            placeholder="Income Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
         
          <div className="form-actions">
            <button onClick={handleAddIncome}>Add balance</button>
            <button onClick={() => setShowIncomeForm(false)}>Cancel</button>
          </div>
        </div>
      )}

{showExpenseForm && (
  <div className="form-modal">
    <h3>Add Expense</h3>
    
    {/* Title and Price (Side by Side) */}
    <div className="form-row">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>

    {/* Category and Date (Side by Side) */}
    <div className="form-row">
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="" disabled selected>Select Category</option>
        <option value="Food">Food</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Travel">Travel</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    {/* Buttons */}
    <div className="form-actions">
      <button onClick={handleAddExpense}>Add Expense</button>
      <button onClick={() => setShowExpenseForm(false)}>Cancel</button>
    </div>
  </div>
)}


      <div className="transactions-section">
        <div className="transactions-layout">
          {/* Recent Transactions (8/12 width) */}
          <div className="recent-transactions">
            <h2>Recent Transactions</h2>
            {transactions.length === 0 ? (
              <p>No transactions!</p>
            ) : (
              <ul>
                {transactions.map((t, i) => (
                  <li key={i} className={t.type}>
                    <span className="description">{t.description}</span>
                    <span className="amount">₹{t.amount.toLocaleString()}</span>
                    <span className="date">{t.date}</span>
                    {t.type === 'expense' && <span className="category-tag">{t.category}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Top Expenses (4/12 width) */}
          <div className="top-expenses">
            <h2>Top Expenses</h2>
            {topExpenses.length === 0 ? (
              <p>No expenses to show!</p>
            ) : (
              <div className="expenses-chart">
                <BarChart
                  width={400}
                  height={300}
                  data={topExpenses}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
                <div className="expenses-list">
                  {topExpenses.map((expense, i) => (
                    <div key={i} className="expense-item">
                      <span>{expense.category}</span>
                      <span>₹{expense.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;