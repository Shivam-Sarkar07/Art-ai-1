# Art AI — React Native App

A mobile app where users scan or upload artwork and receive an AI-generated critique across 5 flexible categories (Technical, Composition, Color, Originality, Improvement). Free tier for basics, Pro/Premium for deeper analysis, gallery, AI coach.

Built per the [blueprint](./art-ai-blueprint.md). All features are wired with real backend services — **no demo data**. Bring your own Firebase, Gemini, and Razorpay credentials.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup — Step by Step](#setup--step-by-step)
  - [1. Install dependencies](#1-install-dependencies)
  - [2. Firebase setup](#2-firebase-setup)
  - [3. Gemini API key](#3-gemini-api-key)
  - [4. Razorpay setup](#4-razorpay-setup)
  - [5. Deploy Cloud Functions](#5-deploy-cloud-functions)
  - [6. Run the app](#6-run-the-app)
- [Feature Status](#feature-status)
- [API Key Locations](#api-key-locations)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React Native 0.74 (CLI, not Expo) |
| Language | TypeScript |
| State | Zustand |
| Navigation | React Navigation 6 |
| Auth | Firebase Auth (email/password) |
| Database | Cloud Firestore |
| Image storage | Firebase Storage |
| Payments | Razorpay (subscriptions + scan packs) |
| AI brain | Google Gemini 2.0 Flash (Vision) |
| Backend | Firebase Cloud Functions (Node 20) |

---

## Project Structure

```
ArtAI/
├── src/
│   ├── config/          # Firebase, Gemini, Razorpay, env config
│   ├── navigation/      # Auth stack, main tabs, root navigator
│   ├── screens/         # All UI screens (auth, home, scan, result, history, gallery, profile, etc)
│   ├── components/      # Reusable UI (ScoreCard, BlurredContent, ArtworkTile, etc)
│   ├── services/        # Firebase, Gemini, Razorpay, scan orchestration, badges
│   ├── store/           # Zustand stores
│   ├── theme/           # Colors, typography, spacing
│   ├── types/           # TypeScript types
│   └── utils/           # Constants, formatters
├── functions/           # Cloud Functions (Gemini + Razorpay backend)
│   └── src/index.ts     # All callable functions
├── android/             # Native Android project
├── ios/                 # Native iOS project
├── firebase.json        # Firebase config
├── firestore.rules      # Firestore security rules
├── storage.rules        # Storage security rules
└── .env.example         # Template for env vars
```

---

## Prerequisites

- Node.js 18+
- For Android: Android Studio + JDK 17 + Android SDK 34
- For iOS: macOS + Xcode 15+ + CocoaPods
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (Blaze plan required for Cloud Functions)
- A Google AI Studio account (for Gemini API key)
- A Razorpay account (test mode is fine to start)

---

## Setup — Step by Step

### 1. Install dependencies

```bash
cd ArtAI
npm install
cd ios && pod install && cd ..    # macOS only
```

### 2. Firebase setup

1. Go to <https://console.firebase.google.com/> and create a project (or use existing).
2. **Add an Android app** — package name `com.artai.app`. Download `google-services.json` and place it at `android/app/google-services.json`.
3. **Add an iOS app** — bundle id `com.artai.app`. Download `GoogleService-Info.plist` and place it at `ios/ArtAI/GoogleService-Info.plist`.
4. In Firebase Console, enable:
   - **Authentication** → Sign-in method → Email/Password
   - **Cloud Firestore** (production mode — rules are in this repo)
   - **Storage** (production mode — rules are in this repo)
   - **Cloud Functions** (requires Blaze plan)
5. Fill in your Firebase config in [`src/config/env.ts`](./src/config/env.ts):
   ```ts
   const ENV = {
     FIREBASE_API_KEY: 'AIzaSyXXXXXXXXXXXXXXXXXXXX',
     FIREBASE_AUTH_DOMAIN: 'your-project.firebaseapp.com',
     FIREBASE_PROJECT_ID: 'your-project',
     FIREBASE_STORAGE_BUCKET: 'your-project.appspot.com',
     FIREBASE_MESSAGING_SENDER_ID: '000000000000',
     FIREBASE_APP_ID: '1:000000000000:android:xxxxxxxxxxxxxxxxxxxxxx',
     GEMINI_API_KEY: '',                  // see step 3
     RAZORPAY_KEY_ID: '',                 // see step 4
   };
   ```

### 3. Gemini API key

1. Go to <https://aistudio.google.com/app/apikey> and create an API key.
2. **Preferred (secure) path — set as Cloud Function secret:**
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   # paste your key when prompted
   ```
3. *(Optional)* **Dev fallback** — also paste it in `src/config/env.ts` as `GEMINI_API_KEY`. The app will call Gemini directly if the Cloud Function isn't deployed. Not for production.

### 4. Razorpay setup

1. Create a Razorpay account at <https://razorpay.com/>.
2. Go to **Settings → API Keys → Generate Key**. Save the Key ID and Key Secret.
3. Create subscription plans in **Subscriptions → Plans**:
   - **Pro plan**: monthly, ₹199 — note the `plan_xxxxx` ID
   - **Premium plan**: monthly, ₹499 — note the `plan_xxxxx` ID
4. *(Optional)* Create a coupon `ARTAI5` for 5% off — used for perfect-score reward.
5. Set Cloud Function secrets:
   ```bash
   firebase functions:secrets:set RAZORPAY_KEY_ID
   firebase functions:secrets:set RAZORPAY_KEY_SECRET
   firebase functions:secrets:set RAZORPAY_PRO_PLAN_ID        # plan_xxxxx
   firebase functions:secrets:set RAZORPAY_PREMIUM_PLAN_ID    # plan_yyyyy
   ```
6. In `src/config/env.ts`, set `RAZORPAY_KEY_ID` (the public Key ID — safe to bundle).

### 5. Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions,firestore:rules,storage:rules
```

This deploys 4 callable functions:
- `analyzeArtwork` — Gemini vision critique
- `aiCoach` — In-app AI coach for usage questions
- `createRazorpaySubscription` — Creates a Razorpay subscription
- `createRazorpayOrder` — Creates a Razorpay order (scan packs)
- `verifyRazorpayPayment` — Verifies signature and applies benefits

### 6. Run the app

```bash
# Android
npm run android

# iOS
npm run ios
```

---

## Feature Status

| Feature | Status |
|---|---|
| Email/password auth (Firebase) | ✅ |
| Onboarding + Login + Signup + Forgot password | ✅ |
| Camera + gallery image picker | ✅ |
| Gemini Vision artwork critique (5 categories) | ✅ |
| Style/medium classification | ✅ |
| Polite fallback for unrecognized art | ✅ |
| Near-perfect → Congratulations page + 5% reward (max 2 lifetime) | ✅ |
| Free vs Pro vs Premium gating | ✅ |
| Blurred improvement plans for free users | ✅ |
| History (rolling last 10 scans) | ✅ |
| Gallery (full grid — Pro/Premium) | ✅ |
| Profile with stats dashboard | ✅ |
| Titles & badges (Gold/Diamond/Artist/Master + variants) | ✅ |
| Razorpay subscriptions (Pro ₹199 / Premium ₹499) | ✅ |
| Pay-per-scan top-up packs (v1.5) | ✅ |
| Floating AI Coach (app-usage help) | ✅ |
| Settings: Account Info, Notifications, Privacy, Terms, Report Bug, Help | ✅ |
| "Was this review helpful?" feedback (prompt tuning loop) | ✅ |
| AI limitations disclaimer on every critique | ✅ |
| Leaderboard | ⏸ v2 (per blueprint) |

---

## API Key Locations

| Secret | Where to set it |
|---|---|
| Firebase config (client) | `src/config/env.ts` |
| `google-services.json` (Android) | `android/app/google-services.json` |
| `GoogleService-Info.plist` (iOS) | `ios/ArtAI/GoogleService-Info.plist` |
| Gemini API key (server, preferred) | `firebase functions:secrets:set GEMINI_API_KEY` |
| Gemini API key (dev fallback) | `src/config/env.ts` → `GEMINI_API_KEY` |
| Razorpay Key ID (public) | `src/config/env.ts` → `RAZORPAY_KEY_ID` |
| Razorpay Key Secret (server only) | `firebase functions:secrets:set RAZORPAY_KEY_SECRET` |
| Razorpay plan IDs (server only) | `firebase functions:secrets:set RAZORPAY_PRO_PLAN_ID` etc |

---

## Customization

- **App name / brand:** edit `app.json` (root), `android/app/src/main/res/values/strings.xml`, and `ios/ArtAI/Info.plist`.
- **Color palette:** edit `src/theme/colors.ts`.
- **Tier prices / scan limits:** edit `src/utils/constants.ts`.
- **Badge criteria:** edit `src/utils/constants.ts` → `BADGE_CRITERIA`.
- **Gemini prompt:** edit `src/services/geminiService.ts` (client) and `functions/src/index.ts` (server — the source of truth).
- **Disclaimer text:** edit `src/utils/constants.ts` → `AI_DISCLAIMER`.

---

## Troubleshooting

**"Firebase not configured" banner**
→ Open `src/config/env.ts` and paste your Firebase credentials.

**"Artwork analysis requires either deployed Cloud Functions OR a GEMINI_API_KEY"**
→ Either deploy Cloud Functions (preferred) or paste your Gemini API key in `src/config/env.ts`.

**Razorpay checkout won't open**
→ Verify `RAZORPAY_KEY_ID` is set in `src/config/env.ts`. Also confirm Razorpay Activity is declared in `AndroidManifest.xml` (already done in this repo).

**Subscriptions not activating after payment**
→ Run `firebase functions:logs --only verifyRazorpayPayment` to see what's happening server-side. Most common cause: `RAZORPAY_KEY_SECRET` not set as a secret.

**Build error: "Cannot find module '@react-native-firebase/app'"**
→ Run `npm install` then `cd ios && pod install && cd ..`.

**iOS: "Could not find Firebase pod"**
→ Make sure your Podfile includes the Firebase pods (already in this repo). Run `pod repo update` then `pod install`.

**Scan image fails to upload**
→ Check Firebase Storage rules — only the user owning the path can write. Confirm your user is signed in.

---

## Next Steps After First Run

1. Test the full flow: signup → scan → wait for critique → view result → check history.
2. Upgrade to Pro (test mode) — verify the Razorpay checkout modal opens and the tier flips to "Pro" in the profile.
3. Scan 10+ artworks to start earning the Gold title (Pro/Premium only).
4. Watch for the "perfect-score reward" — score 9+ on all 5 categories and you'll get 5% off your next subscription.
5. Tap the floating AI Coach icon (purple) for in-app help.

Enjoy building the future of AI art critique! 🎨
