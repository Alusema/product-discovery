"use client";

import Fuse from "fuse.js";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { featuredProducts, products, type Product } from "@/lib/products";

const suggestionChips = ["Oak", "Marble", "Storage", "Kitchen", "Minimal", "Outdoor"];
const maxResults = 96;
const recentSearchLimit = 5;
const recentSearchKey = "haven-recent-searches";

const fuse = new Fuse(products, {
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  threshold: 0.34,
  keys: [
    { name: "title", weight: 0.48 },
    { name: "tags", weight: 0.28 },
    { name: "description", weight: 0.1 },
    { name: "brand", weight: 0.08 },
    { name: "category", weight: 0.06 },
  ],
});

const normalizeRecent = (query: string) => query.trim().replace(/\s+/g, " ");

export function ProductDiscovery() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(recentSearchKey);
    if (saved) {
      setRecentSearches(JSON.parse(saved) as string[]);
    }
  }, []);

  useEffect(() => {
    const normalized = normalizeRecent(query);
    if (normalized.length < 2) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRecentSearches((current) => {
        const next = [
          normalized,
          ...current.filter((item) => item.toLowerCase() !== normalized.toLowerCase()),
        ].slice(0, recentSearchLimit);
        window.localStorage.setItem(recentSearchKey, JSON.stringify(next));
        return next;
      });
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const trimmedQuery = query.trim();
  const searchResults = useMemo(() => {
    if (!trimmedQuery) {
      return featuredProducts;
    }

    return fuse.search(trimmedQuery).map((result) => result.item);
  }, [trimmedQuery]);

  const visibleProducts = searchResults.slice(0, maxResults);
  const resultCount = trimmedQuery ? searchResults.length : products.length;
  const resultLabel = trimmedQuery
    ? `${resultCount.toLocaleString()} matches for "${trimmedQuery}"`
    : `${products.length.toLocaleString()} pieces in the catalog`;

  const runSearch = (nextQuery: string) => {
    setQuery(nextQuery);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ee] text-stone-950">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_5%,rgba(255,255,255,0.98),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(194,213,199,0.42),transparent_28%),linear-gradient(180deg,#fbfaf7_0%,#f2eee6_56%,#ebe7de_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.32] [background-image:linear-gradient(rgba(68,60,48,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(68,60,48,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="mx-auto flex min-h-[58vh] w-full max-w-6xl flex-col items-center justify-center px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-stone-500">
            Haven Catalog
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl text-balance text-5xl font-semibold leading-[1.02] text-stone-950 sm:text-6xl lg:text-7xl">
            Find the piece that makes the room click.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-stone-600 sm:text-lg">
            Search materials, rooms, styles, brands, or product names across a curated home
            goods catalog.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 w-full max-w-3xl"
        >
          <label className="relative block">
            <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-stone-400">
              /
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search oak storage, marble tray, outdoor..."
              autoFocus
              className="h-20 w-full rounded-[30px] border border-white/80 bg-white/86 px-14 text-lg font-medium text-stone-950 shadow-[0_24px_90px_rgba(74,64,50,0.16)] outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-stone-300 focus:bg-white sm:h-24 sm:px-16 sm:text-2xl"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm font-medium text-stone-500 transition hover:border-stone-300 hover:text-stone-950"
              >
                Clear
              </button>
            ) : null}
          </label>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => runSearch(chip)}
                className="rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-stone-600 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white hover:text-stone-950"
              >
                {chip}
              </button>
            ))}
          </div>

          {recentSearches.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-stone-500">
              <span>Recent</span>
              {recentSearches.map((recent) => (
                <button
                  key={recent}
                  type="button"
                  onClick={() => runSearch(recent)}
                  className="rounded-full px-3 py-1 font-medium text-stone-600 transition hover:bg-white/80 hover:text-stone-950"
                >
                  {recent}
                </button>
              ))}
            </div>
          ) : null}
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-400">
              Discovery
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">{resultLabel}</h2>
          </div>
          <p className="text-sm text-stone-500">
            Showing {visibleProducts.length.toLocaleString()} thoughtfully ranked pieces
          </p>
        </div>

        <AnimatePresence mode="wait">
          {visibleProducts.length > 0 ? (
            <motion.div
              key={trimmedQuery || "featured"}
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visibleProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <EmptyState key="empty" query={trimmedQuery} onTrySearch={runSearch} />
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
