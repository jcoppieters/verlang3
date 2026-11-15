# TODO - Verlanglijstje v3

This list reflects the current repository, not the original implementation plan. Items below are open unless explicitly marked otherwise. Production behavior cannot be confirmed from this checkout.

## Open Work

### Account deletion
- [ ] Add an authenticated account-deletion flow with a clear confirmation.
- [ ] Define and implement deletion/anonymization for the account's lists, items, follows, and reservation/donation data.
- [ ] Decide whether deletion is immediate or has a grace period; send confirmation if required.

### Automated tests
- [ ] Replace the `npm test` placeholder with a runnable test suite.
- [ ] Cover authentication and password reset, list/item permissions and operations, search, and public sharing.
- [ ] Test share-ID encoding/decoding against known IDs from the Java application.

### Production verification
- [ ] Confirm the live deployment version and verify HTTPS/Nginx proxying to the app on port 3007.
- [ ] Confirm production configuration and credentials are securely provisioned; rotate credentials if they have been exposed.
- [ ] Verify database backup and restore, and ensure error logging and uptime monitoring are in place.

### Documentation refresh
- [ ] Update `README.md`, `QUICKSTART.md`, and `PROJECT_SUMMARY.md`; they still describe setup and implementation as future work and include stale project/config details.
- [ ] Review `API.md` for consistency with the current routes. API documentation already exists; do not recreate it.
- [ ] Add or link a concise user guide and production backup/deployment instructions if these are still needed.

## Verified Implemented

Repository inspection confirms the main auth/profile/password-reset flow, list and item management, follows, search, public sharing, responsive UI, translations, database configuration/migrations, email utilities, security headers, and rate limiting are present. This is a code-presence check, not a fresh end-to-end production test.

## Deferred Ideas

Not committed release work: PWA/offline support, push notifications, item images, rich-text descriptions, import/export, list templates, activity feed, email digests, social sharing, dark mode, accessibility improvements, admin tools, and analytics.

## Deployment History

The old checklist records production deployments through v3.0.2 on 2026-07-01. `package.json` currently reports v3.0.15; the actual production version needs confirmation.
