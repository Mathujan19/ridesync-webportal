# RideSync Admin Web Portal

React + Firebase admin panel for coordinating operators and issue alerts.

## Architecture (Triangular Flow)

1. Admin Web App (React): sends commands from a protected admin panel.
2. Firebase (Auth + Firestore): stores state and enforces permissions.
3. Operator App (Mobile): receives updates via Firestore listeners and FCM push.

## Implemented Modules

- Protected routes with Firebase Auth and Custom Claim role check (`Admin` only).
- Firestore-driven dashboard modules:
	- Live issue list/map entry point
	- Broadcast messenger by region
	- Operator status toggle (active/break)
	- User freeze/unfreeze controls
	- Weather API panel (OpenWeather)
	- Admin action logs
- Issue reporting flow to `road_alerts` with Cloud Function trigger for FCM.

## Data Collections

- `users/`: profile, role, frozen state
- `reports/`: road/weather issues
- `road_alerts/`: admin-generated urgent alerts
- `operators/`: operator status and region
- `broadcasts/`: regional operator broadcasts
- `logs/`: immutable admin action audit trail

## Security and Backend

- Firestore rules are in `firestore.rules` and restrict role edits to admins.
- Cloud Functions are in `functions/index.js`:
	- `notifyOperatorsOnRoadAlert`
	- `createOperatorAccount`
	- `weatherWatchdog`

## Environment Variables

Copy `.env.example` to `.env` and set:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_OPENWEATHER_API_KEY` (optional)

## Run

```bash
npm install
npm run dev
```

## Next Deploy Steps

1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Deploy functions: `firebase deploy --only functions`
3. Set custom claims for admins/operators in Firebase Admin SDK or callable flow.
