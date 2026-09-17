# Go for Beginners: Learning Roadmap

This guide turns the Go roadmap into an actionable step-by-step learning path for beginners.

## Month 1 — Fundamentals + 2 Small Projects

### 1) Learn Go basics (Week 1–2)
- Install Go from the official site and verify with `go version`
- Set up your editor:
  - VS Code + Go extension, or
  - GoLand
- Learn core syntax and language fundamentals:
  - Variables and constants
  - Functions
  - Loops and conditionals
  - Arrays, slices, maps
  - Structs and pointers
- Practice by building tiny CLI programs:
  - Number guesser
  - Unit converter
  - Basic calculator

### 2) Core Go concepts (Week 3–4)
- Learn packages and modules with `go mod`
- Understand methods and interfaces
- Practice error handling patterns
- Learn concurrency basics:
  - Goroutines
  - Channels
- Work with practical standard-library skills:
  - File I/O
  - JSON encode/decode
  - HTTP client and server basics

### Month 1 Milestone
- Build and finish **2 small projects**:
  1. CLI To-Do app
  2. Simple web scraper

---

## Month 2 — API + Database + Testing

### 3) Build beginner projects (Week 5–8)
- Create a REST API using `net/http`
- Add basic CRUD endpoints
- Add tests with Go’s `testing` package

### 4) Intermediate growth
- Introduce `context` in handlers/services
- Add basic middleware and logging
- Integrate PostgreSQL using:
  - `database/sql` (recommended for fundamentals), or
  - GORM (for faster development)
- Improve project structure with clean architecture basics
- Learn benchmarking and profiling (`go test -bench`, `pprof`)

### Month 2 Milestone
- Ship a REST API project with:
  - Database integration
  - Automated tests
  - Basic logging and middleware

---

## Month 3 — Concurrency + Deployment + Portfolio Project

### 5) Production-ready skills
- Improve unit and integration testing strategy
- Dockerize your Go application
- Add basic CI/CD (lint, test, build pipeline)
- Add observability:
  - Logs
  - Metrics
  - Tracing basics

### 6) Final project
- Build and deploy one end-to-end portfolio project combining:
  - REST API
  - Database
  - Concurrency features
  - Tests
  - Docker + CI

### Month 3 Milestone
- Publish your portfolio project with documentation and deployment instructions

---

## Suggested Learning Resources

- Official Go Tour: https://go.dev/tour/
- Go by Example: https://gobyexample.com/
- Effective Go: https://go.dev/doc/effective_go
- Exercism Go Track: https://exercism.org/tracks/go

## Recommended Weekly Routine

- **60% coding practice**
- **20% reading/documentation**
- **20% review and refactor**

Consistency beats intensity: focus on finishing small projects and steadily increasing complexity.
