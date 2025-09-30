# Ignite Fleet API

Support backend for my IgniteFleet React Native project.

API built with Node + Express + Mongoose

Google Login (`/auth/google`) receiving `idToken` from the app

Issues its own JWT

MongoDB Atlas as database

Protected routes with Bearer token

## Running locally

`cp .env.example .env` and fill in the variables

`npm i`

`npm run dev`

Test health: `GET http://localhost:3333/health`

## Auth (token exchange)

`POST /auth/google`

```json
{ "idToken": "GOOGLE_ID_TOKEN" }
```
