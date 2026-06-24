# Barberly phase-by-phase coding-agent prompts

## How to use these prompts

1. Start one primary coding-agent thread by pasting the complete contents of `D:\Avinash_V2\Barberly\BARBERLY_CODING_AGENT_MASTER_PROMPT.md`.
2. Give that same thread only the relevant phase prompt below.
3. Do not send the next phase until the current phase reports `PASS` with evidence and you have reviewed it.
4. Keep the five target projects on coordinated feature branches. The UI-reference folders are read-only.

Every phase prompt below inherits all rules, paths, acceptance criteria, domain language, and reporting requirements from the master prompt. If there is a conflict, the master prompt wins.

## Phase 0 prompt — audit only

> Execute Phase 0 from the Barberly master prompt. Do not modify application code. Inspect all five target applications, both read-only UI-reference folders, git state, routes, API calls, models, integrations, environment examples, builds, and tests. Trace search, barber/doctor detail, slot, payment, appointment, partner, and admin flows end to end. Confirm that `barberly-platform` is untouched. Produce the four requested audit documents, baseline command results, a healthcare-term inventory, backend/schema duplication risks, and a file-level Phase 1 proposal. Stop after reporting `PASS`, `BLOCKED`, or `NEEDS APPROVAL`.

## Phase 1 prompt — contracts and migration design

> Execute Phase 1 only. Using the approved baseline, design the canonical Barberly domain, ERD, role-permission matrix, appointment state machine, money/timezone conventions, versioned API contracts, ownership between the two backends, compatibility adapters, and reversible Mongo migrations. Do not perform the broad application conversion yet. Add contract/schema tests where possible. Report exact artifacts and validation evidence, then stop.

## Phase 2 prompt — design system

> Execute Phase 2 only. Convert the read-only Barberly HTML/design references into reusable, responsive, accessible Angular design tokens and shared primitives in each appropriate target frontend. Do not paste Tailwind CDN markup and do not upgrade Angular versions. Build representative component/page previews, preserve existing behavior, run builds and accessibility/visual checks at mobile, tablet, and desktop widths, report evidence, then stop.

## Phase 3 prompt — backend domain foundation

> Execute Phase 3 only. Implement the reviewed Barberly models, enums, serializers, validation, indexes, authorization foundation, compatibility adapters, migration scripts, and barber/service/shop seed taxonomy across the two target backends. Preserve legacy data and reads; do not drop collections. Ensure all monetary values are consistently integer paise. Run migration dry-runs plus model/index/auth tests, report evidence, then stop.

## Phase 4 prompt — barber onboarding and partner APIs

> Execute Phase 4 only. Replace doctor onboarding/business operations with Barber, Shop, Shop Membership, Service Offering, Schedule, Time Off, KYC, Portfolio, Video, FAQ, Review Reply, Appointment, Earnings, Wallet, Payout, and Notification APIs. Support independent and shop-associated barbers. Remove medical requirements from new flows and enforce ownership/RBAC. Run positive and negative integration tests, report evidence, then stop.

## Phase 5 prompt — search and public barber APIs

> Execute Phase 5 only. Implement scalable public autocomplete, city/locality/name/specialty/category/service/shop search, filters, sorting, pagination, barber cards, full barber details, canonical Barberly URLs, SSR metadata, redirects from legacy doctor URLs, sitemaps, and correct 404 behavior. Return only approved active bookable records and safe public fields. Test relevance, contracts, performance, SEO, and data exposure, report evidence, then stop.

## Phase 6 prompt — availability and booking safety

> Execute Phase 6 only. Build availability from service duration, buffers, weekly schedules, breaks, exceptions, timezone, holds, and appointments. Implement expiring slot holds, idempotency, server-side price snapshots, and atomic protection against overlapping variable-duration bookings. Add parallel concurrency tests and comprehensive timezone/schedule tests. Do not proceed until the double-booking test proves a single winner. Report evidence, then stop.

## Phase 7 prompt — payment and financial correctness

> Execute Phase 7 only. Audit and complete the Razorpay order, signature, raw-body webhook, appointment finalization, refund, wallet, commission, and payout flow. Standardize all persisted money to integer paise. Make callbacks/webhooks idempotent and server-authoritative; handle callback loss, duplicate events, expired/conflicted holds, retries, and refunds. Run sandbox and reconciliation tests without exposing secrets, report evidence, then stop.

## Phase 8 prompt — customer frontend

> Execute Phase 8 only in the target Angular 21 customer frontend and required backend contract fixes. Implement the Barberly home/search experience, URL-backed results and filters, barber details with About/Services/Videos/FAQs/Reviews, a single booking state machine entered from either Book Appointment or a slot, verified payment result, and customer appointment management. Preserve SSR and use the approved design system. Remove public healthcare routes only with redirects. Run build, SSR, component, responsive, and E2E tests, report evidence, then stop.

## Phase 9 prompt — barber panel frontend

> Execute Phase 9 only in the Angular 20 partner frontend and necessary approved partner API contract fixes. Rebuild the doctor panel as the Barberly partner panel using the read-only reference pages. Implement onboarding, dashboard, appointments/calendar, services, shops, schedules/time off, earnings/payouts, reviews, profile/portfolio, videos, FAQs, notifications, and settings. Remove clinical features and wording. Run guard/RBAC, build, responsive visual, and E2E tests, report evidence, then stop.

## Phase 10 prompt — admin frontend

> Execute Phase 10 only in the Angular 14 super-admin frontend and necessary approved admin API contract fixes. Apply the admin reference theme and implement Dashboard, Appointments, Barbers, Shops, Customers, Services/Categories, Reviews, KYC, Payments, Payouts, Reports, CMS, Permissions, and Settings. Remove healthcare-only screens/routes, implement server-side tables and action-level RBAC, and retain financial/audit accuracy. Run builds, permission tests, responsive checks, and admin E2E tests, report evidence, then stop.

## Phase 11 prompt — notifications and policies

> Execute Phase 11 only. Convert email, SMS, in-app notification, receipt/invoice, calendar, reminder, cancellation, refund, review, KYC, and payout workflows to Barberly. Implement configurable cancellation/refund/no-show/commission/tax/travel-fee/payout rules, timezone-safe jobs, retries, and deduplication. Test templates, links, idempotency, and policy boundaries, report evidence, then stop.

## Phase 12 prompt — terminology and security audit

> Execute Phase 12 only. Search all source and user-visible output for old brand and healthcare terms, classify every remaining match, and remove all unexplained product remnants. Perform the full security and privacy audit defined in the master prompt, including RBAC/IDOR, injection, uploads, XSS, CORS, secrets, logging/PII, rate limits, payment/webhooks, and public-field exposure. Resolve all critical/high findings and rerun negative tests. Report evidence, then stop.

## Phase 13 prompt — release candidate validation

> Execute Phase 13 only. Perform clean lockfile installs, all builds/types/tests, migrations, contracts, complete E2E matrix, responsive/accessibility/slow-network/error testing, performance checks, staging deployment rehearsal, backup/rollback restoration, and operational documentation. Do not waive failures. Produce a release-candidate checklist with exact evidence and stop for UAT approval.

## Phase 14 prompt — controlled release

> Execute Phase 14 only after explicit production approval. Follow the approved backup, migration, backward-compatible deployment, smoke-test, monitoring, reconciliation, and rollback runbooks. Do not expose secrets or improvise destructive repair. Produce the final release report with versions, migrations, metrics, financial reconciliation, known limitations, and follow-up ownership.
