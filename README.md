# Idea Collision Machine

A creative idea generator that combines two unrelated worlds and turns the collision into unexpected project concepts.

## Live Demo

**Idea Collision Machine** — https://idea-collision-machine-1.onrender.com/

## Overview

Idea Collision Machine helps people generate fresh ideas by combining two different categories.

Choose two worlds — for example, **Healthcare + Gaming** — and the app creates a creative collision that can be explored, remixed, saved, or revisited later.

The project is designed as a simple, accessible creative tool for brainstorming and experimentation.

## Features

* Preset category selection
* Custom categories
* Creative collision generation
* Remixing ideas
* Starting a new round
* User registration and sign-in
* Saving generated challenges
* Deleting saved challenges
* Remixing saved challenges
* Activity statistics
* Responsive interface
* Keyboard-friendly controls
* Accessible interface
* Visual background experience
* **Powered by Codyza**

## How It Works

1. Select one category from the first group.
2. Select a second category from the other group.
3. Generate a collision.
4. Explore the resulting challenge.
5. Remix it for another variation.
6. Save ideas worth keeping.
7. Return to saved ideas and continue experimenting.

The collision API uses creative templates and variations, so the application does not depend on a paid AI API.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### API

* Node.js
* Express
* TypeScript

### Authentication

* FastAPI
* Python
* SQLAlchemy
* SQLite
* JWT authentication
* Argon2 password hashing

### Deployment

* Render
* GitHub

## Project Structure

```text
idea-collision-machine/
├── auth/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   └── .env
├── server/
│   └── server.ts
├── src/
│   ├── App.tsx
│   └── App.css
├── public/
├── package.json
└── README.md
```

## Running Locally

### Install frontend dependencies

```bash
npm install
```

### Start the frontend

```bash
npm run dev
```

### Start the collision API

From the project root:

```bash
npx tsx server/server.ts
```

The local collision API runs on port `3001`.

### Start the authentication API

From the `auth` directory:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The authentication API runs on port `8000`.

For local authentication, configure the required environment variables in `auth/.env`. Do not commit secrets or local database files to GitHub.

## API

### Health endpoint

```text
GET /
```

Returns a simple API status message.

### Generate a collision

```text
POST /api/challenge
```

Example request:

```json
{
  "category1": "Healthcare",
  "category2": "Gaming",
  "seenChallenges": []
}
```

The API returns a generated creative challenge.

The frontend uses the local API during development and the deployed Render API in production.

## Authentication

The authentication service provides:

* Registration
* Login
* Current-user lookup
* Saving challenges
* Listing saved challenges
* Deleting saved challenges

Authentication uses JWT tokens, while passwords are securely hashed with Argon2.

## Accessibility

Accessibility is part of the interface design.

The application uses semantic buttons and form controls, visible focus states, readable contrast, and keyboard-friendly interactions.

## Deployment

The frontend and collision API are deployed on Render.

The production frontend connects to the deployed collision API, while the authentication service handles account-related features.

Local secrets and database files are excluded from GitHub through `.gitignore`.

## Why This Project?

Unexpected combinations can lead to unexpected solutions.

Idea Collision Machine turns that principle into an interactive tool for brainstorming, experimentation, and creative problem solving.

## Credits

**Powered by Codyza**

## Repository

Source code is available on GitHub:

https://github.com/axelkrogness1997-ui/idea-collision-machine
