# MediGig ZA

South African medical freelance marketplace — practices hire verified locum
professionals, professionals pick up shifts. Escrow-protected payments, day
rates set by the professional, and an AI copilot for matching and shift briefs.

## Stack

- **Client:** React 19 + Vite + Tailwind CSS 4, `motion`, `lucide-react`
- **Server:** zero-dependency Node `http` API with a JSON file store
  (`server/data/db.json` is generated and git-ignored)
- **AI:** server-side proxy — z.ai GLM first, then OpenRouter/Cohere, with a
  deterministic rule-based fallback so the copilot always answers

## Run locally

```bash
# API on :8787
node server/index.js

# UI on :5173 (proxies /api and /uploads to :8787)
node_modules/.bin/vite --port 5173

# or both
npm run dev
```

`./build-all.sh dev|build|preview` wraps the same flows.

## Android APK

The Android app is packaged with Capacitor. Install Node.js, JDK 21, and the
Android SDK (including Android SDK Platform 36 and Build Tools 36), then install
the project dependencies and generate the Android project once:

```bash
npm ci
npm run android:init
```

Set `VITE_API_BASE_URL` to the HTTPS origin of a deployed MediGig API before
building. For Android Emulator development, `http://10.0.2.2:8787` reaches the
host machine's local API; HTTP is enabled only in the debug manifest. A
physical device needs a reachable HTTPS API.

```bash
VITE_API_BASE_URL=https://api.example.com npm run android:apk
```

The debug APK is written to
`android/app/build/outputs/apk/debug/app-debug.apk`. `npm run android:sync`
rebuilds the web bundle and synchronizes it to the native project. A release
APK/AAB must be signed with your own Android signing key before distribution.

## Demo accounts

Password for all three: `demo1234`

| Role | Email |
| --- | --- |
| Hirer (practice) | `netcare@medigig.za` |
| Professional | `doctor@medigig.za` |
| Both | `both@medigig.za` |

## Core rules

- Profiles are initials-only — no photos, no in-app chat.
- Search shows distance in km; the full address and phone unlock only after a
  booking is accepted.
- The hirer funds escrow up front (5% service fee added). Escrow releases to the
  professional 5 business days after the hirer confirms completion.
- Declines and early cancellations refund the escrow to the hirer's wallet.

## Environment

Copy `.env` values into your shell or a local `.env` file. AI keys are optional;
without them the copilot falls back to rule-based answers.
