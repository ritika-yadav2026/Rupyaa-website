# ZapCash – API List

This document lists all APIs used in the ZapCash project. The browser calls `NEXT_PUBLIC_API_URL` directly (no Next.js API proxy).

**Base URL:** `NEXT_PUBLIC_API_URL` (default: `https://lending-api.wecredit.click`)  
**Mock Base URL:** `NEXT_PUBLIC_MOCK_API_URL` (for mock/admin endpoints)

---

## Authentication

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| POST | `/api/v1/otp` | `lib/auth-api.ts` | Generate OTP for phone number. Body: `{ phoneNumber }` |
| POST | `/api/v1/auth/tokens/refresh` | `lib/auth-api.ts` | Refresh JWT. Body: `{ refreshToken }` |
| POST | `/api/v1/auth/sessions` | `lib/auth-api.ts` | Verify OTP and login. Body: `{ phoneNumber, otp }` |

---

## User

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/user/stage` | `lib/user-api.ts` | Get user stage. Query: `device` (web/android/ios) |
| GET | `/api/v1/user/personal-details` | `lib/user-api.ts` | Get personal details (auth required) |
| POST | `/api/v1/user/personal-details` | `lib/user-api.ts` | Submit personal and employment details. Body: `{ firstName?, lastName?, pincode, pan, dob, salary, gender?, employmentMode, declaredSalaryDay?, organization?, geolocation? }`; organization and salary day are sent for salaried users. |

---

## Eligibility & Loans

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/user/eligibility/experian` | `lib/eligibility-api.ts` | Trigger Experian soft pull. Query: `deviceType`.
| GET | `/api/v1/loans/active` | `lib/eligibility-api.ts` | Get active loan. Header: `platform: ZAPCASH` |

---

## Offer

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/offer/current` | `lib/eligibility-api.ts` | Get current offer (amount, tenure, payable). 
| POST | `/api/v1/offer/acceptance` | `lib/eligibility-api.ts` | Accept current offer. Body: `{}` |

---

## Bank Statement (BSA)

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| POST | `/api/v1/user/bank-statement/consent-url` | `lib/bank-statement-api.ts` | Get CART (Account Aggregator) consent URL. Body: `{ organizationName?, phoneNumber?, userName? }` |
| GET | `/api/v1/user/bank-statement/status` | `lib/bank-statement-api.ts` | Poll bank statement processing status |
| GET | `/api/v1/user/bank-statement/pending-status` | `lib/bank-statement-api.ts` | Get pending BSA status for manual upload flow |
| PUT | `/api/v1/user/bank-statement` | `lib/bank-statement-api.ts` | Upload bank statement PDF. FormData: `file`, `confidentialCode?` |

---

## Document Requests

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/document-requests` | `lib/document-requests-api.ts` | List document requests for authenticated user |
| POST | `/api/v1/document-requests/:requestId/attachments` | `lib/document-requests-api.ts` | Upload documents for a request. FormData with files |

---

## CBL (Credit Bureau Link)

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/cbl/stage` | `lib/cbl-api.ts` | Get redirection stage for CBL flow |

---

## Mock / Admin (uses Mock Proxy)

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/admin/mocks/bureau` | `lib/mock-api.ts` | List bureau mock data (mock page) |
| GET | `/api/v1/admin/mocks/pan` | `lib/mock-api.ts` | List PAN mock data (mock page) |

---

## Encryption Status (always plain JSON)

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/external/encryption` | `lib/encryption-status-api.ts` | Check if backend has encryption enabled. Response: `{ success, enableEncryption }` |

---

## Test / Internal

| Method | Endpoint | Lib | Description |
|-------|----------|-----|-------------|
| GET | `/api/v1/_test/users/:encryptedPayload` | `lib/get-user-encrypted-api.ts` | Encrypted get-user test endpoint. Payload in path |

---

## CORS & Encryption

- **Browser:** Calls the backend origin from `NEXT_PUBLIC_API_URL`. The API must allow your web origin in CORS when using direct requests.
- **Encryption:** Status is fetched from `GET /api/v1/external/encryption` on app init. When `enableEncryption: true`, request/response bodies use AES-128-GCM via `lib/api-encryption.ts`. Falls back to `API_ENCRYPTION_ENABLED` (read at runtime via `/api/encryption-fallback`) if fetch fails.

---

## Where APIs Are Used

| API | Used In |
|-----|---------|
| `generateOtp`, `checkOtpSignupLogin` | `app/auth/page.tsx` |
| `getUserStage`, `getExistingActiveLoan`, `getCurrentOffer`, `acceptOffer` | `components/home/HeroSection.tsx`, `lib/hero-card-logic.ts` |
| `getPersonalDetails`, `postPersonalDetails`, `postEmploymentDetails` | Loan application flow |
| `getUserEligibilityExperian` | Eligibility / soft pull flow |
| `getTempUrl`, `getUserBankStatementStatus`, `uploadBankStatement` | Bank statement / BSA flow |
| `getDocumentRequests`, `uploadDocument` | `app/(app)/document-requests/page.tsx` |
| `getRedirectionStage` | `components/RedirectionStageFetcher.tsx` |
| `getBureauMockData`, `getPanMockData` | `app/mock/page.tsx` |
| `getUserById` (encrypted) | `app/get-user/page.tsx` |
