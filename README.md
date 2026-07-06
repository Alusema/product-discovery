# Haven Catalog Discovery

A polished single-page product discovery experience for a home goods catalog take-home assignment. It is built with Next.js, TypeScript, Tailwind CSS, Fuse.js, and Framer Motion.

## What Was Built

- A premium Spotlight-style search experience for a local catalog of roughly 4,000 home goods products.
- Instant fuzzy search as the user types, with no search button.
- Weighted Fuse.js ranking across title, tags, description, brand, and category.
- Suggestion chips for common discovery paths: Oak, Marble, Storage, Kitchen, Minimal, and Outdoor.
- Recent searches persisted in localStorage.
- Responsive animated product cards with images, price, category, stock status, ratings, and review counts.
- A more thoughtful empty state that suggests broader searches instead of stopping at "No results."

## How To Run

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Search Decisions

Search is intentionally client-side because the dataset is small enough to load locally and the assignment is about making discovery feel fast. Fuse.js is configured with a moderate fuzzy threshold so partial and imperfect terms work without making results feel random.

The ranking weights are:

- `title`: highest weight
- `tags`: high weight
- `description`: supporting context
- `brand`: secondary refinement
- `category`: secondary refinement

## Why Title And Tags Are Weighted Highly

Product titles usually contain the strongest intent signals, such as material, shape, and product type. Tags are also highly valuable because they normalize product attributes that may not always appear cleanly in a title. Weighting both highly makes searches like "oak storage" or "minimal kitchen" feel useful quickly.

## Why Ecommerce Features Were Avoided

This is a product discovery assignment, not a full store. I avoided cart, checkout, authentication, complex filters, and dense sidebars so the experience stays focused on search quality, browse feel, visual polish, and ranking behavior.

## Tradeoff

Fuzzy search improves discovery because it handles imperfect spelling, partial words, and exploratory queries. The tradeoff is that if the fuzzy threshold is too aggressive, precision drops and loosely related items can appear. This implementation keeps the threshold moderate to balance breadth with relevance.

## What I Would Do Next

- Add small ranking boosts for in-stock items and highly rated products.
- Add lightweight keyboard navigation for the search results.
- Add query highlighting so users can see why a result matched.
- Add an optional sort control for newest, price, and rating without turning the page into a full ecommerce interface.
