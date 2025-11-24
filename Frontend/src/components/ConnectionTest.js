import React, { useState } from 'react';
import expenseService from '../services/expenseService';
import './ConnectionTest.css';

const ConnectionTest = () => {
  const [status, setStatus] = useState('');
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setStatus('Testing connection...');

    try {
      const expenses = await expenseService.getAllExpenses();
      setStatus(`✅ Connected! Found ${expenses.length} expenses.`);
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setStatus('❌ Cannot connect to backend. Make sure it\'s running on http://localhost:8080');
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setTesting(false);
    }
  };

  const testAddExpense = async () => {
    setTesting(true);
    setStatus('Testing expense creation...');

    try {
      const testExpense = {
        title: 'Test Expense',
        amount: 10.00,
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        description: 'Connection test'
      };

      const result = await expenseService.createExpense(testExpense);
      setStatus(`✅ Expense created successfully! ID: ${result.id}`);
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setStatus('❌ Cannot connect to backend. Make sure it\'s running on http://localhost:8080');
      } else if (error.response) {
        setStatus(`❌ Server error: ${JSON.stringify(error.response.data)}`);
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="connection-test">
      <h4>🔧 Backend Connection Test</h4>
      <div className="test-buttons">
        <button onClick={testConnection} disabled={testing}>
          Test Connection
        </button>
        <button onClick={testAddExpense} disabled={testing}>
          Test Add Expense
        </button>
      </div>
      {status && (
        <div className={`test-status ${status.includes('✅') ? 'success' : 'error'}`}>
          {status}
        </div>
      )}
      <div className="test-info">
        <p><strong>Backend URL:</strong> http://localhost:8080</p>
        <p><strong>To start backend:</strong></p>
        <code>cd Backend && mvn spring-boot:run</code>
      </div>
    </div>
  );
};

export default ConnectionTest;
