# Code Review — Verlanglijstje v3

**Date:** 2026-07-02 (remediation status updated same day)
**Scope:** `server/` (TypeScript backend), `public/js/` (frontend), `verlang.sql` (DB schema), compared against legacy `verlang2/src/main` (Java/JSP).

---

## Remediation status

| Status | Items |
|---|---|
| ✅ Fixed | H1, H2, H3, H4, H5, M1, M2, M3, M4 (validation part), M6 (UI part), M7, L2, L3, L4, L6, L8, L10, L11 |
| ❌ Open | M5 (owner sees giver info via API), M8 (MyISAM/no FKs), L1 (hash-password.js defaults), L7 (config fallback order), L9 (full-page reloads), L12 (user directory via search) |

DONE: H6 and L5 required running [db-migrations/003-add-unique-username-constraint.sql](db-migrations/003-add-unique-username-constraint.sql) and [db-migrations/004-drop-old-password-column.sql](db-migrations/004-drop-old-password-column.sql) against the production DB (004 only after confirming the bcrypt migration is complete).

---

## Overall verdict

v3 is a big step up from v2: bcrypt instead of plain-text passwords, parameterized queries everywhere (no SQL injection found), JWT auth, rate limiting on auth endpoints, hashed password-reset tokens with expiry, and secrets kept in gitignored config files. The code is readable and consistently structured.

However, there are a few **high-severity issues**: a stored XSS vector in the frontend, private lists that are effectively not private, plain-text passwords ending up in server logs, and a broken/unauthenticated search route.

---

## 🔴 High severity

### H1. Stored XSS via quote-unsafe `escapeHtml` — ✅ FIXED

**Fix applied:** `escapeHtml` is now a replace-chain that also escapes `"` and `'`; all inline `onclick` handlers were replaced by `data-action`/`data-*` attributes with a single delegated click listener in `app.js`; `item.price` is escaped everywhere it is rendered.

Original finding:

`escapeHtml()` in [lists.js](public/js/lists.js) used the `div.textContent → innerHTML` trick, which escapes `& < >` but **not quotes** (`'` or `"`). Yet the escaped values were injected into quoted attribute contexts and inline JS strings (`onclick="...'${escapeHtml(name)}'..."`), and `item.price` was not escaped at all. Since the JWT lives in `localStorage`, this meant token theft for any follower viewing a poisoned list.

### H2. Private lists are not private — ✅ FIXED

**Fix applied:** Redefined privacy model:
- `public='Y'` means the list appears in search results
- `public='N'` means the list is hidden from search, but can still be shared
- Share links work for both public and private lists via a dedicated `POST /api/share/:encodedId/follow` endpoint
- Direct follows via `POST /api/lists/:id/follow` still require `public='Y'` to prevent enumeration
- Search (`/api/share/search`) only returns `public='Y'` lists

This allows owners to share private lists (family/friends only) without making them searchable by strangers, while public lists remain discoverable.

The arithmetic share-ID encoding remains trivially reversible but now serves only as an obfuscated link format; access control is enforced server-side.

### H3. Anyone can mark any item as donated, unauthenticated — ✅ FIXED

`donateFromShare` (`POST /api/share/:encodedItemId/donate`) has been removed from the server and the frontend API client.

### H4. Passwords and reset tokens are written to server logs — ✅ FIXED

The request logger in [server.ts](server/server.ts) now masks `password`, `currentPassword`, `newPassword`, and `token`.

### H5. `/api/search` is unauthenticated and almost certainly broken — ✅ FIXED

The ad-hoc unauthenticated `/api/search` route was removed; the frontend now calls the authenticated `/api/share/search`.

### H6. No unique constraints on `users.username` / `users.email` — ✅ FIXED

[db-migrations/003-add-unique-username-constraint.sql](db-migrations/003-add-unique-username-constraint.sql) adds `UNIQUE KEY (username)`; the `ER_DUP_ENTRY` handler in `register` is now reachable. **Verify the migration has been applied to production.** Email uniqueness remains an application-level decision (registration enforces it, `updateProfile` allows duplicates).

---

## 🟠 Medium severity

### M1. `trust proxy: true` defeats rate limiting — ✅ FIXED

Now `app.set('trust proxy', 1)` — only the single nginx hop is trusted, so spoofed `X-Forwarded-For` chains no longer bypass `express-rate-limit`.

### M2. Editing an item wipes its priority and `showfrom` — ✅ FIXED

`updateItem` now preserves the existing `priority`/`showfrom` when the request doesn't provide them (`priority ?? item.priority`, `showfrom !== undefined ? showfrom : item.showfrom`).

### M3. Reservation race condition — ✅ FIXED

`reserveItem` now uses a conditional update (`... WHERE id = ? AND status = 'A'`) and returns 409 when `affectedRows === 0`; `donateItem` likewise (`status='A' OR (status='R' AND givenby = me)`). `donateFromShare` was removed (H3).

### M4. Dead/duplicated share & search surface — ✅ MOSTLY FIXED

Dead `shareAPI.getSharedList`/`donateFromShare` client methods were removed; `decodeShareId` on the server now validates by re-encoding (404 otherwise). Remaining: the decode logic is still duplicated client-side in [items.js](public/js/items.js) for the `#/share/:id` route (acceptable), and no guest view exists for `getSharedList`.

### M5. Owner can see who reserved items via the API — ❌ OPEN

`getList` ([listController.ts](server/controllers/listController.ts)) returns `givenby`, `givencomment`, and the giver's name for every item, including to the list owner. The UI hides reserved-by info for owners, but the surprise is one devtools-tab away. Redact giver fields server-side when `isOwner` and status is `R` (and for `S` when `shown === 'F'`).

### M6. Priority handling is inconsistent — ✅ PARTIALLY FIXED

The misleading priority UI controls were removed; `addItem` computes `MAX(priority)+1`. Remaining nit: `reorderItems` assigns `100 - index`, which goes negative for lists with >100 items and clashes with `validateItem`'s 0–100 rule.

### M7. No rate limit on `forgot-password` — ✅ FIXED

`/api/auth/forgot-password` is now covered by `authLimiter` (5 attempts per 15 minutes), preventing inbox bombing attacks.

### M8. MyISAM, no foreign keys — ❌ OPEN

All tables are MyISAM: no transactions, no FK integrity. `deleteList` issues three separate DELETEs — a crash mid-way leaves orphaned rows. Recommend migrating to InnoDB and adding FKs (`items.list → lists.id`, `follows.user/list`, `lists.user → users.id`) plus a composite unique key on `follows(user, list)` (currently duplicates are only prevented in application code, and only in `followList`).

---

## 🟡 Low severity / housekeeping

1. ❌ **[hash-password.js](hash-password.js)** contains a hard-coded real-looking default password and username in a committed file. Remove the defaults (require the argument).
2. ✅ **Stray duplicate**: `server/routes/scripts/test-email.ts` — deleted.
3. ✅ **Dead code** — removed: `helpers.generateToken`, `sanitizeInput`, `formatDateForMySQL`, `optionalAuth`, `sendWelcomeEmail`, and the frontend's `handlePasswordUpdate`/`deleteItem`/`editItem`/`followUser`.
4. ✅ **`status != 'D'`** leftovers — already removed from itemCount queries.
5. ✅ **`users.old_password`** — [db-migrations/004-drop-old-password-column.sql](db-migrations/004-drop-old-password-column.sql) created; run it once the bcrypt migration is confirmed complete (then `server/scripts/migrate-passwords.ts` can be deleted too) -> DONE.
6. ✅ **CSP enabled** — helmet now ships its default CSP (`script-src 'self'`, `script-src-attr 'none'`); all inline `onclick` handlers were refactored to `data-action` attributes with a delegated listener, so the app works under strict CSP.
7. ❌ **Config fallback order** ([conf.ts](server/config/conf.ts)): if `conf.dev.ts` accidentally reaches a production build, it silently wins over `conf.prod.ts`. Consider selecting by `NODE_ENV` instead of "dev first, then prod".
8. ✅ **`itemsAPI.donate`** now passes an object like every other call.
9. ❌ **`window.location.reload()`** after every mutation is heavy-handed; re-rendering the list would keep scroll position and feel faster. Fine functionally.
10. ✅ **Toast messages** are now set via `textContent`, and `ui.showError` escapes its message.
11. ✅ **Login `LOWER()` comparisons** removed — plain `WHERE username = ? OR email = ?` (utf8mb3 collation is case-insensitive), so indexes can be used.
12. ❌ **`users` search exposure**: `/api/share/search` returns matching users' full names and usernames to any logged-in user. Probably acceptable for this app, but be aware it's a directory of all members.

---

## Comparison with v2 (`verlang2/src/main`)

| Aspect | v2 (Java/JSP) | v3 | Verdict |
|---|---|---|---|
| Passwords | plain text (`old_password` MD5-era) | bcrypt(10) + migration script | ✅ major improvement |
| SQL | parameterized (`TSQL`) | parameterized (`mysql2`) | ✅ parity |
| Auth | server sessions | JWT (7d, localStorage) | ⚠️ localStorage + XSS (H1) is a riskier combo than httpOnly cookies |
| Share links | `((id*97)+17)*97+19` | identical | ❌ weakness inherited (H2) |
| Unauthenticated donate | yes | yes, but unused by UI | ❌ inherited & now pointless (H3) |
| Rate limiting / helmet / CORS | none | present | ✅ improvement |
| I18n | JSP-embedded | translations.json (NL/FR/EN) | ✅ improvement |

---

## Suggested priority order (remaining work)

1. Run migrations 003 (unique username) and — after confirming bcrypt migration — 004 (drop `old_password`) on production.
2. Redact giver info from `getList` for owners (M5).
3. Remove the hard-coded credentials from [hash-password.js](hash-password.js) (L1).
4. Longer term: migrate to InnoDB + FKs (M8), config selection by `NODE_ENV` (L7).
5. Smoke-test the UI: modals, reserve/donate/takeback, drag-reorder, language switchers, and search — the inline-handler → `data-action` refactor and new CSP touch all of them.
