# Lendsqr Frontend Engineering Assessment

A React + TypeScript + SCSS implementation of the Lendsqr Admin Console screens (Login, Dashboard/Users, User Details).


## Tech stack

- **React 18 + TypeScript** — Vite for tooling
- **SCSS Modules** — one `*.module.scss` file per component/page, shared design tokens in `src/styles/_variables.scss`
- **React Router v6** — client-side routing
- **Vitest + React Testing Library** — unit tests

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and produce a production build
npm run test      # run the unit test suite once
npm run test:watch
npm run test:coverage
npm run lint
```

## Project structure

```
src/
  components/        Reusable UI (StatCard, StatusPill, Pagination, UsersFilterForm) and layout shell (AppLayout, Sidebar, TopNav)
  pages/              One folder per route: Login, Users, UserDetails, plus ForgotPassword
  services/           Data-access layer (auth, users) — the seam the pages talk to
  types/              Shared domain types (User, Guarantor, UserStatus)
  utils/              Form validators
  styles/             Design tokens (_variables.scss) and shared mixins (_mixins.scss)
```

## Approach and decisions

**Data layer.** `src/services/users.ts` fetches the full 500-record dataset from a dedicated, self-generated backend (`GET https://lendsqr-fe-test-be.vercel.app/generated-users`) and caches it in memory for the session, so pagination/filtering/status updates don't re-hit the network on every interaction. The response is returned as-is and trusted to match the app's `User` shape, there is no client-side normalization step. See **Known gaps** below for where that trust currently doesn't hold.

**Filter form as its own component.** The Users table's filter panel lives in `src/components/UsersFilterForm/`, with its form state/type (`FilterFormState`, `EMPTY_FILTER_FORM`) split into a sibling module so the component file only exports the component (keeps Fast Refresh happy). `Users.tsx` owns the state and passes it down as props.

**Dismissible overlays.** Both the filter panel and the per-row action menu close on an outside click, tracked via a single `mousedown` listener that checks the click target against ref'd trigger/content elements. The row action menu is rendered through a `createPortal` into `document.body`, positioned with `position: fixed` from the triggering row's `getBoundingClientRect()` — the table's horizontally-scrolling wrapper (`overflow-x: auto`) otherwise clips an absolutely-positioned dropdown vertically, which made the menu appear to vanish behind the pagination controls.

**Persistence.** Selecting "View Details" from the Users table writes the selected row to `localStorage` under `lendsqr_user_<id>` before navigating. `UserDetails` reads that key first and falls back to the in-memory dataset, so a user's details survive a refresh even though the "backend" is client-side. Status changes (blacklist/activate) are written back to both the in-memory store and `localStorage`.

**Pagination over virtualization.** With 500 records and a paginated table (10/25/50/100 per page, configurable), only the current page's rows are ever mounted — the DOM never holds more than 100 rows at once. That keeps the table responsive without the added complexity of a virtualized list.

**State handling.** Both `Users` and `UserDetails` model an explicit `loading` / `error` / `empty` / `success` state machine rather than relying on truthiness checks, and the Users table has a real retry path on failure. `UserDetails` distinguishes "not yet loaded" from "no such user" so a bad/stale id renders a genuine not-found state instead of a blank page.


**Responsive layout.** Breakpoints are centralized in `src/styles/_mixins.scss` (`tablet-up`, `desktop-up`) and used consistently across pages — grids collapse to a single column and the sidebar becomes an off-canvas drawer below the tablet breakpoint.


## Testing
Each page has unit tests covering both the happy path and failure/edge cases (loading, empty, error, not-found, and state transitions triggered by user interaction). Services are mocked at the module boundary so tests exercise component behavior, not the live data-fetching layer. 18 tests pass across 3 files (`npm run test`).
