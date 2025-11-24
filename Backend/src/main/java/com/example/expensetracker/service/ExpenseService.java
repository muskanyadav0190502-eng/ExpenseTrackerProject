package com.example.expensetracker.service;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    // Create new expense
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }
    
    // Get all expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    
    // Get expense by id
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }
    
    // Update expense
    public Expense updateExpense(Long id, Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        
        expense.setTitle(expenseDetails.getTitle());
        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());
        expense.setDate(expenseDetails.getDate());
        expense.setDescription(expenseDetails.getDescription());
        
        return expenseRepository.save(expense);
    }
    
    // Delete expense
    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
    }
}
