import { useContext } from "react";
import { ExpenseContext } from "./ExpenseContext";
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ExpenseList.css';

const ExpenseList = () => {
    const { transactions, expenses } = useContext(ExpenseContext);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    // Process data with error handling
    const pieData = [
        { name: 'Food', value: expenses?.filter(e => e?.category === 'Food')?.reduce((sum, e) => sum + (e?.amount || 0), 0) || 0 },
        { name: 'Entertainment', value: expenses?.filter(e => e?.category === 'Entertainment')?.reduce((sum, e) => sum + (e?.amount || 0), 0) || 0 },
        { name: 'Travel', value: expenses?.filter(e => e?.category === 'Travel')?.reduce((sum, e) => sum + (e?.amount || 0), 0) || 0 },
    ];

    const topExpenses = [...(expenses || [])]
        .sort((a, b) => (b?.amount || 0) - (a?.amount || 0))
        .slice(0, 5)
        .filter(e => e?.amount > 0);

    // Format date fallback
    const formatDate = (dateString) => {
        if (!dateString) return new Date().toLocaleDateString();
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className="transactions-section">
            <div className="transactions-layout">
                {/* Recent Transactions */}
                <div className="recent-transactions">
                    <h2>Recent Transactions</h2>
                    {!transactions?.length ? (
                        <p className="no-data">No transactions yet!</p>
                    ) : (
                        <ul>
                            {transactions.map((t) => (
                                <li key={`${t.id || t.date}-${t.amount}`} className={t.type}>
                                    <span className="description">{t.description || t.title || 'No description'}</span>
                                    <span className="amount">₹{(t.amount || 0).toLocaleString()}</span>
                                    <span className="date">{formatDate(t.date)}</span>
                                    {t.type === 'expense' && (
                                        <span className="category-tag">{t.category || 'Uncategorized'}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Top Expenses */}
                <div className="top-expenses">
                    <h2>Top Expenses</h2>
                    {!topExpenses.length ? (
                        <p className="no-data">No expenses recorded</p>
                    ) : (
                        <div className="expenses-chart">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topExpenses}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                                    <Bar dataKey="amount" fill="#8884d8" name="Amount" />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="expenses-list">
                                {topExpenses.map((expense) => (
                                    <div key={expense.id} className="expense-item">
                                        <span>{expense.category || 'Other'}</span>
                                        <span>₹{(expense.amount || 0).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Expense Distribution */}
            <div className="chart-section">
                <h2>Expense Distribution</h2>
                {pieData.some(item => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
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
                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="no-data">No expense data available</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseList;