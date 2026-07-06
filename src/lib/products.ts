import rawItems from "@/data/items.json";

export type Product = {
  id: number;
  title: string;
  brand: string;
  category: string;
  tags: string[];
  price: number | null;
  rating: number | null;
  reviews: number;
  inStock: boolean;
  releasedAt: string;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string | null;
};

type RawProduct = Omit<Product, "price"> & {
  price: number | string | null;
};

const parsePrice = (price: RawProduct["price"]) => {
  if (price === null || price === undefined) {
    return null;
  }

  if (typeof price === "number") {
    return Number.isFinite(price) ? price : null;
  }

  const parsed = Number(price.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const cleanTitle = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const products: Product[] = (rawItems as RawProduct[]).map((item) => ({
  ...item,
  title: cleanTitle(item.title),
  brand: item.brand.trim(),
  category: item.category.trim(),
  tags: item.tags.map((tag) => tag.trim().toLowerCase()),
  price: parsePrice(item.price),
  description: item.description?.trim() ?? null,
}));

export const featuredProducts = [...products]
  .sort((a, b) => {
    const ratingDelta = (b.rating ?? 0) - (a.rating ?? 0);
    if (ratingDelta !== 0) {
      return ratingDelta;
    }

    return Date.parse(b.releasedAt) - Date.parse(a.releasedAt);
  })
  .slice(0, 72);
