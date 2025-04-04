import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineCancel, MdOutlineEdit } from "react-icons/md";
import { IoPizzaOutline } from "react-icons/io5";
import { PiGiftLight } from "react-icons/pi";
import { CiRollingSuitcase } from "react-icons/ci";
import './ExpenseTracker.css';

const ExpenseTracker = () => {
  // Load complete state from localStorage or initialize defaults
  const [state, setState] = useState(() => {
    const savedData = localStorage.getItem('expenseTrackerState');
    return savedData ? JSON.parse(savedData) : {
      balance: 2000,
      expenses: [],
      income: 0,
      showIncomeForm: false,
      showExpenseForm: false,
      amount: '',
      category: '',
      title: '',
      date: '',
      editExpense: null,
      currentPage: 1
    };
  });

  // Destructure state
  const {
    balance,
    expenses,
    income,
    showIncomeForm,
    showExpenseForm,
    amount,
    category,
    title,
    date,
    editExpense,
    currentPage
  } = state;

  // Save complete state whenever any part changes
  useEffect(() => {
    localStorage.setItem('expenseTrackerState', JSON.stringify(state));
  }, [state]);

  const rowsPerPage = 3;

  const handleAddIncome = () => {
    const incomeAmount = parseFloat(amount);
    if (!isNaN(incomeAmount) && incomeAmount > 0) {
      setState(prev => ({
        ...prev,
        balance: prev.balance + incomeAmount,
        income: prev.income + incomeAmount,
        amount: '',
        showIncomeForm: false
      }));
    }
  };

  const handleAddExpense = () => {
    const expenseAmount = parseFloat(amount);
    if (!isNaN(expenseAmount) && expenseAmount > 0 && expenseAmount <= balance) {
      setState(prev => ({
        ...prev,
        balance: prev.balance - expenseAmount,
        expenses: [{
          id: Date.now(),
          title,
          price: expenseAmount,
          category,
          date: date || new Date().toISOString().split('T')[0]
        }, ...prev.expenses],
        amount: '',
        title: '',
        category: '',
        date: '',
        showExpenseForm: false
      }));
    }
  };

  const handleUpdateExpense = () => {
    const expenseAmount = parseFloat(amount);
    if (!isNaN(expenseAmount) && expenseAmount > 0) {
      setState(prev => {
        const updatedExpenses = prev.expenses.map(exp => 
          exp.id === editExpense.id ? {
            ...exp,
            title,
            price: expenseAmount,
            category,
            date: date || exp.date
          } : exp
        );
        
        const balanceChange = editExpense.price - expenseAmount;
        
        return {
          ...prev,
          balance: prev.balance + balanceChange,
          expenses: updatedExpenses,
          amount: '',
          title: '',
          category: '',
          date: '',
          editExpense: null,
          showExpenseForm: false
        };
      });
    }
  };

  const handleDelete = (expenseToDelete) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== expenseToDelete.id),
      balance: prev.balance + expenseToDelete.price
    }));
  };

  // Helper functions remain the same
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food": return <IoPizzaOutline />;
      case "Entertainment": return <PiGiftLight />;
      case "Travel": return <CiRollingSuitcase />;
      default: return null;
    }
  };

  const totalPages = Math.ceil(expenses.length / rowsPerPage);
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (direction) => {
    setState(prev => ({
      ...prev,
      currentPage: direction === "prev" && prev.currentPage > 1 ? prev.currentPage - 1 :
                  direction === "next" && prev.currentPage < totalPages ? prev.currentPage + 1 :
                  prev.currentPage
    }));
  };

  const pieData = [
    { name: 'Food', value: expenses.filter(t => t.category === 'Food').reduce((sum, t) => sum + t.price, 0) },
    { name: 'Entertainment', value: expenses.filter(t => t.category === 'Entertainment').reduce((sum, t) => sum + t.price, 0) },
    { name: 'Travel', value: expenses.filter(t => t.category === 'Travel').reduce((sum, t) => sum + t.price, 0) },
  ];

  const topExpenses = [...expenses]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map(expense => ({
      name: expense.category,
      value: expense.price,
      id: expense.id
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="expense-tracker-container">
      <div className="expense-tracker">
        <h1 className="expense-tracker-title">Expense Tracker</h1>
        
        <div className="dashboard">
          <div className="action-section">
            <div className="action-box wallet-box">
              <h3>Wallet Balance</h3>
              <div className="balance-display">₹{balance.toLocaleString()}</div>
              <button 
                onClick={() => setState(prev => ({ ...prev, showIncomeForm: true }))} 
                className="action-button income-button"
              >
                + Add Income
              </button>
            </div>

            <div className="action-box expenses-box">
              <h3>Expenses</h3>
              <div className="expense-display">₹{expenses.reduce((sum, exp) => sum + exp.price, 0).toLocaleString()}</div>
              <button 
                onClick={() => setState(prev => ({ ...prev, showExpenseForm: true, editExpense: null }))} 
                className="action-button expense-button"
              >
                + Add Expense
              </button>
            </div>
          </div>

          <div className="chart-section">
            <h3 className="chart-title">Expense Distribution</h3>
            <div className="pie-chart-container">
              <PieChart width={300} height={250}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
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
        </div>

        {showIncomeForm && (
          <div className="modal-overlay">
            <div className="form-modal">
              <h3>Add Income</h3>
              <input
                type="number"
                placeholder="Income Amount"
                value={amount}
                onChange={(e) => setState(prev => ({ ...prev, amount: e.target.value }))}
              />
              <div className="form-actions">
                <button 
                  onClick={() => setState(prev => ({ ...prev, showIncomeForm: false }))}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  onClick={handleAddIncome}
                  className="submit-button"
                >
                  Add Balance
                </button>
              </div>
            </div>
          </div>
        )}

        {(showExpenseForm || editExpense) && (
          <div className="modal-overlay">
            <div className="form-modal">
              <h3>{editExpense ? 'Edit Expense' : 'Add Expense'}</h3>
              <div className="form-row">
                <input
                  name="title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))}
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={amount}
                  onChange={(e) => setState(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <select 
                  name="category"
                  value={category} 
                  onChange={(e) => setState(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Travel">Travel</option>
                </select>
                <input
                  name="date"
                  type="date"
                  value={date}
                  onChange={(e) => setState(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="form-actions">
                <button 
                  onClick={() => setState(prev => ({ ...prev, showExpenseForm: false, editExpense: null }))}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  onClick={editExpense ? handleUpdateExpense : handleAddExpense}
                  className="submit-button"
                >
                  {editExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="transactions-section">
          <div className="transactions-layout">
            <div className="recent-transactions">
              <h2>Recent Transactions</h2>
              <div className="transactions-table-container">
                <table className="transactions-table">
                  <tbody>
                    {paginatedExpenses.length > 0 ? (
                      paginatedExpenses.map((expense) => (
                        <tr key={expense.id} className="transaction-row">
                          <td className="transaction-icon-cell">
                            <div className="category-icon">
                              {getCategoryIcon(expense.category)}
                            </div>
                          </td>

                          <td className="transaction-details-cell">
                            <div className="transaction-details">
                              <div>{expense.title}</div>
                              <small className="transaction-date">{formatDate(expense.date)}</small>
                            </div>
                          </td>
                          <td className="transaction-amount-cell">
                            <div className="amount-actions">
                              <strong className="transaction-amount">₹{expense.price.toFixed(2)}</strong>
                              <div className="action-buttons">
                                <button
                                  className="delete-button"
                                  onClick={() => handleDelete(expense)}
                                >
                                  <MdOutlineCancel />
                                </button>
                                <button
                                  className="edit-button"
                                  onClick={() => setState(prev => ({
                                    ...prev,
                                    editExpense: expense,
                                    title: expense.title,
                                    amount: expense.price,
                                    category: expense.category,
                                    date: expense.date,
                                    showExpenseForm: true
                                  }))}
                                >
                                  <MdOutlineEdit />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-transactions">
                          No transactions!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  className="pagination-button prev-button"
                >
                  <FaArrowLeftLong />
                </button>
                <span className="page-number">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages}
                  className="pagination-button next-button"
                >
                  <FaArrowRightLong />
                </button>
              </div>
            </div>

            <div className="top-expenses-chart">
              <h2>Top Expenses</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topExpenses}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Amount']}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8" 
                      barSize={20} 
                      radius={[0, 10, 10, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;