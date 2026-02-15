package com.example.backend.service;

import com.example.backend.dto.ExpenseDTO;
import com.example.backend.model.Expense;
import com.example.backend.model.User;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        // Idempotency Check
        if (expenseDTO.getIdempotencyKey() != null) {
            Optional<Expense> existing = expenseRepository.findByIdempotencyKey(expenseDTO.getIdempotencyKey());
            if (existing.isPresent()) {
                return mapToDTO(existing.get());
            }
        }

        User user = userRepository.findById(expenseDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + expenseDTO.getUserId()));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setDescription(expenseDTO.getDescription());
        expense.setExpenseDate(expenseDTO.getExpenseDate());
        expense.setIdempotencyKey(expenseDTO.getIdempotencyKey());

        Expense saved = expenseRepository.save(expense);
        return mapToDTO(saved);
    }

    public List<ExpenseDTO> getExpenses(UUID userId, String category, String sort) {
        // Determine Sort
        Sort sortObj = Sort.by(Sort.Direction.DESC, "expenseDate");
        if ("date_asc".equalsIgnoreCase(sort)) {
            sortObj = Sort.by(Sort.Direction.ASC, "expenseDate");
        } else if ("amount_desc".equalsIgnoreCase(sort)) {
            sortObj = Sort.by(Sort.Direction.DESC, "amount");
        } else if ("amount_asc".equalsIgnoreCase(sort)) {
            sortObj = Sort.by(Sort.Direction.ASC, "amount");
        }

        List<Expense> expenses;
        if (category != null && !category.isEmpty()) {
            expenses = expenseRepository.findByUserIdAndCategory(userId, category, sortObj);
        } else {
            expenses = expenseRepository.findByUserId(userId, sortObj);
        }

        return expenses.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private ExpenseDTO mapToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setUserId(expense.getUser().getId());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setDescription(expense.getDescription());
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setIdempotencyKey(expense.getIdempotencyKey());
        return dto;
    }
}
