package com.example.backend.repository;

import com.example.backend.model.Expense;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findByUserId(UUID userId, Sort sort);

    List<Expense> findByUserIdAndCategory(UUID userId, String category, Sort sort);

    Optional<Expense> findByIdempotencyKey(String idempotencyKey);
}
