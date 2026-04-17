# NRC Clone — Backend (STRIDE)

REST API for the NRC Clone iOS app. Handles run storage, user profiles, and request authentication via Firebase ID tokens.

---

## Stack

- **Runtime** — Node.js
- **Framework** — Express
- **Database** — Cloud Firestore
- **Auth** — Firebase Admin SDK (ID token verification)

---

## Project Structure

```
src/
├── index.js
├── app.js                        # Express app, middleware, routes
├── config/
│   └── firebase.js               # Firebase Admin init (db, auth exports)
├── middleware/
│   ├── authenticate.js           # Verifies Firebase ID token → req.user
│   └── errorHandler.js           # AppError class + global error handler
├── routes/
│   ├── runs.js
│   └── users.js
├── controllers/
│   └── runController.js
└── services/
    └── runService.js             # All Firestore logic for runs
```

**Key decisions:**
- SwiftData UUID used as Firestore document ID — keeps iOS and backend models in sync
- All run queries filtered by `userId` — users can only access their own data
- Ownership check on every mutating endpoint before writing
- Splits embedded in the run document (not a subcollection) — always read together, stored together

---

## API Reference

All endpoints require `Authorization: Bearer <Firebase ID Token>`.

### Runs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/runs` | List all runs for authenticated user |
| `GET` | `/api/runs/:id` | Get a single run |
| `POST` | `/api/runs` | Create a run |
| `PATCH` | `/api/runs/:id` | Update a run (owner only) |
| `DELETE` | `/api/runs/:id` | Delete a run (owner only) |

### Users

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users/me` | Get or create user profile |
| `PATCH` | `/api/users/me` | Update profile fields |

### Run schema

```json
{
  "id": "A0238519-55BD-4D79-AACB-DF8688064DF5",
  "userId": "firebase-uid",
  "name": "Thursday Evening Run",

  "date": "2026-04-17T02:25:42Z",
  "endTime": "2026-04-17T02:26:13Z",
  "createdAt": "<timestamp>",
  "updatedAt": "<timestamp>",

  "distance": 113.70,
  "elapsedTime": 31.57,
  "activeTime": 29,
  "avgPace": 0.255,
  "fastestPace": 0.277,

  "elevationGain": 0,
  "elevationLoss": 0,

  "avgHR": 0,
  "maxHR": 0,

  "isDeleted": false,

  "coordinates": [
    { "latitude": 37.33006921, "longitude": -122.02117912 }
  ],

  "splits": [
    {
      "id": "6393400B-A478-4853-A988-E6EDC20FC4B9",
      "startTime": "2026-04-17T02:25:42Z",
      "distance": 113.70,
      "duration": 31.57,
      "avgPace": 0.277,
      "elevation": 0
    }
  ]
}
```

| Field | Unit | Notes |
|---|---|---|
| `distance` | meters | |
| `elapsedTime` | seconds | total clock time |
| `activeTime` | seconds | excludes pauses |
| `avgPace` / `fastestPace` | min/meter | |
| `elevationGain` / `elevationLoss` | meters | |
| `avgHR` / `maxHR` | bpm | 0 if HealthKit unavailable |
| `isDeleted` | boolean | soft delete flag |

### Error format

```json
{ "error": "Run not found" }
```

---

## Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/kkennethsieu/stride-backend
   cd stride-backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Get your credentials from:
   > Firebase Console → Project Settings → Service Accounts → Generate New Private Key

   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   PORT=8080
   ```

3. **Run**
   ```bash
   npm run dev
   ```