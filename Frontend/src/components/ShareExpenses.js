import React, { useState } from 'react';
import './ShareExpenses.css';

const ShareExpenses = ({ expenses }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFormat, setShareFormat] = useState('summary');
  const [dateRange, setDateRange] = useState('all');

  const getFilteredExpenses = () => {
    const now = new Date();
    let filtered = [...expenses];

    switch (dateRange) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = expenses.filter(e => new Date(e.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = expenses.filter(e => new Date(e.date) >= monthAgo);
        break;
      default:
        break;
    }

    return filtered;
  };

  const generateSummaryText = () => {
    const filtered = getFilteredExpenses();
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    
    const byCategory = {};
    filtered.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    let text = `💰 Expense Report (${dateRange === 'all' ? 'All Time' : dateRange === 'week' ? 'Last 7 Days' : 'Last 30 Days'})\n\n`;
    text += `Total Expenses: ₹${total.toFixed(2)}\n`;
    text += `Number of Expenses: ${filtered.length}\n\n`;
    text += `📊 By Category:\n`;
    
    Object.entries(byCategory).forEach(([cat, amount]) => {
      const percentage = ((amount / total) * 100).toFixed(1);
      text += `• ${cat}: ₹${amount.toFixed(2)} (${percentage}%)\n`;
    });

    return text;
  };

  const generateDetailedText = () => {
    const filtered = getFilteredExpenses();
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);

    let text = `💰 Detailed Expense Report\n`;
    text += `Period: ${dateRange === 'all' ? 'All Time' : dateRange === 'week' ? 'Last 7 Days' : 'Last 30 Days'}\n\n`;
    
    filtered.forEach((expense, index) => {
      text += `${index + 1}. ${expense.title}\n`;
      text += `   Amount: ₹${expense.amount.toFixed(2)}\n`;
      text += `   Category: ${expense.category}\n`;
      text += `   Date: ${new Date(expense.date).toLocaleDateString()}\n`;
      if (expense.description) {
        text += `   Note: ${expense.description}\n`;
      }
      text += `\n`;
    });

    text += `\n━━━━━━━━━━━━━━━━━━━\n`;
    text += `Total: ₹${total.toFixed(2)}\n`;

    return text;
  };

  const generateCSV = () => {
    const filtered = getFilteredExpenses();
    let csv = 'Title,Amount,Category,Date,Description\n';
    
    filtered.forEach(expense => {
      csv += `"${expense.title}","${expense.amount}","${expense.category}","${expense.date}","${expense.description || ''}"\n`;
    });

    return csv;
  };

  const handleShare = async () => {
    let content;
    let filename;
    let type;

    if (shareFormat === 'csv') {
      content = generateCSV();
      filename = 'expenses.csv';
      type = 'text/csv';
    } else if (shareFormat === 'detailed') {
      content = generateDetailedText();
      filename = 'expense-report.txt';
      type = 'text/plain';
    } else {
      content = generateSummaryText();
      filename = 'expense-summary.txt';
      type = 'text/plain';
    }

    // Try to use Web Share API first
    if (navigator.share && shareFormat !== 'csv') {
      try {
        await navigator.share({
          title: 'Expense Report',
          text: content
        });
        return;
      } catch (error) {
        // If sharing fails, fall back to download
        console.log('Share failed, downloading instead');
      }
    }

    // Fallback to download
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const content = shareFormat === 'detailed' ? generateDetailedText() : generateSummaryText();
    navigator.clipboard.writeText(content).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  return (
    <div className="share-expenses">
      <button className="share-btn" onClick={() => setShowShareModal(true)}>
        📤 Share Report
      </button>

      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>📤 Share Expense Report</h3>
              <button className="close-btn" onClick={() => setShowShareModal(false)}>
                ✕
              </button>
            </div>

            <div className="share-options">
              <div className="option-group">
                <label>Date Range:</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="all">All Time</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div className="option-group">
                <label>Format:</label>
                <select value={shareFormat} onChange={(e) => setShareFormat(e.target.value)}>
                  <option value="summary">Summary</option>
                  <option value="detailed">Detailed List</option>
                  <option value="csv">CSV (Excel)</option>
                </select>
              </div>
            </div>

            <div className="share-preview">
              <h4>Preview:</h4>
              <pre className="preview-content">
                {shareFormat === 'csv' ? generateCSV().substring(0, 200) + '...' : 
                 shareFormat === 'detailed' ? generateDetailedText().substring(0, 300) + '...' : 
                 generateSummaryText()}
              </pre>
            </div>

            <div className="share-actions">
              <button className="copy-btn" onClick={copyToClipboard}>
                📋 Copy to Clipboard
              </button>
              <button className="download-btn" onClick={handleShare}>
                {shareFormat === 'csv' ? '💾 Download CSV' : '📤 Share/Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareExpenses;
