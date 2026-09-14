import { supabase } from "@/lib/supabase";

export type Review = {
  id?: string;
  authorName: string;
  city: string;
  rating: number;
  text: string;
};

type ReviewRow = {
  id: string;
  author_name: string;
  city: string | null;
  rating: number;
  review_text: string;
  visible: boolean | null;
  sort_order: number | null;
};

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    authorName: row.author_name,
    city: row.city ?? "",
    rating: row.rating,
    text: row.review_text,
  };
}

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ReviewRow[]).map(rowToReview);
}