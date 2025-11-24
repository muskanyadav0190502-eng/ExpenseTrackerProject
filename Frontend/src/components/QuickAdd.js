import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import './QuickAdd.css';

const QuickAdd = ({ onExpenseAdded }) => {
  const [favorites, setFavorites] = useState([]);
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [newFavorite, setNewFavorite] = useState({
    title: '',
    amount: '',
    category: '',
    emoji: '⚡'
  });

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

  const emojis = ['☕', '🍕', '🚗', '🎬', '🛒', '💊', '📚', '⚡', '🎮', '🏠'];

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('expenseFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveFavorites = (updatedFavorites) => {
    setFavorites(updatedFavorites);
    localStorage.setItem('expenseFavorites', JSON.stringify(updatedFavorites));
  };

  const handleQuickAdd = async (favorite) => {
    try {
      // Validate favorite data
      if (!favorite.title || !favorite.amount || !favorite.category) {
        alert('Invalid favorite data. Please recreate this favorite.');
        return;
      }

      const expenseData = {
        title: favorite.title,
        amount: parseFloat(favorite.amount),
        category: favorite.category,
        date: new Date().toISOString().split('T')[0],
        description: `Quick add: ${favorite.emoji} ${favorite.title}`
      };

      console.log('Creating expense:', expenseData);
      
      const result = await expenseService.createExpense(expenseData);
      
      console.log('Expense created:', result);
      
      if (onExpenseAdded) {
        onExpenseAdded();
      }
      
      alert(`✅ Added ${favorite.emoji} ${favorite.title} - ₹${favorite.amount}`);
    } catch (error) {
      console.error('Failed to add expense:', error);
      
      let errorMessage = 'Failed to add expense.';
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = '❌ Cannot connect to server. Please make sure the backend is running on http://localhost:8080';
      } else if (error.response) {
        errorMessage = `❌ Server error: ${error.response.data?.message || error.response.statusText || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = '❌ No response from server. Please check if backend is running.';
      } else {
        errorMessage = `❌ Error: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleAddFavorite = () => {
    if (!newFavorite.title || !newFavorite.amount || !newFavorite.category) {
      alert('Please fill all fields');
      return;
    }

    const updatedFavorites = [...favorites, { ...newFavorite, id: Date.now() }];
    saveFavorites(updatedFavorites);
    
    setNewFavorite({ title: '', amount: '', category: '', emoji: '⚡' });
    setShowAddFavorite(false);
  };

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    saveFavorites(updatedFavorites);
  };

  return (
    <div className="quick-add-container">
      <div className="quick-add-header">
        <h3>⚡ Quick Add Favorites</h3>
        <button 
          className="add-favorite-btn"
          onClick={() => setShowAddFavorite(!showAddFavorite)}
        >
          {showAddFavorite ? '✕ Cancel' : '+ Add Favorite'}
        </button>
      </div>

      {showAddFavorite && (
        <div className="add-favorite-form">
          <div className="emoji-selector">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                className={`emoji-option ${newFavorite.emoji === emoji ? 'active' : ''}`}
                onClick={() => setNewFavorite({ ...newFavorite, emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Title (e.g., Morning Coffee)"
            value={newFavorite.title}
            onChange={(e) => setNewFavorite({ ...newFavorite, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            step="0.01"
            value={newFavorite.amount}
            onChange={(e) => setNewFavorite({ ...newFavorite, amount: e.target.value })}
          />
          <select
            value={newFavorite.category}
            onChange={(e) => setNewFavorite({ ...newFavorite, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="save-favorite-btn" onClick={handleAddFavorite}>
            Save Favorite
          </button>
        </div>
      )}

      <div className="favorites-list">
        {favorites.length === 0 ? (
          <p className="no-favorites">No favorites yet. Add your frequently used expenses!</p>
        ) : (
          favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-item">
              <button
                className="favorite-btn"
                onClick={() => handleQuickAdd(favorite)}
              >
                <span className="favorite-emoji">{favorite.emoji}</span>
                <span className="favorite-title">{favorite.title}</span>
                <span className="favorite-amount">₹{favorite.amount}</span>
              </button>
              <button
                className="remove-favorite-btn"
                onClick={() => handleRemoveFavorite(favorite.id)}
                title="Remove favorite"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickAdd;
