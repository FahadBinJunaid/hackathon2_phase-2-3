# Tasks: UI Refinement & Responsive Design Enhancement

**Input**: Design documents from `/specs/004-ui-refinement/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), quickstart.md (complete)

**Tests**: No test tasks included - tests not explicitly requested in feature specification. Manual testing will be performed per quickstart.md checklist.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `frontend/src/` for all frontend code
- **Backend**: No changes (out of scope)
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and prerequisites

**Status**: Path fixes (Phase D1) already completed ✅

- [x] T001 Verify backend server is running on port 8001 (curl http://localhost:8001/health)
- [x] T002 Verify frontend development server starts successfully (npm run dev in frontend/)
- [x] T003 Verify tsconfig.json path mapping is correct (@/* → ./src/*)
- [x] T004 Verify existing pages load correctly (/signup, /login, /dashboard)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Status**: All foundational work already complete ✅
- TypeScript configuration fixed
- Import paths standardized
- Existing authentication flow functional
- Tailwind CSS configured

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Landing Page Experience (Priority: P1) 🎯 MVP

**Goal**: Create engaging landing page at root URL with hero section, feature grid, and CTAs to improve user onboarding

**Independent Test**: Navigate to http://localhost:3000/ and verify hero section displays with headline, description, and CTA buttons. Click "Get Started" → should navigate to /signup. Click "Sign In" → should navigate to /login. Verify responsive layout on mobile (< 768px), tablet (768px-1024px), and desktop (> 1024px).

### Implementation for User Story 1

- [x] T005 [P] [US1] Create HeroSection component in frontend/src/components/HeroSection.tsx with headline, description, and CTA buttons
- [x] T006 [P] [US1] Create FeatureGrid component in frontend/src/components/FeatureGrid.tsx with 3 feature cards (Task Management, Stay Organized, Boost Productivity)
- [x] T007 [US1] Create landing page in frontend/src/app/page.tsx importing HeroSection and FeatureGrid components
- [x] T008 [US1] Add metadata for SEO (title, description) to landing page in frontend/src/app/page.tsx
- [x] T009 [US1] Implement responsive layout for hero section using Tailwind breakpoints (mobile: stack, desktop: flex-row)
- [x] T010 [US1] Implement responsive grid for feature cards (mobile: 1 column, tablet: 2 columns, desktop: 3 columns)
- [x] T011 [US1] Add navigation links from CTAs to /signup and /login using Next.js Link component
- [x] T012 [US1] Style hero section with gradient background and proper spacing using Tailwind CSS
- [x] T013 [US1] Style feature cards with shadows, padding, and hover effects using Tailwind CSS
- [x] T014 [US1] Verify color contrast meets WCAG AA standards (4.5:1 for normal text)
- [x] T015 [US1] Test landing page on mobile (320px), tablet (768px), and desktop (1920px) screen sizes
- [x] T016 [US1] Verify no horizontal scrolling on any screen size
- [x] T017 [US1] Test CTA button navigation to signup and login pages
- [x] T018 [US1] Verify landing page loads in under 2 seconds on 3G connection

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Landing page is complete and provides clear entry point for new users.

---

## Phase 4: User Story 2 - Enhanced Authentication Experience (Priority: P2)

**Goal**: Add password confirmation validation to signup page and enhance error messaging to reduce signup errors and improve user confidence

**Independent Test**: Navigate to http://localhost:3000/signup and enter email and password. Enter different password in confirm field → should show "Passwords do not match" error. Enter matching passwords → error should clear. Submit with mismatched passwords → should prevent submission. Submit with matching passwords → should create account successfully.

### Implementation for User Story 2

- [x] T019 [US2] Add confirmPassword state variable to signup page in frontend/src/app/signup/page.tsx
- [x] T020 [US2] Add confirmPassword to errors type definition in frontend/src/app/signup/page.tsx
- [x] T021 [US2] Create password confirmation input field in signup form in frontend/src/app/signup/page.tsx
- [x] T022 [US2] Implement real-time validation for password confirmation (check match on change) in frontend/src/app/signup/page.tsx
- [x] T023 [US2] Update validateForm function to check password confirmation match in frontend/src/app/signup/page.tsx
- [x] T024 [US2] Add inline error message display for password mismatch in frontend/src/app/signup/page.tsx
- [x] T025 [US2] Ensure password confirmation field has proper ARIA attributes (aria-describedby, aria-invalid) in frontend/src/app/signup/page.tsx
- [x] T026 [US2] Update form submission logic to prevent submit if passwords don't match in frontend/src/app/signup/page.tsx
- [x] T027 [US2] Verify existing email and password validation still works correctly in frontend/src/app/signup/page.tsx
- [x] T028 [P] [US2] Enhance error messages on login page for better clarity in frontend/src/app/login/page.tsx
- [x] T029 [US2] Test signup with matching passwords → should create account successfully
- [x] T030 [US2] Test signup with non-matching passwords → should show error and prevent submission
- [x] T031 [US2] Test signup with empty confirm password → should show "Please confirm your password" error
- [x] T032 [US2] Test password mismatch error displays within 500ms of input
- [x] T033 [US2] Test error message is announced to screen readers (verify aria-live behavior)
- [x] T034 [US2] Verify form cannot be submitted with mismatched passwords

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Signup flow is enhanced with password confirmation validation.

---

## Phase 5: User Story 3 - Responsive Navigation (Priority: P3)

**Goal**: Implement mobile-responsive navigation with hamburger menu to provide seamless mobile experience

**Independent Test**: Resize browser to mobile size (< 768px) and verify hamburger icon appears. Click hamburger → menu should slide in from left. Click outside menu → menu should close. Press ESC → menu should close. Click navigation link → should navigate and close menu. Verify desktop navigation (>= 768px) shows full nav links without hamburger.

### Implementation for User Story 3

- [x] T035 [P] [US3] Create MobileMenu component in frontend/src/components/MobileMenu.tsx with slide-in animation
- [x] T036 [US3] Add isMobileMenuOpen state to Navbar component in frontend/src/components/Navbar.tsx
- [x] T037 [US3] Add hamburger menu icon button (visible only on mobile < 768px) in frontend/src/components/Navbar.tsx
- [x] T038 [US3] Hide desktop navigation links on mobile (< 768px) using Tailwind responsive classes in frontend/src/components/Navbar.tsx
- [x] T039 [US3] Implement backdrop overlay for mobile menu in frontend/src/components/MobileMenu.tsx
- [x] T040 [US3] Implement slide-in animation using CSS transforms (translateX) in frontend/src/components/MobileMenu.tsx
- [x] T041 [US3] Add close button to mobile menu in frontend/src/components/MobileMenu.tsx
- [x] T042 [US3] Implement click-outside-to-close behavior for mobile menu in frontend/src/components/MobileMenu.tsx
- [x] T043 [US3] Implement ESC key to close mobile menu in frontend/src/components/MobileMenu.tsx
- [x] T044 [US3] Implement auto-close on navigation link click in frontend/src/components/MobileMenu.tsx
- [x] T045 [US3] Add focus trap for mobile menu keyboard navigation in frontend/src/components/MobileMenu.tsx
- [x] T046 [US3] Add ARIA labels to hamburger icon and close button in frontend/src/components/Navbar.tsx and MobileMenu.tsx
- [x] T047 [US3] Ensure mobile menu animation completes in under 300ms
- [x] T048 [US3] Display user email and logout button in mobile menu in frontend/src/components/MobileMenu.tsx
- [x] T049 [US3] Test hamburger menu appears on mobile (< 768px) and hides on desktop (>= 768px)
- [x] T050 [US3] Test mobile menu slides in smoothly when hamburger clicked
- [x] T051 [US3] Test mobile menu closes on outside click, ESC key, and navigation
- [x] T052 [US3] Test keyboard navigation works correctly (Tab, Shift+Tab, Enter, ESC)
- [x] T053 [US3] Test focus returns to hamburger button when menu closes
- [x] T054 [US3] Verify no horizontal scroll on mobile (320px minimum width)
- [x] T055 [US3] Test on tablet size (768px-1024px) to verify appropriate layout adaptation

**Checkpoint**: All user stories should now be independently functional. Mobile navigation provides seamless experience across all screen sizes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, testing, and validation across all user stories

- [x] T056 [P] Test complete user flow: landing page → signup → dashboard on desktop
- [x] T057 [P] Test complete user flow: landing page → login → dashboard on mobile
- [x] T058 [P] Run Lighthouse audit on landing page (target: 90+ score on mobile and desktop)
- [x] T059 [P] Verify all pages pass WCAG AA color contrast requirements using browser dev tools
- [x] T060 [P] Test keyboard navigation across all pages (Tab, Shift+Tab, Enter, ESC)
- [x] T061 [P] Test on Chrome, Firefox, Safari, and Edge browsers (latest versions)
- [x] T062 [P] Test on iOS Safari and Chrome Mobile (real devices if possible)
- [x] T063 Verify no TypeScript compilation errors (npm run build in frontend/)
- [x] T064 Verify no console errors or warnings in browser console
- [x] T065 Test responsive breakpoints: 320px, 375px, 768px, 1024px, 1920px
- [x] T066 Verify all interactive elements have appropriate hover, focus, and active states
- [x] T067 Test form validation feedback displays within 500ms
- [x] T068 Verify all images are optimized and load quickly
- [x] T069 Run full quickstart.md testing checklist and verify all items pass
- [x] T070 Document any known issues or future enhancements in feature notes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (verification only)
- **Foundational (Phase 2)**: Already complete ✅ - No blocking work needed
- **User Stories (Phase 3-5)**: All can start immediately after Phase 1 verification
  - User stories are independent and can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 verification - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 1 verification - Independent of US1 (modifies different files)
- **User Story 3 (P3)**: Can start after Phase 1 verification - Independent of US1 and US2 (modifies different files)

**Key Insight**: All three user stories are completely independent and can be developed in parallel by different developers.

### Within Each User Story

**User Story 1 (Landing Page)**:
- T005 (HeroSection) and T006 (FeatureGrid) can run in parallel [P]
- T007 (page.tsx) depends on T005 and T006 completing
- T008-T013 (styling and layout) can proceed after T007
- T014-T018 (testing) can proceed after styling complete

**User Story 2 (Password Confirmation)**:
- T019-T027 (signup page changes) are sequential (same file)
- T028 (login page) can run in parallel with signup changes [P]
- T029-T034 (testing) can proceed after implementation complete

**User Story 3 (Mobile Navigation)**:
- T035 (MobileMenu component) can run in parallel with T036-T038 (Navbar changes) [P]
- T039-T048 (menu features) depend on T035 and T036-T038
- T049-T055 (testing) can proceed after implementation complete

### Parallel Opportunities

- **Phase 1**: All verification tasks (T001-T004) can run in parallel
- **Phase 3**: T005 and T006 can run in parallel (different files)
- **Phase 4**: T028 can run in parallel with T019-T027 (different files)
- **Phase 5**: T035 can run in parallel with T036-T038 (different files)
- **Phase 6**: Most polish tasks (T056-T062) can run in parallel (different concerns)
- **Across Stories**: All three user stories can be developed in parallel by different team members

---

## Parallel Example: User Story 1 (Landing Page)

```bash
# Launch component creation in parallel:
Task: "Create HeroSection component in frontend/src/components/HeroSection.tsx"
Task: "Create FeatureGrid component in frontend/src/components/FeatureGrid.tsx"

# After both complete, create landing page:
Task: "Create landing page in frontend/src/app/page.tsx"
```

## Parallel Example: Across User Stories

```bash
# With 3 developers, work on all stories simultaneously:
Developer A: User Story 1 (Landing Page) - Tasks T005-T018
Developer B: User Story 2 (Password Confirmation) - Tasks T019-T034
Developer C: User Story 3 (Mobile Navigation) - Tasks T035-T055

# All stories complete independently and integrate seamlessly
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup verification (T001-T004)
2. Complete Phase 3: User Story 1 - Landing Page (T005-T018)
3. **STOP and VALIDATE**: Test landing page independently
4. Deploy/demo if ready - Users can now discover the app!

**MVP Delivered**: Engaging landing page that improves user onboarding

### Incremental Delivery

1. Complete Setup verification → Foundation confirmed ready
2. Add User Story 1 (Landing Page) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Password Confirmation) → Test independently → Deploy/Demo
4. Add User Story 3 (Mobile Navigation) → Test independently → Deploy/Demo
5. Complete Polish phase → Final validation → Production ready
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup verification together (T001-T004)
2. Once verified, split work:
   - Developer A: User Story 1 (T005-T018) - Landing Page
   - Developer B: User Story 2 (T019-T034) - Password Confirmation
   - Developer C: User Story 3 (T035-T055) - Mobile Navigation
3. Stories complete and integrate independently
4. Team reconvenes for Polish phase (T056-T070)

---

## Task Summary

**Total Tasks**: 70
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 0 tasks (already complete)
- Phase 3 (User Story 1 - Landing Page): 14 tasks
- Phase 4 (User Story 2 - Password Confirmation): 16 tasks
- Phase 5 (User Story 3 - Mobile Navigation): 21 tasks
- Phase 6 (Polish): 15 tasks

**Parallel Opportunities**: 12 tasks marked [P] can run in parallel
**Independent Stories**: All 3 user stories can be developed in parallel

**Suggested MVP Scope**: User Story 1 only (14 tasks) - Delivers landing page for user onboarding

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included - manual testing per quickstart.md checklist
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All user stories are frontend-only with no backend changes
- Path fixes (Phase D1) already completed in previous work
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
