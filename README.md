# Vinland Café

A beginner-friendly full-stack café menu application. It uses a browser frontend, an Express API, and SQLite file storage.

## Features

- Separate Hot Drinks, Cold Drinks, and Desserts sections.
- Add menu items with a name and price.
- Edit a selected item's price.
- Delete any item from its section.
- Store menu items permanently in SQLite.
- Prevent duplicate menu-item names.
- Show useful API error messages in the page.

## Tech stack

- HTML, CSS, and vanilla JavaScript
- Node.js and Express
- SQLite through Node's built-in `node:sqlite` module

## Requirements

- Node.js 22 or later
- npm

## Run locally

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
```

Start development mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

`npm run dev` restarts the server whenever `server.js` changes. You can also run `npm start`, which uses port `3000` when no `PORT` environment variable is provided.

## Project structure

```text
.
├── data/
│   └── vinland-cafe.db    # SQLite database; ignored by Git
├── public/
│   ├── index.html         # Page structure
│   ├── styles.css         # Styling
│   └── script.js          # Browser behavior and API requests
├── server.js              # Express server and SQLite queries
├── package.json
└── .gitignore
```

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/menu` | Get all menu items |
| `POST` | `/api/menu` | Create an item |
| `PATCH` | `/api/menu/:id` | Update an item's price |
| `DELETE` | `/api/menu/:id` | Delete an item |

Example POST request body:

```json
{
  "name": "Iced Latte",
  "price": 4.5,
  "category": "cold"
}
```

Allowed categories are `hot`, `cold`, and `dessert`.

## Database

The application creates `data/vinland-cafe.db` automatically. Each menu item has an `id`, `name`, `price`, and `category`.

The database file and `.env` file are ignored by Git, so local data and configuration are not committed.
