# Specification

## Summary
**Goal:** Let signed-in users edit their profile after onboarding, starting with updating their display name.

**Planned changes:**
- Add a visible “Edit Profile” entry point in the main UI that appears only when the user is authenticated.
- Create an Edit Profile dialog or page that pre-fills the user’s current saved name and allows updating it.
- On submit, save the updated name using the existing backend profile save flow and show a success message.
- Ensure any UI that displays the user’s profile name updates immediately after save without a full page reload.

**User-visible outcome:** Signed-in users can open “Edit Profile”, change their display name, save it successfully, and see the updated name reflected across the app; signed-out users won’t see (or can’t use) the edit profile option.
