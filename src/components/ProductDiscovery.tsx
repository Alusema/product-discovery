"use client";

import Fuse from "fuse.js";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { products, type Product } from "@/lib/products";

const suggestionChips = ["Oak", "Marble", "Storage", "Kitchen", "Minimal", "Outdoor"];
const initialVisibleCount = 96;
const visibleCountStep = 48;
const recentSearchLimit = 5;
const recentSearchKey = "haven-recent-searches";
const allCategoriesLabel = "All categories";

type StockFilter = "all" | "in" | "out";

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
  const [categoryFilter, setCategoryFilter] = useState(allCategoriesLabel);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const trimmedQuery = query.trim();

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

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [categoryFilter, stockFilter, trimmedQuery]);

  const categories = useMemo(
    () => [
      allCategoriesLabel,
      ...Array.from(new Set(products.map((product) => product.category))).sort(),
    ],
    [],
  );

  const browseProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const ratingDelta = (b.rating ?? 0) - (a.rating ?? 0);
        if (ratingDelta !== 0) {
          return ratingDelta;
        }

        return Date.parse(b.releasedAt) - Date.parse(a.releasedAt);
      }),
    [],
  );

  const rankedProducts = useMemo(() => {
    if (!trimmedQuery) {
      return browseProducts;
    }

    return fuse.search(trimmedQuery).map((result) => result.item);
  }, [browseProducts, trimmedQuery]);

  const filteredProducts = useMemo(
    () =>
      rankedProducts.filter((product) => {
        const categoryMatches =
          categoryFilter === allCategoriesLabel || product.category === categoryFilter;
        const stockMatches =
          stockFilter === "all" ||
          (stockFilter === "in" && product.inStock) ||
          (stockFilter === "out" && !product.inStock);

        return categoryMatches && stockMatches;
      }),
    [categoryFilter, rankedProducts, stockFilter],
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const resultCount = filteredProducts.length;
  const remainingCount = Math.max(resultCount - visibleProducts.length, 0);
  const hasActiveFilters = categoryFilter !== allCategoriesLabel || stockFilter !== "all";
  const resultLabel = trimmedQuery
    ? `${resultCount.toLocaleString()} matches for "${trimmedQuery}"`
    : `${resultCount.toLocaleString()} pieces in the catalog`;

  const runSearch = (nextQuery: string) => {
    setQuery(nextQuery);
  };

  const resetFilters = () => {
    setCategoryFilter(allCategoriesLabel);
    setStockFilter("all");
  };

  const showMore = () => {
    setVisibleCount((current) => current + visibleCountStep);
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

      <section className="mx-auto w-full max-w-[1800px] px-4 pb-20 sm:px-6 lg:px-10 2xl:px-12">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
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

        <div className="mb-8 flex flex-col gap-3 rounded-[26px] border border-white/80 bg-white/68 p-3 shadow-[0_18px_70px_rgba(64,54,43,0.08)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:flex lg:items-center">
            <label className="flex min-h-12 items-center gap-3 rounded-[18px] border border-stone-200/80 bg-white px-4 shadow-sm">
              <span className="text-sm font-medium text-stone-500">Category</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-stone-950 outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-3 rounded-[18px] border border-stone-200/80 bg-stone-100/75 p-1 text-sm font-semibold text-stone-500 shadow-sm">
              {[
                { label: "All", value: "all" },
                { label: "In stock", value: "in" },
                { label: "Out", value: "out" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStockFilter(option.value as StockFilter)}
                  className={`h-10 rounded-[14px] px-4 transition ${
                    stockFilter === option.value
                      ? "bg-white text-stone-950 shadow-sm"
                      : "hover:text-stone-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-600 shadow-sm transition hover:border-stone-300 hover:text-stone-950"
            >
              Reset filters
            </button>
          ) : (
            <p className="px-2 text-sm text-stone-500">
              Refine without interrupting the search flow.
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {visibleProducts.length > 0 ? (
            <motion.div key={`${trimmedQuery || "browse"}-${categoryFilter}-${stockFilter}`}>
              <motion.div
                layout
                className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-5 2xl:grid-cols-[repeat(auto-fit,minmax(285px,1fr))]"
              >
                {visibleProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-[30px] border border-white/80 bg-white/62 px-6 py-8 text-center shadow-[0_18px_70px_rgba(64,54,43,0.08)] backdrop-blur-xl">
                {remainingCount > 0 ? (
                  <>
                    <p className="text-sm text-stone-500">
                      Showing {visibleProducts.length.toLocaleString()} of{" "}
                      {resultCount.toLocaleString()} matching pieces
                    </p>
                    <button
                      type="button"
                      onClick={showMore}
                      className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(45,39,32,0.22)] transition hover:-translate-y-0.5 hover:bg-stone-800"
                    >
                      Show {Math.min(visibleCountStep, remainingCount).toLocaleString()} more
                    </button>
                  </>
                ) : (
                  <p className="text-sm font-medium text-stone-500">
                    You have reached the end of this refined set.
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <EmptyState key="empty" query={trimmedQuery} onTrySearch={runSearch} />
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
