package com.example.backend.controller;

import com.example.backend.dto.ExpenseDTO;
import com.example.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend to access
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO created = expenseService.createExpense(expenseDTO);
        // If the ID matches what we just acted on (and assuming logic), simpler to just
        // return 201 usually.
        // But for idempotency, if it was existing, we might want 200.
        // The service returns the DTO. If it was existing, it has the same key.
        // We can't easily know if it was "newly created" or "existing" without extra
        // flag.
        // For this assignment, 201 or 200 are both fine logic-wise, but 200 for
        // existing is better.
        // I'll return 200/201 based on createdAt diff? No, that's brittle.
        // I'll just return 200 OK for everything to satisfy "API should behave
        // correctly... retries".
        // Actually, 201 is standard for create. If I return 200 for existing, I need to
        // know.
        // I'll assume 201 for now as it's "Created" or "Retrieved".
        // Use 201 if we want to be strict, but 200 is safer for generic success.
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getExpenses(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "date_desc") String sort) {
        List<ExpenseDTO> expenses = expenseService.getExpenses(userId, category, sort);
        return ResponseEntity.ok(expenses);
    }
}
