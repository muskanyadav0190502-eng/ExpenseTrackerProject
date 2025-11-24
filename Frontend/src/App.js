import React, { useState, useEffect } from 'react';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import MotivationalQuotes from './components/MotivationalQuotes';
import ThemeToggle from './components/ThemeToggle';
import QuickAdd from './components/QuickAdd';
import ExpenseChallenges from './components/ExpenseChallenges';
import ShareExpenses from './components/ShareExpenses';
import LoadingSpinner from './components/LoadingSpinner';
import ConnectionTest from './components/ConnectionTest';
import expenseService from './services/expenseService';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    // Trigger a refresh of the expense list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Expense Tracker</h1>
            <p>Track your expenses and try not to get broke</p>
          </div>
          <ShareExpenses expenses={expenses} />
        </div>
      </header>

      <main className="app-content">
        <div className="container">
          <ThemeToggle />
          <MotivationalQuotes />
          <QuickAdd onExpenseAdded={handleExpenseAdded} />
          <ExpenseChallenges expenses={expenses} />
          <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
          {loading ? (
            <LoadingSpinner message="Loading your expenses..." />
          ) : (
            <ExpenseList refreshTrigger={refreshTrigger} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2025 Expense Tracker. Built with React & Spring Boot</p>
      </footer>
    </div>
  );
}

export default App;
