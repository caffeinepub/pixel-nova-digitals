# Specification

## Summary
**Goal:** Add a “site retired” mode that effectively disables the website for non-admin users, with an admin-controlled retirement toggle and optional full data purge.

**Planned changes:**
- Backend: add a canister-level retired flag with an optional public message, including a public query to read status and an admin-only update method to toggle/set the message.
- Backend: gate all non-admin, non-status operations (e.g., profile and generation history APIs) when retired, returning a clear English “site is retired” error; keep admin-only operations available.
- Backend: add an admin-only “purge all user data” operation (profiles + generation history) that is only allowed when the site is retired.
- Frontend: add a “Site Retired” screen that replaces the normal app UI for non-admin users across all routes, using the backend-provided public message when present and not requiring authentication to view.
- Frontend: extend the Admin page with admin-only controls to retire/unretire the site (with optional message) and to purge all user data (enabled only after retirement), both with confirmation and proper English error display.
- Frontend: apply a consistent neutral/gray shutdown theme across the retired screen and the admin retirement/purge section.

**User-visible outcome:** When the site is retired, all non-admin visitors see a single shutdown notice page on every route and cannot access any features; admins can retire/unretire the site, set a public message, and (when retired) purge all stored user data from the Admin page.
