# Specification

## Summary
**Goal:** Build a free, client-facing “PIXEL NOVA DIGITALS” website that showcases and provides in-browser Text-to-Image, Text-to-Video, and Text-to-Voiceover tools, with Internet Identity sign-in and per-user generation history.

**Planned changes:**
- Create a branded landing/home page in English listing available tools (Image, Video, Voiceover) plus a placeholder for future tools, with navigation to each tool.
- Implement Text-to-Image page: prompt input, client-side image generation (no third-party AI APIs), preview, and download.
- Implement Text-to-Voiceover page: text input, client-side speech synthesis playback with basic controls, and download/export when feasible in-browser.
- Implement Text-to-Video page: prompt input, client-side generated video (e.g., animated scene/text recorded in-browser), preview, and download.
- Add Internet Identity authentication (sign in/out) and a “My History” section to list and reopen prior generations.
- Implement backend persistence in a single Motoko actor to create/list per-user generation records (type, prompt/text, createdAt, and identifiers), isolated by principal and upgrade-safe via stable storage patterns.
- Apply a cohesive, distinct visual theme (not primarily blue/purple), responsive across mobile and desktop.
- Add and use generated static brand assets (logo, hero illustration, tool icons) from `frontend/public/assets/generated` in the UI.

**User-visible outcome:** Users can visit a branded, free PIXEL NOVA DIGITALS site, navigate to each tool, generate images/videos/voiceovers entirely in-browser with download options, sign in with Internet Identity, and view their own cross-session generation history.
