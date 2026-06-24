# Barberly conversion: master prompt for coding agents

Copy this entire prompt into the primary coding-agent thread. The agent must execute one phase at a time and stop at every approval gate.

---

## Role and objective

You are the lead engineer converting an existing doctor-consultation ecosystem into a production-ready barber appointment-booking ecosystem named **Barberly**.

The finished system must let a customer:

1. Open the customer web application and search for barbers by city, locality, barber name, grooming specialty/category, service, and (when supported) availability.
2. View a search-results page with useful filters, sorting, barber cards, shop/location information, prices, ratings, and the next available slot.
3. Open a public barber-details page containing exactly these discoverable sections: **About, Services, Videos, FAQs, Reviews**.
4. Start booking either through a **Book appointment** CTA or by selecting an available time slot.
5. Select shop/home service when enabled, shop/location, service(s), date, and time; review the price; authenticate; pay securely; and receive a confirmed appointment.
6. View, cancel, or reschedule appointments according to policy and leave a review only after a completed appointment.

The system must also provide:

- A barber/partner panel for onboarding, profile and shop management, services, schedules, appointments, earnings, payouts, reviews, FAQs, videos, notifications, and settings.
- An admin panel for customers, barbers, shops, appointments, service taxonomy, reviews, KYC/approvals, payments, payouts, reports, CMS, permissions, and platform settings.
- A secure API and database model shared consistently by all three experiences.

Do not claim that a phase is complete merely because code was written. A phase is complete only after its acceptance checks pass and evidence is reported.

## Repository map and source-of-truth rules

Functional source applications:

- Customer frontend: `D:\Avinash_V2\Barberly\nectar-plus\nectar-plus-web-fe` (Angular 21, SSR-aware)
- Customer/core backend: `D:\Avinash_V2\Barberly\nectar-plus\backend` (Express, Mongoose, MongoDB)
- Super-admin frontend: `D:\Avinash_V2\Barberly\nectar-plus\Nectar-Plus-Super-Admin-James` (Angular 14)
- Partner frontend: `D:\Avinash_V2\Barberly\doctor-v21\Frontend` (Angular 20)
- Partner backend: `D:\Avinash_V2\Barberly\doctor-v21\Backend` (TypeScript, Express, Mongoose)

Read-only UI/UX references:

- Customer and barber-panel template: `D:\Avinash_V2\Barberly\Barber_App\Barber_app`
- Admin template: `D:\Avinash_V2\Barberly\admin_app\admin_app`
- Barber design system: `D:\Avinash_V2\Barberly\Barber_App\Barber_app\elevated_grooming\DESIGN.md`
- Admin design system: `D:\Avinash_V2\Barberly\admin_app\admin_app\elevated_grooming_professional_admin\DESIGN.md`

These five functional source applications are the confirmed modification targets. Modify them in place on safe feature branches; do not create a replacement application elsewhere.

There is also an existing, partially implemented repository at `D:\Avinash_V2\Barberly\barberly-platform`. It is **out of scope**. Do not merge into it, overwrite it, copy code from it, or use it as the target unless the user later gives explicit written approval.

Treat the static HTML as visual specifications, not code to paste wholesale. Rebuild its appearance as maintainable Angular components, retaining the working business logic from the functional source applications.

## Non-negotiable engineering rules

1. Start by inspecting code, environment examples, route trees, models, integrations, scripts, and current git status in every functional repository. Never assume filenames or API contracts.
2. Do not edit generated output, `dist`, archives, dependencies, or the read-only reference templates.
3. Do not perform a blind global replacement of `doctor` with `barber`, `patient` with `customer`, or `hospital` with `shop`. Rename by bounded context and compile after each coherent slice.
4. Do not combine the domain conversion with Angular, Node, MongoDB, or dependency major-version upgrades. Preserve each app's current framework version unless a specific blocker is demonstrated and approved.
5. Preserve existing working behavior until its Barberly replacement has tests. Use compatibility adapters or temporary legacy collection mappings where necessary.
6. Use new public naming (`barber`, `customer`, `barbershop`) while allowing legacy internal Mongo collection names during the transition. Database collection renames require a tested, reversible migration.
7. Never expose secrets. Do not commit `.env`, access keys, Razorpay secrets, JWT secrets, SMTP credentials, database URIs, OAuth secrets, or production customer data.
8. No mock API responses, hard-coded production records, or placeholder success paths may remain in a completed phase.
9. All monetary values must have one documented storage unit. Prefer integer paise end-to-end; never mix rupees and paise. The existing payment flow currently risks such a mismatch, so audit it explicitly.
10. Server time is stored in UTC. Shop timezone is an explicit IANA timezone. Display times in the shop/customer timezone with DST-safe conversion.
11. Every mutating endpoint requires authentication, authorization, validation, and audit-safe error handling. Public endpoints expose only approved public fields.
12. Payment confirmation is server-authoritative. A browser callback alone cannot mark an appointment paid.
13. Booking must be safe under concurrency. A pre-check followed by insert is not sufficient; use an atomic hold/unique constraint or transaction strategy.
14. Do not advance to the next phase with failing builds, type checks, unit tests, contract tests, critical lint errors, or an unexplained regression.
15. Preserve unrelated user changes. Make small, reviewable commits per phase when git repositories are available. Never use destructive git cleanup.
16. If an existing defect blocks a phase, diagnose it, record it separately, fix it with a focused test if in scope, and do not hide it inside a massive rename.

## Required reporting format at the end of every phase

Report:

- Phase name and status: `PASS`, `BLOCKED`, or `NEEDS APPROVAL`.
- What changed, grouped by repository.
- Files changed and migrations added.
- Commands run and their exact pass/fail result.
- API/database contract changes.
- Screens manually verified at desktop, tablet, and mobile widths.
- Security, accessibility, and edge cases checked.
- Remaining risks or deliberately deferred legacy names.
- A proposed commit message.
- The exact next phase, then stop for approval.

If a check fails, remain in the current phase, fix the issue, and rerun the relevant full check. Do not label a failure “pre-existing” without evidence from the baseline phase.

## Canonical domain language

Use this product-language mapping. Internal compatibility names can temporarily remain but must not leak into new customer-visible UI:

| Healthcare term | Barberly term | Notes |
|---|---|---|
| Doctor | Barber | A bookable professional |
| Patient | Customer | Account holder/appointment attendee |
| Hospital/clinic/establishment | Barbershop/shop/location | A physical service location |
| Specialization | Grooming specialty/category | Examples: Haircut, Beard, Shave, Styling, Hair treatment |
| Procedure | Service | A priced, duration-based bookable offering |
| Consultation fee | Service price | Store in integer paise |
| Consultation type | Fulfilment type | `IN_SHOP` or `AT_HOME`; remove `VIDEO` booking |
| Medical verification | Identity/KYC verification | No medical council language |
| Medical registration | Professional/business credentials | Optional license/certificate fields |
| Patient list | Customers | Only customers linked through appointments |
| Prescription | Not applicable | Remove/quarantine feature and routes |
| Surgery/treatment/medicine/report | Not applicable | Remove from Barberly navigation, public routes, SEO, and APIs unless separately approved |
| Hospital staff | Shop staff/barbers | Define roles and shop membership |
| Doctor profile video | Barber portfolio video | This remains; it is not video consultation |

Do not conflate a barber's portfolio videos with video-call appointments. Barberly should not offer video consultation.

## Target domain model

Validate this model against existing data before implementation. Produce an ERD/API contract in Phase 1.

- `User`: authentication identity, roles (`CUSTOMER`, `BARBER`, `SHOP_MANAGER`, `ADMIN`, `SUPPORT`), contact verification, status.
- `CustomerProfile`: `userId`, name, phone, email, preferences, saved addresses.
- `BarberProfile`: `userId`, display name, slug, biography, experience, gender (optional filter), profile/cover media, specialties, certifications, languages, rating aggregates, verification/status.
- `Shop`: owner/manager, name, slug, address, city, locality, geo coordinates, timezone, phone, photos, amenities, status.
- `ShopMembership`: shop, barber, role, active dates/status.
- `ServiceCategory`: name, slug, icon/image, SEO metadata, active/order.
- `ServiceOffering`: barber and/or shop, category, name, description, duration minutes, price paise, fulfilment type, buffer, active.
- `Schedule`: barber + shop + fulfilment type, weekly hours, breaks, effective dates.
- `ScheduleException`: time off, holiday, special hours.
- `SlotHold`: customer, barber, shop, selected service offerings, start/end UTC, price snapshot, expiry, status, idempotency key.
- `Appointment`: human-readable code, customer, attendee/contact snapshot, barber, shop/address, service snapshots, fulfilment type, start/end UTC, timezone, subtotal/tax/discount/total paise, payment status, appointment status, cancellation/reschedule history.
- `Payment`: appointment/hold, provider, order/payment/refund IDs, amount/currency, status, signature-verification metadata, idempotency keys.
- `Review`: appointment, customer, barber, shop, rating, text, moderation status, reply.
- `FAQ`, `PortfolioVideo`, `Media`, `Notification`, `Kyc`, `Wallet`, `Payout`, `Coupon` (only if retained), `AuditLog`.

Appointment status machine:

`HOLD_PENDING_PAYMENT -> CONFIRMED -> CHECKED_IN -> IN_PROGRESS -> COMPLETED`

Alternative terminal paths: `PAYMENT_FAILED`, `CANCELLED_BY_CUSTOMER`, `CANCELLED_BY_BARBER`, `NO_SHOW`, `REFUND_PENDING`, `REFUNDED`. Rescheduling must be recorded as history and must not silently overwrite financial/audit facts.

## Phase 0 — discovery, baseline, and safe execution plan

Do not modify product code.

1. Identify each nested git root and current branch/status. Record uncommitted changes without altering them.
2. Inventory app routes, screens, models, indexes, API endpoints, middleware, constants, roles, integrations, environment variables, test commands, build commands, and deployment scripts.
3. Trace the complete current search → doctor details → slots → login → payment → appointment flow across frontend and backend.
4. Trace partner-panel and admin-panel calls and determine whether the two backends share the same Mongo databases/collections. Document duplicated models and conflicting schemas.
5. Audit payment creation, signature verification, webhook mounting/raw-body handling, refund behavior, wallet/payout accounting, and money units.
6. Run baseline installs only if dependencies are missing and approval is available; then run existing build/type/test commands. Record failures before edits.
7. Compare every HTML reference screen with its functional source screen. Produce a component-by-component visual adoption matrix.
8. Search case-insensitively for healthcare terminology in source, templates, metadata, environment names, API responses, email/SMS templates, PDFs, SEO, sitemap code, analytics, tests, and assets.
9. Confirm in the audit that only the five functional source applications listed above will be modified on safe feature branches; keep `barberly-platform` and both UI-reference directories untouched.
10. Produce `docs/baseline-audit.md`, `docs/domain-mapping.md`, `docs/route-api-inventory.md`, and a phase checklist in an agreed writable documentation location.

Acceptance gate: all five applications have a documented baseline; dependency/backend relationships are known; the modification plan is reviewed. Stop.

## Phase 1 — architecture, contracts, and migration design

1. Define the canonical domain schema, ownership boundaries, statuses, role permissions, money unit, timezone rules, cancellation/refund policy inputs, and appointment state machine.
2. Choose one canonical owner for shared booking/payment logic. The two existing backends must not independently implement conflicting appointment/payment rules. Prefer the core backend as system of record and make the partner backend consume or share stable contracts; justify any alternative.
3. Define versioned API contracts for public discovery, customer booking, barber operations, and admin operations. Include request/response examples and standardized error envelopes.
4. Plan compatibility: legacy `/doctor` calls may remain temporarily behind adapters while new code uses `/barbers`. Mark removal criteria and never maintain two divergent implementations.
5. Design reversible, idempotent Mongo migrations with `up`, verification, and rollback/compensating steps. Back up before production migration. Never drop medical fields/collections in the first migration.
6. Add/plan indexes for public slug, text/search fields, city/locality/category, shop membership, availability, appointment lookup, payment IDs, and concurrency enforcement.
7. Write an OpenAPI document or an equivalent typed contract consumed by all clients.
8. Create a permissions matrix for Customer, Barber, Shop Manager, Admin, and Support.

Acceptance gate: schema/ERD, API contract, state machine, migration plan, and permissions matrix are reviewed; contract validation passes. Stop.

## Phase 2 — shared brand foundation and design system

1. Extract Angular-friendly design tokens from the two `DESIGN.md` files. Do not add Tailwind CDN scripts to Angular apps.
2. Customer/barber theme: Montserrat headings, Inter body, navy/charcoal, warm neutral surfaces, restrained gold accents, 8px spacing rhythm, 12–16px radii, soft ambient shadows.
3. Admin theme: Hanken Grotesk headings, Inter body, JetBrains Mono for IDs/financial data, fixed 260px navy sidebar, denser 4px rhythm, restrained borders and gold active accents.
4. Build reusable accessible primitives: buttons, inputs, selects/autocomplete, date strip, time-slot chip, cards, badges, tabs, modal/drawer, toast, skeleton, empty/error state, pagination/table.
5. Add visible focus, keyboard operation, semantic landmarks, form labels/errors, adequate contrast, reduced-motion support, and responsive breakpoints.
6. Replace remote template images with approved local/configured assets. Preserve aspect ratio and provide meaningful alt text.

Acceptance gate: component showcase or representative pages match the references at mobile/tablet/desktop; accessibility smoke checks and builds pass. Stop.

## Phase 3 — backend domain foundation

1. Implement canonical models, enums, validators, serializers, indexes, and repository/service boundaries.
2. Add compatibility aliases/adapters so existing clients remain functional during migration.
3. Convert doctor fields deliberately: specialties and certifications remain; medical council, prescription, surgery, medicine, clinical report, and video-call concepts are quarantined from new APIs.
4. Convert establishments to shops with address, coordinates, timezone, photos, fulfilment types, memberships, amenities, verification, and active status.
5. Convert services into duration- and price-based offerings. The server must calculate the total from current authoritative offerings and create an immutable booking snapshot.
6. Add migration scripts plus dry-run and verification output. Seed barber specialties/categories/services without deleting existing data.
7. Standardize authentication claims and authorization middleware across both APIs.

Acceptance gate: migration dry-run succeeds against sanitized data; schema/index/authorization tests pass; legacy read compatibility is proven. Stop.

## Phase 4 — barber onboarding and partner APIs

1. Replace doctor onboarding with: account/contact verification → personal profile → skills/specialties → shop or home-service setup → service offerings/prices/durations → working schedule → identity/KYC → review/submission.
2. Support individual barbers and shop-associated barbers without assuming every barber owns a shop.
3. Implement barber/profile, shop, membership, service, schedule, exception/time-off, media, video, FAQ, review reply, appointment, dashboard, earning, wallet, payout, and notification APIs.
4. Remove medical verification wording and data requirements. KYC/identity and payout verification remain.
5. Enforce ownership: a barber cannot edit another barber/shop; a manager acts only within assigned shops.

Acceptance gate: API integration tests cover onboarding through bookable activation, negative authorization cases, and schedule/service validation. Stop.

## Phase 5 — search, discovery, and SEO APIs

1. Build public autocomplete and search endpoints supporting city, locality, barber name, specialty/category, service, shop, fulfilment type, rating, price range, and availability when feasible.
2. Return only active, approved, bookable barbers and shops. Use stable pagination, filter metadata, and deterministic sorting.
3. Define ranking: exact name/service match, location relevance, verified/bookable status, availability, rating/review confidence; do not allow sponsored ranking unless explicitly modeled.
4. Return lightweight result cards and separate full detail payloads. Avoid N+1 queries and unbounded regex scans.
5. Implement unique canonical URLs such as `/:city/barber/:slug` and `/:city/barbers/:specialty`, redirects for legacy doctor URLs, accurate canonical tags, structured data, sitemap generation, and true SSR 404 behavior.
6. Sanitize and allowlist video embeds and rich content.

Acceptance gate: search relevance fixtures, pagination/filter contract tests, query-performance evidence, SSR metadata/canonical checks, and public-data exposure tests pass. Stop.

## Phase 6 — availability and concurrency-safe booking engine

1. Generate slots from service duration, buffers, schedule, breaks, exceptions, shop timezone, existing holds, and active appointments. Never assume a fixed 15-minute medical consultation slot.
2. Support multi-service duration/price totals if product scope approves multiple services; otherwise enforce one service clearly in API and UI.
3. Implement short-lived slot holds (for example 5–10 minutes) with TTL and explicit expiry.
4. Enforce conflict prevention atomically. Model a unique booking resource or use a transaction/lock strategy that prevents two paid customers from obtaining overlapping time for the same barber.
5. Define overlap behavior for variable-duration appointments; equality on start timestamp alone is insufficient.
6. Add idempotency keys to hold, order creation, finalization, cancellation, reschedule, and refund actions.
7. Price and service details are server snapshots; client-submitted totals are ignored.

Acceptance gate: unit tests cover timezone boundaries, breaks, time off, variable durations, buffers, expiry, cancellation/release, and reschedule. A parallel concurrency test proves only one contender can secure an overlapping slot. Stop.

## Phase 7 — payments, confirmation, refunds, and payouts

1. Preserve Razorpay only after auditing its current service, dependencies, raw webhook setup, and environment validation. Add missing runtime dependency declarations if required.
2. Flow: authenticated hold → server price calculation → payment order → checkout → server signature verification and/or verified webhook → idempotent appointment finalization.
3. Verify webhook signatures using the unmodified raw request body. Reject replay/duplicate events safely and store provider event IDs.
4. Never confirm from query parameters, UI state, or unverified client callback.
5. Resolve the current rupee/paise ambiguity. Persist all `amount`, commission, fee, refund, wallet, and payout fields in integer paise; migrate/annotate legacy records safely.
6. Handle success callback loss, captured payment with expired/conflicted slot, failed/abandoned payment, retry, partial/full refund, webhook arriving before callback, and duplicate delivery.
7. Make appointment/payment/wallet updates transactional or compensatable and auditable. Do not credit earnings twice.
8. No secret keys or full sensitive gateway payloads in browser logs or API responses.

Acceptance gate: sandbox end-to-end tests and automated signature/idempotency/refund/concurrency tests pass. Reconciliation totals balance. Stop.

## Phase 8 — customer application

Implement with the Angular 21 application's current architecture and SSR behavior.

1. Rebrand shell, header/footer, copy, icons, imagery, metadata, auth, notifications, emails/SMS-linked copy, and legal placeholders to Barberly.
2. Home: prominent location + specialty/service/barber autocomplete, popular services, nearby/top-rated barbers, trust content, and responsive loading/error/empty states.
3. Search results: URL-backed filters, mobile filter drawer, sorting, pagination/infinite loading with accessibility, cards with barber/shop/rating/price/next slot, and no-results recovery.
4. Barber details: identity/verification, shop/location/map, specialty, rating, gallery, sticky Book appointment CTA, slot preview, and anchored/tabbed **About, Services, Videos, FAQs, Reviews** sections. On mobile, sections remain reachable and the CTA does not obscure content.
5. Booking flow: fulfilment → shop/address → service → date → slot/hold → login if needed → attendee/contact → price/policy confirmation → Razorpay → verified result.
6. Clicking a slot and clicking Book appointment enter the same booking state machine. Direct/deep links recover safely without trusting stale client state.
7. Customer account: upcoming/past appointments, detail/receipt, allowed cancellation/reschedule, refund status, profile/addresses, and post-completion review.
8. Remove doctor/hospital/clinical/surgery/medicine public pages and navigation only after redirects/SEO decisions are implemented. Do not leave dead lazy routes.

Acceptance gate: component tests, build/SSR build, route checks, and E2E happy/negative flows pass at 360px, 768px, and desktop. Stop.

## Phase 9 — barber/partner application

Rebuild the Angular 20 panel using the barber-panel reference screens: `index.html`, onboarding pages, `dashboard.html`, `appointments.html`, `services.html`, `earnings.html`, `reviews.html`, and `settings.html`.

1. Routes/navigation: Dashboard, Appointments/Calendar, Services, Shop(s), Schedule/Time off, Earnings/Payouts, Reviews, Profile/Portfolio, Videos, FAQs, Notifications, Settings, Help.
2. Remove My Patient, Prescription, Procedure, Medical Verification, video consultation, and clinical copy. Convert relevant customer history into appointment/customer context without exposing unrelated customer data.
3. Dashboard: today/upcoming metrics, revenue in paise-formatted currency, pending actions, availability toggle with clear consequence, and shop/home context.
4. Appointment views: list/day/week/month where useful; status transitions are permission/state-machine constrained; contact data is appropriately masked.
5. Services/schedule: CRUD with validation, duration, buffer, price, fulfilment type, shop assignment, weekly hours, breaks, holidays, and time off.
6. Profile: About, specialties, shops, service area, photos, portfolio videos, FAQs, certifications, reviews, public-profile preview.
7. Earnings/KYC/payout: auditable totals, statuses, filters, receipts/details, and no floating-point arithmetic.

Acceptance gate: role/guard tests, build, responsive visual comparison, and E2E onboarding → service/schedule → receive/manage appointment → earnings flow pass. Stop.

## Phase 10 — super-admin application

Rebuild the Angular 14 admin UI using the admin design reference while preserving its compatible framework patterns.

1. Navigation: Dashboard, Appointments, Barbers, Shops, Customers, Services/Categories, Reviews, KYC/Approvals, Payments, Payouts, Reports, CMS, Permissions, Settings.
2. Remove/quarantine healthcare-only surgery, medicine, prescription, patient clinical, and hospital-speciality screens and routes.
3. Add filterable, paginated, server-driven tables; stable loading/empty/error states; export permissions; confirmation for destructive actions.
4. Barber/shop approval shows complete evidence, reasoned approve/reject/suspend flows, and audit history.
5. Service/category management supports ordering, slugs, activation, icons/images, and validation.
6. Payment/payout screens use integer monetary values and reconcile with appointments/refunds.
7. CMS controls public FAQs, policies, home content, SEO fields, and approved media without unsafe HTML.
8. Implement route and action-level RBAC for Super Admin, Operations, Finance, Content, and Support. Hiding a button is not authorization.

Acceptance gate: permissions matrix tests, API integration, build, responsive visual checks, and primary admin E2E flows pass. Stop.

## Phase 11 — communication, policies, and operational workflows

1. Create event-driven, idempotent notifications for booking confirmed, reminder, rescheduled, cancelled, refund, completed/review request, KYC, and payout status.
2. Update email, SMS, notification, PDF receipt, invoice, and calendar text from healthcare language to Barberly.
3. Store notification preferences and honor opt-out rules for non-transactional messages.
4. Implement configurable cancellation cutoff, refund, no-show, barber cancellation, taxes, commissions, home-service travel fees, and payout-delay rules.
5. Ensure jobs use timezone-safe scheduling, retry with backoff, dead-letter/error visibility, and duplicate suppression.

Acceptance gate: template snapshots, job/idempotency tests, policy boundary tests, and link/deep-link checks pass. Stop.

## Phase 12 — complete domain-remnant and security audit

1. Run case-insensitive searches across source and user-visible output for: doctor, patient, hospital, clinic, medical, medicine, prescription, surgery, consultation, treatment, healthcare, Nectar, and old domains/emails/assets.
2. Classify every remaining match as: approved legacy compatibility, migration history, third-party name, test fixture, or defect. Fix all defects and document approved remnants.
3. Audit OWASP-relevant concerns: auth/session/JWT, OTP abuse/rate limits, RBAC/IDOR, validation, NoSQL injection, upload MIME/size/storage, XSS/rich content/video embeds, CORS, headers, error leakage, logging/PII, secrets, webhook verification, and dependency vulnerabilities.
4. Verify public barber endpoints cannot leak KYC documents, internal IDs unnecessarily, payout/bank data, private customer details, or deleted/unapproved records.
5. Add rate limits for auth, search abuse, reviews, payment order creation, and public contact endpoints.

Acceptance gate: zero unexplained healthcare terms in user-visible flows, no critical/high unresolved security finding, and negative authorization tests pass. Stop.

## Phase 13 — full regression, performance, accessibility, and release rehearsal

1. Run clean installs using lockfiles, all builds/type checks/tests, API contract tests, migration tests, and E2E suites across all apps.
2. E2E matrix must cover search by city/specialty/name/service; filters; barber page sections; both booking entry points; login interruption; hold expiry; payment success/failure/retry; duplicate click/webhook; appointment history; cancellation/reschedule/refund; review eligibility; barber management; admin approval/payment/RBAC.
3. Test 360px mobile, tablet, laptop, large desktop, keyboard-only, screen-reader landmarks/names, contrast, zoom, slow network, API errors, expired auth, empty data, and long text.
4. Measure critical public pages and API queries. Optimize images, lazy loading, bundles, SSR, database indexes, and N+1 queries without changing behavior.
5. Rehearse backup, migration, seed/config, deployment, health checks, smoke tests, rollback, and restoration in staging using production-like sanitized data.
6. Write runbooks: setup, environment variables, architecture, API, migrations, test commands, deployment, rollback, payment/webhook setup, scheduled jobs, support/reconciliation.

Acceptance gate: release checklist is fully evidenced; no blocker/critical defects; rollback rehearsal succeeds; product owner approves UAT. Stop.

## Phase 14 — controlled release and post-release verification

1. Take verified backups and record release/migration versions.
2. Deploy backward-compatible backend/database changes before dependent clients.
3. Run migrations in approved dry-run then apply mode; verify counts/indexes/invariants.
4. Deploy customer, partner, and admin applications; run production smoke tests with test accounts and payment mode appropriate to the environment.
5. Monitor error rate, latency, booking conversion, payment/order mismatch, webhook failures, double-booking conflicts, refunds, notification failures, and queue/job health.
6. Roll back according to the runbook if a defined threshold is exceeded. Never improvise destructive production repair.
7. Produce a final release report with versions, migrations, evidence, known low-risk limitations, and ownership of follow-up work.

Acceptance gate: monitored production smoke tests pass, financial reconciliation is correct, and there are no critical regressions.

## Definition of done

The conversion is done only when:

- All three applications consistently use Barberly terminology and workflows.
- City/specialty/service/name search and filtering work against real APIs.
- Barber details reliably show About, Services, Videos, FAQs, and Reviews.
- Both booking entry points lead to the same concurrency-safe flow.
- Payment is server-verified, idempotent, reconciled, and creates exactly one appointment.
- Customer, barber, shop manager, admin, finance, content, and support permissions are enforced server-side.
- Healthcare-only features are removed from product surfaces and safely quarantined/migrated.
- Responsive UX, accessibility, SSR/SEO, security, performance, builds, tests, migrations, deployment, and rollback all have evidence.
- Documentation lets a new engineer run, test, deploy, diagnose, and roll back the platform.

## First instruction to execute now

Execute **Phase 0 only**. Do not modify application code. Return the baseline audit, risks, exact target-directory recommendation, and proposed Phase 1 contract artifacts. Then stop and wait for approval.
