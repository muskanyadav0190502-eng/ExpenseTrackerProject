import React, { useState, useEffect } from 'react';
import './ExpenseChallenges.css';

const ExpenseChallenges = ({ expenses }) => {
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const predefinedChallenges = [
    {
      id: 'no-eating-out-7',
      title: 'No Eating Out',
      description: 'Avoid restaurant expenses for 7 days',
      duration: 7,
      category: 'Food',
      badge: '🍽️',
      points: 100
    },
    {
      id: 'no-shopping-14',
      title: 'Shopping Freeze',
      description: 'No shopping expenses for 14 days',
      duration: 14,
      category: 'Shopping',
      badge: '🛒',
      points: 150
    },
    {
      id: 'no-entertainment-7',
      title: 'Entertainment Detox',
      description: 'No entertainment expenses for 7 days',
      duration: 7,
      category: 'Entertainment',
      badge: '🎬',
      points: 100
    },
    {
      id: 'budget-saver',
      title: 'Budget Saver',
      description: 'Keep daily expenses under ₹500 for 7 days',
      duration: 7,
      category: 'All',
      badge: '💰',
      points: 200,
      type: 'budget'
    }
  ];

  useEffect(() => {
    // Load active and completed challenges from localStorage
    const savedChallenges = localStorage.getItem('activeChallenges');
    const savedCompleted = localStorage.getItem('completedChallenges');
    
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }
    if (savedCompleted) {
      setCompletedChallenges(JSON.parse(savedCompleted));
    }
  }, []);

  useEffect(() => {
    // Check challenge progress when expenses change
    checkChallengeProgress();
  }, [expenses, challenges]);

  const checkChallengeProgress = () => {
    const updatedChallenges = challenges.map(challenge => {
      const startDate = new Date(challenge.startDate);
      const today = new Date();
      const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      
      if (daysPassed >= challenge.duration) {
        // Challenge period ended, check if completed
        const challengeExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= today;
        });

        let completed = false;
        if (challenge.type === 'budget') {
          // Check if daily expenses were under budget
          const dailyExpenses = getDailyExpenses(challengeExpenses, challenge.duration);
          completed = dailyExpenses.every(day => day <= 500);
        } else {
          // Check if no expenses in that category
          const categoryExpenses = challengeExpenses.filter(e => e.category === challenge.category);
          completed = categoryExpenses.length === 0;
        }

        if (completed) {
          completeChallenge(challenge);
        }
        return null; // Remove from active challenges
      }

      // Update progress
      const challengeExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= today && expense.category === challenge.category;
      });

      return {
        ...challenge,
        daysPassed,
        failed: challengeExpenses.length > 0 && challenge.type !== 'budget'
      };
    }).filter(Boolean);

    if (JSON.stringify(updatedChallenges) !== JSON.stringify(challenges)) {
      setChallenges(updatedChallenges);
      localStorage.setItem('activeChallenges', JSON.stringify(updatedChallenges));
    }
  };

  const getDailyExpenses = (expenses, days) => {
    const dailyTotals = {};
    expenses.forEach(expense => {
      const date = expense.date;
      dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
    });
    return Object.values(dailyTotals);
  };

  const startChallenge = (challenge) => {
    const newChallenge = {
      ...challenge,
      startDate: new Date().toISOString().split('T')[0],
      daysPassed: 0
    };
    const updatedChallenges = [...challenges, newChallenge];
    setChallenges(updatedChallenges);
    localStorage.setItem('activeChallenges', JSON.stringify(updatedChallenges));
  };

  const completeChallenge = (challenge) => {
    const completed = {
      ...challenge,
      completedDate: new Date().toISOString().split('T')[0]
    };
    const updatedCompleted = [...completedChallenges, completed];
    setCompletedChallenges(updatedCompleted);
    localStorage.setItem('completedChallenges', JSON.stringify(updatedCompleted));
    
    // Remove from active challenges
    const updatedChallenges = challenges.filter(c => c.id !== challenge.id);
    setChallenges(updatedChallenges);
    localStorage.setItem('activeChallenges', JSON.stringify(updatedChallenges));
  };

  const cancelChallenge = (challengeId) => {
    const updatedChallenges = challenges.filter(c => c.id !== challengeId);
    setChallenges(updatedChallenges);
    localStorage.setItem('activeChallenges', JSON.stringify(updatedChallenges));
  };

  const getTotalPoints = () => {
    return completedChallenges.reduce((sum, ch) => sum + ch.points, 0);
  };

  const getAvailableChallenges = () => {
    const activeChallengeIds = challenges.map(c => c.id);
    return predefinedChallenges.filter(ch => !activeChallengeIds.includes(ch.id));
  };

  return (
    <div className="expense-challenges">
      <div className="challenges-header">
        <h3>🏆 Expense Challenges</h3>
        <div className="total-points">
          <span className="points-label">Total Points:</span>
          <span className="points-value">{getTotalPoints()}</span>
        </div>
      </div>

      {challenges.length > 0 && (
        <div className="active-challenges">
          <h4>Active Challenges</h4>
          <div className="challenges-grid">
            {challenges.map((challenge) => (
              <div key={challenge.id} className={`challenge-card ${challenge.failed ? 'failed' : ''}`}>
                <div className="challenge-badge">{challenge.badge}</div>
                <h5>{challenge.title}</h5>
                <p className="challenge-desc">{challenge.description}</p>
                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(challenge.daysPassed / challenge.duration) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    Day {challenge.daysPassed}/{challenge.duration}
                  </span>
                </div>
                {challenge.failed && <span className="failed-badge">❌ Failed</span>}
                <button 
                  className="cancel-challenge-btn"
                  onClick={() => cancelChallenge(challenge.id)}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="available-challenges">
        <h4>Available Challenges</h4>
        <div className="challenges-grid">
          {getAvailableChallenges().map((challenge) => (
            <div key={challenge.id} className="challenge-card available">
              <div className="challenge-badge">{challenge.badge}</div>
              <h5>{challenge.title}</h5>
              <p className="challenge-desc">{challenge.description}</p>
              <div className="challenge-info">
                <span className="duration">📅 {challenge.duration} days</span>
                <span className="points">⭐ {challenge.points} pts</span>
              </div>
              <button 
                className="start-challenge-btn"
                onClick={() => startChallenge(challenge)}
              >
                Start Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      {completedChallenges.length > 0 && (
        <div className="completed-challenges">
          <h4>🎉 Completed Challenges</h4>
          <div className="completed-badges">
            {completedChallenges.map((challenge, index) => (
              <div key={index} className="completed-badge" title={challenge.title}>
                <span className="badge-icon">{challenge.badge}</span>
                <span className="badge-points">+{challenge.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseChallenges;
