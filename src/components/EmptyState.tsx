"use client";

import { motion } from "framer-motion";

type EmptyStateProps = {
  query: string;
  onTrySearch: (query: string) => void;
};

const alternatives = ["oak", "storage", "linen", "lighting"];

export function EmptyState({ query, onTrySearch }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl rounded-[32px] border border-stone-200/80 bg-white/80 p-8 text-center shadow-[0_20px_70px_rgba(64,54,43,0.08)] backdrop-blur-xl"
    >
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone-400">
        Nothing matched exactly
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-stone-950">
        Try widening the material, room, or style.
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-balance text-sm leading-6 text-stone-600">
        We could not find a strong match for "{query}". The catalog responds best to
        material words, room names, and simple style cues.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {alternatives.map((alternative) => (
          <button
            key={alternative}
            type="button"
            onClick={() => onTrySearch(alternative)}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:text-stone-950"
          >
            {alternative}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
