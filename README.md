# WakeLit 🔴

A Chrome/Edge extension that keeps your Streamlit Community Cloud apps
awake, so visitors never hit the "this app has gone to sleep" screen.

## The problem

Streamlit Community Cloud puts apps to sleep after 12 hours without
traffic. A normal HTTP ping doesn't fix this — it gets a 200 response,
but the app never actually restarts, because that response is just a
static HTML shell. The real app only starts once a browser runs its
JavaScript and opens a WebSocket connection.

## How WakeLit fixes it

WakeLit opens each of your tracked apps in a real (background) browser
tab on a schedule. If it finds the sleep screen, it clicks the wake
button for you automatically, then closes the tab.

- Runs entirely client-side — no server, no account, no data leaves
  your browser
- Configurable check interval (1–12 hours)
- Per-app status (checking / awake / unresponsive) with a "last
  checked" timestamp
- Manual "Check all now" button alongside the scheduled checks
- Add/remove tracked apps from a simple popup

## Install

1. Download or clone this repo
2. Go to `chrome://extensions` (or `edge://extensions`)
3. Turn on **Developer mode**
4. Click **Load unpacked**, select the `wakelit` folder
5. Pin the icon, open the popup, paste in your app's `.streamlit.app` URL

## Using it

- **Add an app**: paste the URL, click "Watch this app"
- **Check now**: "Check all now" checks every tracked app immediately
- **Interval**: pick how often WakeLit checks in, from the dropdown in
  the popup
- **Status**: `checking` (in progress) → `awake` (confirmed up) →
  `unresponsive` (didn't respond in time — worth checking manually)

## Tech

Vanilla JS, Manifest V3. No build step, no dependencies.

- `background.js` — schedules checks via `chrome.alarms`, opens/tracks
  tabs via `chrome.tabs`, stores per-app status via `chrome.storage`
- `content.js` — runs inside the app's tab, detects and dismisses the
  sleep screen, reports back via `chrome.runtime.sendMessage`
- `popup.js` / `popup.html` / `popup.css` — UI for managing tracked
  apps, live-updates via `chrome.storage.onChanged`

## Limitations

- Only detects Streamlit's specific sleep screen currently
- Chrome/Edge must be running (even in background) for scheduled
  checks to fire — it can't wake a fully closed browser
- `unresponsive` can mean either "couldn't wake up" or "app/network
  issue" — it doesn't yet distinguish between the two
## License

MIT — see [LICENSE](LICENSE)
