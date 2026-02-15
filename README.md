# ExpenseTracker

A full-stack OLTP workload Expense Tracker built with React + Spring Boot + PostgreSQL, designed to behave correctly under real-world conditions such as unreliable networks, retries, and page refreshes.

> For technical architecture and database schema details, please see [High-Level Design (HLD)](HLD.md).

## Tech Stack

- **Backend**: Java 17, Spring Boot, Spring Data JPA
- **Database**: PostgreSQL
- **Frontend**: React (Vite)

## Key Design Decisions

The following choices were made to meet the "production-like quality" requirement within the scope of this assignment.

### 1. Why PostgreSQL?

While any persistence mechanism was allowed, PostgreSQL was chosen over simpler options (SQLite/JSON) because:

- **ACID Compliance**: Essential for financial data integrity.
- **Strong Typing & Constraints**: Native NUMERIC precision support ensures safe currency storage.
- **Native UUID Support**: PostgreSQL supports UUID as a first-class type, improving scalability and security.
- **Production Readiness**: Excellent concurrency control (MVCC) and transactional consistency.

### 2. Money Handling Strategy

We use `BigDecimal` in Java and `NUMERIC(19,2)` in PostgreSQL.

**Why?** Floating-point types (`float`, `double`) introduce precision errors during calculations. Financial systems require exact decimal representation. `NUMERIC(19,2)` ensures precision-safe storage aligned with currency standards.

### 3. Idempotency for Reliability

The assignment requires handling unreliable networks and duplicate submissions.

**Solution**: The frontend generates a unique `idempotency_key` (UUID) per submission. The backend enforces a UNIQUE constraint on `idempotency_key`. If a retry occurs, the existing record is returned instead of creating duplicates.

This guarantees safe retries under:
- Slow networks
- Page refreshes
- Multiple submit clicks

### 4. UUID as Primary Key

The system uses PostgreSQL's native UUID type as the primary key instead of auto-increment IDs.

**Benefits**:
- Non-sequential IDs (better security)
- Safer for distributed systems
- No database sequence dependency
- Scales better for future multi-node architecture

## Trade-offs & Intentionally Omitted Scope

Due to the time-boxed nature of this assignment, the following were intentionally omitted to focus on core correctness:

- **Authentication**: No login/user separation; the app is single-tenant for demonstration.
- **Pagination**: `GET /expenses` returns all records. Production systems require server-side pagination.
- **Microservices**: A monolithic architecture is appropriate and maintainable for this scale.
- **Advanced Validation**: Basic validation exists; complex rule engines were not implemented.
- **Docker/CI/CD**: Deployment automation is not included.

## How to Run

### Backend

1. Configure a PostgreSQL database (local or hosted).
2. Update `src/main/resources/application.properties` with your credentials.
3. Run the application:

```sh
./mvnw spring-boot:run
```

Server runs on: [http://localhost:8080](http://localhost:8080)

### Frontend

1. Install dependencies:

```sh
cd frontend
npm install
```

2. Start the development server:

```sh
npm run dev
```

Runs on: [http://localhost:5173](http://localhost:5173)