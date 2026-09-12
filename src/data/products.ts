import { supabase } from "@/lib/supabase";

export type ProductCategory =
  | "3-Seater"
  | "Corner Sofa"
  | "3+1+1 Set"
  | "3+2 Set"
  | "Lounge Sofa";

export const categories: ProductCategory[] = [
  "3-Seater",
  "Corner Sofa",
  "3+1+1 Set",
  "3+2 Set",
  "Lounge Sofa",
];

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
