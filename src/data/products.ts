import corner from "@/assets/product-corner.jpg";
import threeSeater from "@/assets/product-3seater.jpg";
import set from "@/assets/product-set.jpg";
import lounge from "@/assets/product-lounge.jpg";
import three_two from "@/assets/product-32.jpg";

export type ProductCategory =
  | "3-Seater"
  | "Corner Sofa"
  | "3+1+1 Set"
  | "3+2 Set"
  | "Lounge Sofa";

export type Product = {
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

export const products: Product[] = [
  {
    slug: "ivory-linen-3seater",
    name: "Ivory Linen 3-Seater",
    category: "3-Seater",
    seating: 3,
    fabric: "Premium Linen",
    startingPrice: 32000,
    image: threeSeater,
    gallery: [threeSeater, set, lounge],
    tagline: "A quiet centrepiece for the modern home.",
    description:
      "Hand-built on a seasoned hardwood frame with high-density foam, wrapped in soft yet durable linen. Made-to-measure so it fits your room, not the other way around.",
    dimensions: "72 in W × 34 in D × 32 in H (customisable)",
    features: [
      "Seasoned hardwood frame",
      "35-density HR foam seats",
      "Removable, washable covers",
      "Choice of 40+ fabric swatches",
    ],
  },
  {
    slug: "kodava-corner-sofa",
    name: "Kodava Corner Sofa",
    category: "Corner Sofa",
    seating: 5,
    fabric: "Textured Weave",
    startingPrice: 58000,
    image: corner,
    gallery: [corner, three_two, set],
    tagline: "Turn the corner into the best seat in the room.",
    description:
      "An L-shaped anchor for larger living rooms. Sized to your wall — left or right chaise — with an optional storage base.",
    dimensions: "108 in × 76 in × 33 in (customisable)",
    features: [
      "Left or right chaise",
      "Optional under-seat storage",
      "Reinforced corner joinery",
      "Pan-India delivery included",
    ],
  },
  {
    slug: "heritage-311-set",
    name: "Heritage 3+1+1 Set",
    category: "3+1+1 Set",
    seating: 5,
    fabric: "Cotton Blend",
    startingPrice: 74000,
    image: set,
    gallery: [set, threeSeater, three_two],
    tagline: "A complete living room, made by hand.",
    description:
      "Our signature configuration — a three-seater with two matching single chairs. Espresso hardwood frame, clean lines, weightless silhouettes.",
    dimensions: "3-Seater 72 in + two 34 in chairs",
    features: [
      "Solid espresso hardwood frame",
      "Matched grain across pieces",
      "Firm or medium seat option",
      "10-year frame warranty",
    ],
  },
  {
    slug: "workshop-32-set",
    name: "Workshop 3+2 Set",
    category: "3+2 Set",
    seating: 5,
    fabric: "Mocha Weave",
    startingPrice: 62000,
    image: three_two,
    gallery: [three_two, threeSeater, corner],
    tagline: "The everyday classic, made better.",
    description:
      "A 3-seater and a 2-seater, tuned for Indian apartments. Deep seats, low back, easy to reupholster years down the line.",
    dimensions: "3-Seater 72 in + 2-Seater 54 in",
    features: [
      "Apartment-friendly footprint",
      "Deep 24 in seats",
      "Easy re-cover in 5 years",
      "Free fabric consultation",
    ],
  },
  {
    slug: "olive-lounge-chaise",
    name: "Olive Lounge Chaise",
    category: "Lounge Sofa",
    seating: 3,
    fabric: "Olive Boucle",
    startingPrice: 46000,
    image: lounge,
    gallery: [lounge, threeSeater, set],
    tagline: "For the long Sunday afternoon.",
    description:
      "Lower, deeper, calmer. A statement lounge in muted olive boucle with a matching footrest, made to your preferred firmness.",
    dimensions: "84 in W × 38 in D × 30 in H",
    features: [
      "Matching ottoman included",
      "Solid teak legs",
      "Reversible seat cushions",
      "Custom firmness levels",
    ],
  },
  {
    slug: "terracotta-velvet-loveseat",
    name: "Terracotta Velvet Loveseat",
    category: "3-Seater",
    seating: 2,
    fabric: "Cotton Velvet",
    startingPrice: 28000,
    image: threeSeater,
    gallery: [threeSeater, lounge, set],
    tagline: "A pop of colour, held with restraint.",
    description:
      "A compact loveseat wrapped in warm terracotta velvet. Perfect for reading nooks, bay windows, and small living rooms.",
    dimensions: "58 in W × 32 in D × 32 in H",
    features: [
      "Compact footprint",
      "Turned solid wood legs",
      "Piped cushion detailing",
      "20+ velvet shade options",
    ],
  },
];

export const categories: ProductCategory[] = [
  "3-Seater",
  "Corner Sofa",
  "3+1+1 Set",
  "3+2 Set",
  "Lounge Sofa",
];
