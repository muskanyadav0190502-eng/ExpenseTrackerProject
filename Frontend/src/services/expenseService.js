import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/expenses';

const expenseService = {
  // GET all expenses
  getAllExpenses: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // GET expense by id
  getExpenseById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  // POST create new expense
  createExpense: async (expense) => {
    try {
      const response = await axios.post(API_BASE_URL, expense);
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // PUT update expense
  updateExpense: async (id, expense) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, expense);
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // DELETE expense
  deleteExpense: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
};

export default expenseService;
