"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = product.price === null ? "Price on request" : currency.format(product.price);
  const hasRating = product.rating !== null && product.reviews > 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[28px] border border-stone-200/75 bg-white/82 shadow-[0_20px_60px_rgba(64,54,43,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(64,54,43,0.14)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#f8f5ef,#ebe7df)]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_38%)]" />
        <span
          className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-xl ${
            product.inStock
              ? "border-emerald-200 bg-emerald-50/90 text-emerald-800"
              : "border-stone-200 bg-stone-50/90 text-stone-600"
          }`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
            <span className="truncate">{product.brand}</span>
            <span className="shrink-0">{product.category}</span>
          </div>
          <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-tight text-stone-950">
            {product.title}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="text-xl font-semibold text-stone-950">{price}</p>
          {hasRating ? (
            <p className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700">
              {product.rating?.toFixed(1)} stars · {product.reviews.toLocaleString()}
            </p>
          ) : (
            <p className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-500">
              New
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
