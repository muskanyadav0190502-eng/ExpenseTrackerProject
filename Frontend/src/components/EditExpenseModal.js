import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import './EditExpenseModal.css';

const EditExpenseModal = ({ expense, onClose, onExpenseUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Education',
    'Other'
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || '',
        date: expense.date || '',
        description: expense.description || ''
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await expenseService.updateExpense(expense.id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      alert('Expense updated successfully!');
      
      if (onExpenseUpdated) {
        onExpenseUpdated();
      }
    } catch (error) {
      alert('Failed to update expense. Please try again.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Expense</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-title">Title *</label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense title"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-amount">Amount (₹) *</label>
            <input
              type="number"
              id="edit-amount"
              name="amount"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.amount && <span className="error">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-category">Category *</label>
            <select
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-date">Date *</label>
            <input
              type="date"
              id="edit-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description (Optional)</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
