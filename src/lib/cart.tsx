import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  category: string;
  startingPrice: number | null;
  depositAmount: number;
  quantity: number;
};

const STORAGE_KEY = "hiba-cart";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

// If a product has no deposit set by the admin, default to 10% of its
// starting price (minimum ₹2,000) so checkout always has something to charge.
export function getEffectiveDeposit(
  product: Pick<Product, "startingPrice" | "depositAmount">,
): number {
  if (product.depositAmount && product.depositAmount > 0) return product.depositAmount;
  if (!product.startingPrice) return 2000;
  return Math.max(2000, Math.round((product.startingPrice * 0.1) / 100) * 100);
}

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  count: number;
  depositSubtotal: number;
  estimatedSubtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once, after mount — avoids an SSR/client mismatch
  // since localStorage doesn't exist on the server.
  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          image: product.image,
          category: product.category,
          startingPrice: product.startingPrice,
          depositAmount: getEffectiveDeposit(product),
          quantity,
        },
      ];
    });
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function setQuantity(slug: string, quantity: number) {
    if (quantity < 1) {
      removeItem(slug);
      return;
    }
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const depositSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.depositAmount * i.quantity, 0),
    [items],
  );
  const estimatedSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.startingPrice ?? 0) * i.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQuantity,
        clear,
        count,
        depositSubtotal,
        estimatedSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
