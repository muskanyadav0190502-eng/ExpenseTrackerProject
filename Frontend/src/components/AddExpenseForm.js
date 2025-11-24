import React, { useState } from 'react';
import expenseService from '../services/expenseService';
import './AddExpenseForm.css';

const AddExpenseForm = ({ onExpenseAdded }) => {
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
    'Groceries',
    'Transit',
    'Entertainment',
    'Shopping',
    'Bills & Fees',
    'Healthcare',
    'Gifts',
    'Beauty',
    'Travel',
    'Utilities',
    'Other'
  ];

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
      await expenseService.createExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
        description: ''
      });
      
      setErrors({});
      
      // Notify parent component
      if (onExpenseAdded) {
        onExpenseAdded();
      }
      
      alert('Expense added successfully!');
    } catch (error) {
      alert('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="add-expense-form">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter expense title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="1.00"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
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
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional notes..."
            rows="3"
          />
        </div>

        <button type="submit" className="btn-primary">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
