import { supabase } from "@/lib/supabase";

// Categories are no longer a fixed list — whatever text is saved on a
// product IS a category. The catalog page and admin panel both derive
// the set of categories that currently exist from live product data.
export type ProductCategory = string;

// This is the shape every component on the site expects — unchanged from before,
// so ProductCard, the shop pages, and the homepage don't need to know anything
// changed underneath them.
export type Product = {
  id?: string;
  slug: string;
  name: string;
  category: ProductCategory;
  seating: number;
  fabric: string;
  startingPrice: number | null;
  image: string;
  gallery: string[];
  tagline: string;
  description: string;
  dimensions: string;
  features: string[];
};

// Raw row shape as stored in the Supabase "products" table (snake_case).
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  seating: number | null;
  fabric: string | null;
  price_from: number | null;
  images: string[] | null;
  tagline: string | null;
  description: string | null;
  dimensions: string | null;
  features: string[] | null;
  in_stock: boolean | null;
  sort_order: number | null;
};

function rowToProduct(row: ProductRow): Product {
  const images = row.images ?? [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    seating: row.seating ?? 0,
    fabric: row.fabric ?? "",
    startingPrice: row.price_from,
    image: images[0] ?? "",
    gallery: images.length > 0 ? images : [""],
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    dimensions: row.dimensions ?? "",
    features: row.features ?? [],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToProduct(data as ProductRow);
}

// Returns every distinct category currently used by a product, sorted
// alphabetically. Used to populate the catalog filter chips and the
// admin panel's category suggestions — so a brand-new category typed
// into the admin panel shows up everywhere automatically.
export async function fetchCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("products").select("category");
  if (error) throw error;
  const unique = new Set((data as { category: string }[]).map((r) => r.category).filter(Boolean));
  return Array.from(unique).sort();
}
