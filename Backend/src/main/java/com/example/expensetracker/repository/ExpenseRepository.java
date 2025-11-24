package com.example.expensetracker.repository;

import com.example.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // JpaRepository provides all basic CRUD operations:
    // - save() for create/update
    // - findAll() for retrieving all
    // - findById() for retrieving by id
    // - deleteById() for deleting
}
