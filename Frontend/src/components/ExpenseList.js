import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import EditExpenseModal from './EditExpenseModal';
import LoadingSpinner from './LoadingSpinner';
import './ExpenseList.css';

const ExpenseList = ({ refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      alert('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchExpenses(); // Refresh the list
        alert('Expense deleted successfully!');
      } catch (error) {
        alert('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleCloseModal = () => {
    setEditingExpense(null);
  };

  const handleExpenseUpdated = () => {
    fetchExpenses();
    setEditingExpense(null);
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  if (loading) {
    return <LoadingSpinner message="Loading expenses..." />;
  }

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <h2>Expense List</h2>
        <div className="total-expenses">
          <span>Total: </span>
          <strong>{formatCurrency(getTotalExpenses())}</strong>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="no-expenses">
          <p>No expenses found. Add your first expense above!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td>
                    <span className={`category-badge ${expense.category.toLowerCase()}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td>{formatDate(expense.date)}</td>
                  <td className="description">
                    {expense.description || '-'}
                  </td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(expense)}
                      title="Edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(expense.id)}
                      title="Delete"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={handleCloseModal}
          onExpenseUpdated={handleExpenseUpdated}
        />
      )}
    </div>
  );
};

export default ExpenseList;
