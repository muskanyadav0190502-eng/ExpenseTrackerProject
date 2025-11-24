import React, { useState, useEffect } from 'react';
import './MotivationalQuotes.css';

const MotivationalQuotes = () => {
  const quotes = [
    { text: "A penny saved is a penny earned.", author: "Benjamin Franklin" },
    { text: "Don't save what is left after spending; spend what is left after saving.", author: "Warren Buffett" },
    { text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought.", author: "T.T. Munger" },
    { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
    { text: "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.", author: "Ayn Rand" },
    { text: "The art is not in making money, but in keeping it.", author: "Proverb" },
    { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
    { text: "Every time you borrow money, you're robbing your future self.", author: "Nathan W. Morris" },
    { text: "Wealth is not about having a lot of money; it's about having a lot of options.", author: "Chris Rock" },
    { text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.", author: "Dave Ramsey" },
    { text: "Money looks better in the bank than on your feet.", author: "Sophia Amoruso" },
    { text: "The goal isn't more money. The goal is living life on your terms.", author: "Chris Brogan" }
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    // Set a random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const getNewQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  };

  return (
    <div className="motivational-quotes">
      <div className="quote-icon">💡</div>
      <div className="quote-content">
        <p className="quote-text">"{currentQuote.text}"</p>
        <p className="quote-author">- {currentQuote.author}</p>
      </div>
      <button className="refresh-quote-btn" onClick={getNewQuote} title="Get new quote">
        🔄
      </button>
    </div>
  );
};

export default MotivationalQuotes;
