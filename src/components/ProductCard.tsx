"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
  const [imageFailed, setImageFailed] = useState(false);
  const price = product.price === null ? "Price on request" : currency.format(product.price);
  const hasRating = product.rating !== null && product.reviews > 0;
  const imageUrl = product.image && !imageFailed ? product.image : null;
  const categoryInitials = product.category
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[28px] border border-stone-200/75 bg-white/82 shadow-[0_20px_60px_rgba(64,54,43,0.08)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 will-change-transform hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(64,54,43,0.14)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#f8f5ef,#ebe7df)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.removeAttribute("src");
              setImageFailed(true);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_35%_22%,rgba(255,255,255,0.92),transparent_32%),linear-gradient(135deg,#efe9df,#d8d0c3_54%,#bfc9bf)]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-white/55 text-3xl font-semibold text-stone-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_20px_60px_rgba(64,54,43,0.12)] backdrop-blur-xl">
              {categoryInitials}
            </div>
          </div>
        )}
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
              {product.rating?.toFixed(1)} stars / {product.reviews.toLocaleString()}
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
