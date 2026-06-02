# Full Runnable Test Impact Analysis (TIA) Demo

A comprehensive demonstration of test impact analysis, traceability mapping, and intelligent test selection to optimize test execution cycles while maintaining code quality.

## Goal

The primary goal of this solution is to enable **intelligent test selection and execution** by analyzing the relationship between code changes and automated tests. This reduces test execution time by running only the tests that are impacted by specific code changes, while maintaining complete traceability of which tests validate which functionality.

## Objectives

1. **Code Change Traceability**: Map the relationship between code components and the tests that validate them
2. **Test Impact Analysis**: Identify which tests are affected by changes in specific code files
3. **Selective Test Execution**: Run only the impacted tests instead of the entire test suite
4. **Performance Optimization**: Reduce overall test execution time and CI/CD pipeline duration
5. **Risk Mitigation**: Ensure that all affected functionality is tested even after selective execution
6. **Complete Visibility**: Provide a clear audit trail of test-to-code mappings and impact chains

## How This Solution Helps in Finding Traceability

### Problem Statement
In large applications, understanding which tests validate specific features is challenging. When code changes, determining affected tests manually is error-prone and time-consuming.

### Solution Approach
This solution implements a **3-step traceability and impact analysis engine**:

1. **Mapping Collection** (`collect-mapping.js`): Scans test files to identify which components, functions, and features they test
2. **Impact Analysis** (`impact-analysis.js`): Analyzes the collected mappings to determine which tests are impacted by code changes
3. **Selective Execution** (`selective-run.js`): Runs only the impacted tests based on the analysis

### Key Benefits
- **Complete Audit Trail**: Know exactly which tests validate which code
- **Reduced Feedback Time**: Get test results faster by running only affected tests
- **Change Confidence**: Know immediately what impact your code changes will have on test coverage
- **CI/CD Optimization**: Implement smart test gates that run appropriate test subsets

---

## Solution Components

This demo contains:

- **Angular Frontend**: User interface for demonstration
- **Spring Boot Backend**: REST API and business logic
- **Playwright Tests**: End-to-end test automation suite
- **Coverage Mapper**: Traceability mapping engine
- **Impact Analysis Engine**: Code change impact analyzer

---

# Prerequisites

Install the following tools to run this demo:

- **Java 17+**: Required for Spring Boot backend
- **Maven**: Java dependency management and build tool
- **Node.js 18+**: JavaScript runtime for frontend and test tools
- **Angular CLI**: Framework for the frontend application

Verify installation:

```bash
java -version
mvn -version
node -v
npm -v
ng version
```

---

# Setup and Execution Steps

## Step 1: Start Backend Server

**Intent**: Initialize the Spring Boot backend API server that provides the REST endpoints for the frontend application and test suite.

Open terminal 1 and run:

```bash
cd backend-springboot
mvn spring-boot:run
```

Expected output: Backend runs on `http://localhost:8080`

**Description**: This step compiles the Java backend, resolves dependencies, and starts the Spring Boot application server. The backend provides authentication, order management, and other business logic APIs that the frontend and tests interact with.

---

## Step 2: Start Frontend Application

**Intent**: Launch the Angular frontend application that provides the user interface for manual testing and demonstration of application functionality.

Open terminal 2 and run:

```bash
cd frontend-angular
npm install
npm start
```

Expected output: Frontend runs on `http://localhost:4200`

**Description**: This step installs frontend dependencies, starts the development server, and makes the Angular application available in the browser. The frontend serves as both a demonstration interface and a means to exercise the backend APIs that tests will also interact with.

---

## Step 3: Install Test Dependencies

**Intent**: Set up the Playwright testing framework and install all necessary libraries for running end-to-end automated tests.

Open terminal 3 and run:

```bash
cd playwright-tests
npm install
npx playwright install
```

**Description**: This step installs the Playwright test runner and its browser dependencies (Chromium, Firefox, WebKit). Playwright is configured to run tests against the frontend application, simulating real user interactions for login, checkout, and other critical workflows.

---

## Step 4: Execute Automated Tests

**Intent**: Run the complete test suite to establish a baseline of all available tests and generate initial test execution data.

Run the command:

```bash
npx playwright test
```

**Description**: Executes all Playwright test files (login.spec.js, checkout.spec.js) against the running frontend application. This generates test execution reports and data that will be used for traceability mapping. Tests validate critical user journeys like authentication and purchase workflows.

---

## Step 5: Generate Traceability Mapping

**Intent**: Analyze test files and create a comprehensive mapping of which tests validate which application features and code components.

Run the command:

```bash
cd ../coverage-mapper
node collect-mapping.js
```

**Description**: This script parses all test files to extract test names, assertions, and the features they test. It creates a traceability matrix (typically saved as `mapping.json`) that documents the relationship between tests and code functionality. This mapping is essential for impact analysis.

Output includes:
- Test-to-feature mappings
- Component-to-test relationships
- Feature coverage matrix

---

## Step 6: Run Impact Analysis

**Intent**: Analyze code changes and determine which tests are impacted by those changes based on the traceability mapping created in Step 5.

Run the command:

```bash
node impact-analysis.js
```

**Description**: This script reads the traceability mapping and any code change information, then calculates which tests are affected. It produces an impact report that identifies:
- Which code components changed
- Which features are impacted
- Which tests must be executed to validate the changes
- Detailed dependency chains showing the relationships

---

## Step 7: Execute Only Impacted Tests

**Intent**: Run only the tests that are affected by recent code changes, significantly reducing test execution time while maintaining quality assurance.

Run the command:

```bash
node selective-run.js
```

**Description**: This script reads the impact analysis results and triggers execution of only the affected tests. Instead of running the entire test suite, it uses Playwright to run only the tests identified as impacted. This provides:
- Faster feedback on code changes (typically 50-70% time reduction)
- Focused validation of change impact
- Complete audit trail of which tests validated which changes
- Ability to run full suite periodically for regression testing

---

# Backend and Frontend Code Change Traceability

This solution tracks **both backend and frontend code changes** and their impact on tests. Here's how it works with concrete examples:

## Backend Code Changes (Spring Boot / Java)

### Example: Modifying AuthController

**Scenario**: You modify `backend-springboot/src/main/java/com/demo/controller/AuthController.java` to change the login endpoint logic:

```java
@PostMapping("/api/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    // Modified authentication logic here
    return new LoginResponse("SUCCESS");
}
```

**Traceability Tracking**:

1. The `collect-mapping.js` script identifies that the `login test` (in `playwright-tests/login.spec.js`) validates this endpoint
2. It creates a mapping: `"login test" → ["backend-springboot/AuthController.java", "frontend-angular/app.js"]`
3. When you add `backend-springboot/src/main/java/com/demo/controller/AuthController.java` to `changed-files.txt`
4. The `impact-analysis.js` script detects the match and marks the `login test` as impacted
5. Only the `login test` runs, not the `checkout test`

**Files in This Chain**:
- Backend: `AuthController.java` (the API endpoint)
- Frontend: `app.js` (calls the API via `fetch()`)
- Test: `login.spec.js` (validates the login flow end-to-end)

### Example: Modifying OrderController

**Scenario**: You add new order processing logic to `backend-springboot/src/main/java/com/demo/controller/OrderController.java`:

```java
@GetMapping("/api/orders")
public String getOrders() {
    // New order retrieval logic
    return "ORDER_DATA";
}
```

**Impact Analysis Result**:
- Only `checkout test` is marked as impacted (maps to `OrderController.java`)
- `login test` is NOT run (doesn't depend on `OrderController.java`)

---

## Frontend Code Changes (Angular / JavaScript)

### Example: Modifying Login Button Handler

**Scenario**: You modify `frontend-angular/app.js` to enhance the login flow:

```javascript
document.getElementById('loginBtn')
  .addEventListener('click', async () => {
    // Enhanced validation and error handling
    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      window.location.href = '/dashboard.html';
    }
  });
```

**Traceability Tracking**:

1. The mapping identifies: `"login test" → ["frontend-angular/app.js", "backend-springboot/AuthController.java"]`
2. When `frontend-angular/app.js` is in `changed-files.txt`
3. The `impact-analysis.js` script finds the match
4. The `login test` is marked as impacted
5. Playwright runs the `login test` which:
   - Fills the login form (tests your frontend changes)
   - Clicks the login button (exercises your modified handler)
   - Expects to be redirected to dashboard (validates the flow)

### Example: Modifying Checkout Handler

**Scenario**: You change the checkout button behavior in `app.js`:

```javascript
document.getElementById('checkoutBtn')
  .addEventListener('click', async () => {
    const response = await fetch('http://localhost:8080/api/orders');
    const data = await response.text();
    document.getElementById('result').innerText = `Orders: ${data}`;
  });
```

**Impact Analysis Result**:
- Only `checkout test` is impacted (tests this specific handler)
- `login test` is NOT run (independent feature)

---

## Complete Example: Multi-Layer Code Change

### Scenario: User Authentication Enhancement

You modify both backend and frontend:

1. **Backend Change**: `AuthController.java` - Add token-based authentication
2. **Frontend Change**: `app.js` - Store and send authentication token

**Traceability**:
```json
{
  "login test": [
    "frontend-angular/app.js",
    "backend-springboot/AuthController.java"
  ]
}
```

**Changed Files**:
```
backend-springboot/src/main/java/com/demo/controller/AuthController.java
frontend-angular/app.js
```

**Impact Analysis**:
- Both files are in the mapping for `login test`
- Result: `login test` is impacted and will run
- This single test validates your changes across both layers

---

## Traceability Mapping Details

### How Mapping is Generated

The `collect-mapping.js` script analyzes:

1. **Test Files** (`playwright-tests/*.spec.js`):
   - Extracts test names (e.g., "login test", "checkout test")
   - Identifies what URLs they navigate to
   - Identifies what API endpoints they call

2. **Frontend Files** (`frontend-angular/app.js`):
   - Identifies which API endpoints are called
   - Maps handlers to test names

3. **Backend Files** (`backend-springboot/src/main/java/com/demo/controller/*.java`):
   - Identifies which endpoints match test expectations
   - Creates the link between tests and backend controllers

### Generated Mapping Output

File: `coverage-mapper/traceability.json`
```json
{
  "login test": [
    "frontend-angular/app.js",
    "backend-springboot/AuthController.java"
  ],
  "checkout test": [
    "frontend-angular/app.js",
    "backend-springboot/OrderController.java"
  ]
}
```

---

# Workflow Architecture

## Complete Workflow

```
┌──────────────────────────────────────────────────────────┐
│ Code Changes Detected                                    │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Backend: AuthController.java, OrderController.java │  │
│ │ Frontend: app.js                                    │  │
│ └─────────────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ Step 5: Collect Mapping (collect-mapping.js)             │
│ - Scans Playwright test files                            │
│ - Extracts test-to-frontend file relationships           │
│ - Extracts test-to-backend file relationships            │
│ - Creates comprehensive traceability matrix              │
│ Output: traceability.json                                │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ Step 6: Impact Analysis (impact-analysis.js)             │
│ - Reads changed-files.txt                                │
│ - Matches backend files (Java controllers)               │
│ - Matches frontend files (JavaScript)                    │
│ - Identifies impacted tests                              │
│ Output: List of affected test names                      │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ Step 7: Selective Test Run (selective-run.js)            │
│ - Executes ONLY impacted tests                           │
│ - Validates changes across all layers                    │
│ - Reports pass/fail status                               │
│ - Maintains complete audit trail                         │
└──────────────────────────────────────────────────────────┘
```

## Detailed Data Flow

```
Code Changes
    │
    ├─→ backend-springboot/AuthController.java ─┐
    ├─→ backend-springboot/OrderController.java ┤
    ├─→ frontend-angular/app.js ────────────────┤
    └─→ changed-files.txt ◄──────────────────────┘
                 │
                 ▼
         [Impact Analysis]
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
    Test 1   Test 2    Test 3
   (login) (checkout) (other)
     RUN      RUN     SKIP
```

---

## Layered Impact Traceability

```
Test Layer (Playwright)
├─ login test ────→ Validates authentication flow
├─ checkout test ─→ Validates order processing
└─ [more tests]

Frontend Layer (Angular/JavaScript)
├─ app.js ────────→ Event handlers, API calls
└─ [components]

Backend Layer (Spring Boot Java)
├─ AuthController.java ──→ /api/login endpoint
├─ OrderController.java ─→ /api/orders endpoint
└─ [services]

Traceability Links
├─ login test ─────→ [app.js, AuthController.java]
├─ checkout test ──→ [app.js, OrderController.java]
└─ [test mappings]
```

## Integration Points

| Component | Purpose | Tracked Changes | Impact |
|-----------|---------|-----------------|--------|
| Backend (Spring Boot) | API server with business logic | `AuthController.java`, `OrderController.java` and services | Tests depending on these endpoints are marked impacted |
| Frontend (Angular/JS) | UI with event handlers and API calls | `app.js`, component files | Tests exercising these UIs are marked impacted |
| Tests (Playwright) | Automated E2E validation | `login.spec.js`, `checkout.spec.js` | These validate both frontend and backend together |
| Mapper (Coverage Mapper) | Traceability relationship builder | `collect-mapping.js` scans all layers | Creates JSON mapping of test → [frontend files, backend files] |
| Analyzer (Impact Analysis) | Change impact calculator | `impact-analysis.js` reads `changed-files.txt` | Matches changed files against traceability to identify impacted tests |

---

# Practical Scenarios

## Scenario 1: Bug Fix in Backend Only

**Change**: Fix a bug in `AuthController.java` login endpoint

```
changed-files.txt:
  backend-springboot/src/main/java/com/demo/controller/AuthController.java

Traceability Mapping:
  "login test" → ["frontend-angular/app.js", "backend-springboot/AuthController.java"]

Impact Analysis Result:
  ✓ login test (impacted) → RUNS
  ✗ checkout test (not impacted) → SKIPPED
```

**Execution**: Only `login test` runs (saves ~50% of test time)

---

## Scenario 2: Feature Enhancement in Frontend

**Change**: Enhance the checkout UI in `frontend-angular/app.js`

```
changed-files.txt:
  frontend-angular/app.js

Traceability Mapping:
  "checkout test" → ["frontend-angular/app.js", "backend-springboot/OrderController.java"]

Impact Analysis Result:
  ✓ checkout test (impacted) → RUNS
  ✗ login test (not impacted) → SKIPPED
```

**Execution**: Only `checkout test` runs to validate UI changes

---

## Scenario 3: API Response Structure Change

**Change**: Modify the response format in `OrderController.java`

```
changed-files.txt:
  backend-springboot/src/main/java/com/demo/controller/OrderController.java

Traceability Mapping:
  "checkout test" → ["frontend-angular/app.js", "backend-springboot/OrderController.java"]

Impact Analysis Result:
  ✓ checkout test (impacted) → RUNS (validates new response format)
  ✗ login test (not impacted) → SKIPPED
```

**Execution**: Frontend code that parses the response is validated by the test

---

## Scenario 4: Multi-Layer Change (Best Case for TIA)

**Change**: Both frontend and backend modified for a new feature

```
changed-files.txt:
  backend-springboot/src/main/java/com/demo/controller/NewFeatureController.java
  frontend-angular/app.js

Traceability Mapping:
  "login test" → ["frontend-angular/app.js", "backend-springboot/AuthController.java"]
  "checkout test" → ["frontend-angular/app.js", "backend-springboot/OrderController.java"]
  "new feature test" → ["frontend-angular/app.js", "backend-springboot/NewFeatureController.java"]

Impact Analysis Result:
  ✓ login test (impacted - app.js changed) → RUNS
  ✓ checkout test (impacted - app.js changed) → RUNS
  ✓ new feature test (impacted - new controller) → RUNS
```

**Benefit**: System ensures changes across all layers are validated holistically

---

# Key Features

✅ **End-to-End Demonstration**: Complete working application with all components
✅ **Traceability Mapping**: Automatic extraction of test-to-code relationships
✅ **Impact Analysis**: Intelligent determination of affected tests
✅ **Selective Execution**: Run only necessary tests for faster feedback
✅ **Audit Trail**: Complete visibility into test-code relationships
✅ **Real-World Patterns**: Production-ready architecture and patterns

---

# Next Steps After Running the Demo

1. **Examine Mapping Output**: Check `coverage-mapper/traceability.json` to see test-to-code relationships
2. **Test Backend Changes**: Modify `AuthController.java` or `OrderController.java` and add the file path to `changed-files.txt`, then run impact analysis
3. **Test Frontend Changes**: Modify `frontend-angular/app.js` and re-run the mapper to see which tests are affected
4. **Multi-Layer Testing**: Change both backend and frontend files simultaneously to see how impact analysis handles multi-layer changes
5. **Integrate with CI/CD**: Adapt the selective-run.js pattern into your Jenkins/GitHub Actions/GitLab CI pipelines
6. **Expand Coverage**: Add more backend controllers, frontend handlers, and tests to see how the system scales

---

# Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 already in use | Change backend port or kill existing process using `lsof -i :8080` |
| Port 4200 already in use | Kill existing Angular dev server or use `--port` flag |
| Playwright tests fail | Ensure backend and frontend are running on correct ports |
| Mapping generation fails | Verify all test files follow expected naming conventions |
| Import errors in backend | Run `mvn clean install` to rebuild dependencies |

---

# Contributing and Customization

This demo is designed to be extended:

- **Add More Tests**: Create additional .spec.js files in playwright-tests/
- **Add Backend Endpoints**: Extend AuthController.java and OrderController.java
- **Enhance Mapping Logic**: Customize collect-mapping.js to extract different metadata
- **Extend Impact Analysis**: Modify impact-analysis.js to handle additional scenarios

---

# Contact & Support

For questions about test impact analysis concepts, traceability mapping, or implementation details, refer to the respective code files and inline documentation.
