# ExpenseTracker

A full-stack OLTP workload Expense Tracker built with React + Spring Boot + MySQL, designed to behave correctly under real-world conditions such as unreliable networks, retries, and page refreshes.

**For technical architecture and database schema details, please see [High-Level Design (HLD)](HLD.md).**

## Tech Stack

- **Backend**: Java 17, Spring Boot, Spring Data JPA
- **Database**: MySQL 
- **Frontend**: React (Vite)

## Key Design Decisions

The following choices were made to meet the "production-like quality" requirement within the scope of this assignment.

### 1. Why MySQL?
While any persistence mechanism was allowed, MySQL was chosen over simpler options (SQLite/JSON) because:
- **ACID Compliance**: Essential for financial data integrity.
- **Strong Typing**: Ensures data correctness (e.g., DECIMAL types).
- **Concurrency**: Better handling of multiple simultaneous requests compared to file-based storage.

### 2. Money Handling Strategy
We use `BigDecimal` in Java and `DECIMAL(19,2)` in MySQL.
- **Why?**: Floating-point types (`float`, `double`) introduce precision errors during calculations. Financial systems require exact representation of currency values.

### 3. Idempotency for Reliability
The assignment requires handling "unreliable networks" and "multiple submit clicks".
- **Solution**: The frontend generates a unique `idempotency_key` (UUID) for each submission attempt.
- **Benefit**: If the network fails but the server received the request, a retry with the same key will simply return the existing success response, preventing duplicate charges/entries.

## Trade-offs & Intentionally Omitted Scope

Due to the time-boxed nature of this assignment, the following were intentionally omitted to focus on core correctness:
- **Authentication**: No login/user separation; the app is single-tenant for demonstration.
- **Pagination**: The `GET /expenses` endpoint returns all records. In a real production system, server-side pagination would be mandatory.
- **Microservices**: A monolithic architecture is appropriate and more maintainable for this scale.
- **Advanced Validation**: Basic validation exists, but comprehensive rule engines were skipped.
- **Docker/CI**: Deployment scripts are not included.

## How to Run

### Backend
1. Configure a local MySQL database named `expensetracker`.
2. Update `src/main/resources/application.properties` with your credentials.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Server runs on: `http://localhost:8080`

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Runs on: `http://localhost:5173` (Vite default)