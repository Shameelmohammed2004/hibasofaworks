import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchCategories, type ProductCategory } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/admin/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin — Hiba Sofa Works" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

// Raw row shape as stored in Supabase — mirrors src/data/products.ts
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  seating: number | null;
  fabric: string | null;
  price_from: number | null;
  compare_at_price: number | null;
  deposit_amount: number | null;
  images: string[] | null;
  tagline: string | null;
  description: string | null;
  dimensions: string | null;
  features: string[] | null;
  in_stock: boolean | null;
  sort_order: number | null;
};

type FormState = {
  id: string | undefined;
  slug: string;
  name: string;
  category: ProductCategory;
  seating: number;
  fabric: string;
  price_from: number;
  compare_at_price: number;
  deposit_amount: number;
  tagline: string;
  description: string;
  dimensions: string;
  features: string; // one per line in the textarea, split into an array on save
  images: string[];
  in_stock: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  id: undefined,
  slug: "",
  name: "",
  category: "",
  seating: 3,
  fabric: "",
  price_from: 0,
  compare_at_price: 0,
  deposit_amount: 0,
  tagline: "",
  description: "",
  dimensions: "",
  features: "",
  images: [],
  in_stock: true,
  sort_order: 0,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchRows(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as ProductRow[];
}

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchRows,
  });
  const { data: existingCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...emptyForm, sort_order: rows.length });
    setOpen(true);
  }

  function openEdit(row: ProductRow) {
    setForm({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category as ProductCategory,
      seating: row.seating ?? 0,
      fabric: row.fabric ?? "",
      price_from: row.price_from ?? 0,
      compare_at_price: row.compare_at_price ?? 0,
      deposit_amount: row.deposit_amount ?? 0,
      tagline: row.tagline ?? "",
      description: row.description ?? "",
      dimensions: row.dimensions ?? "",
      features: (row.features ?? []).join("\n"),
      images: row.images ?? [],
      in_stock: row.in_stock ?? true,
      sort_order: row.sort_order ?? 0,
    });
    setOpen(true);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("product-photos").upload(path, file);
      if (error) {
        alert(`Upload failed for ${file.name}: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from("product-photos").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      slug: form.slug.trim() || slugify(form.name),
      name: form.name,
      category: form.category,
      seating: form.seating,
      fabric: form.fabric,
      price_from: form.price_from,
      compare_at_price: form.compare_at_price || null,
      deposit_amount: form.deposit_amount || null,
      tagline: form.tagline,
      description: form.description,
      dimensions: form.dimensions,
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      images: form.images,
      in_stock: form.in_stock,
      sort_order: form.sort_order,
    };

    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (error) {
      alert(`Save failed: ${error.message}`);
      return;
    }
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  async function handleDelete(row: ProductRow) {
    if (!confirm(`Delete "${row.name}"? This can't be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", row.id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="container-hiba py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-3xl">Manage products</h1>
        </div>
                <div className="flex gap-2">
         <Button onClick={openNew}>Add product</Button>
<Button asChild variant="outline">
  <Link to="/admin/reviews">Manage reviews</Link>
</Button>
<Button asChild variant="outline">
  <Link to="/admin/our-work">Manage our work</Link>
</Button>
<Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No products yet. Click "Add product" to create your first one.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.images?.[0] ? (
                    <img
                      src={row.images[0]}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-secondary" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  {row.price_from ? `₹${row.price_from.toLocaleString("en-IN")}` : "—"}
                </TableCell>
                <TableCell>{row.in_stock ? "Visible" : "Hidden"}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(row)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>URL slug (leave blank to auto-generate)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder={slugify(form.name) || "e.g. ivory-linen-3seater"}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Category</Label>
                <Input
                  list="category-suggestions"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. 3-Seater, or type a brand new category"
                />
                <datalist id="category-suggestions">
                  {existingCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label>Starting price (₹)</Label>
                <Input
                  type="number"
                  value={form.price_from}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price_from: Number(e.target.value) }))
                  }
                />
              </div>
                           <div>
                <Label>Seating</Label>
                <Input
                  type="number"
                  value={form.seating}
                  onChange={(e) => setForm((f) => ({ ...f, seating: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <Label>Regular price (₹) — optional, shows a strikethrough discount</Label>
              <Input
                type="number"
                value={form.compare_at_price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, compare_at_price: Number(e.target.value) }))
                }
                placeholder="Leave as 0 to hide the discount badge"
              />
            </div>

            <div>
              <Label>Booking deposit (₹) — optional</Label>
              <Input
                type="number"
                value={form.deposit_amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, deposit_amount: Number(e.target.value) }))
                }
                placeholder="Leave as 0 to auto-default to 10% of starting price"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                This is what customers actually pay at checkout to reserve this piece — not the
                full price. The rest is settled with you directly after the final quote.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Fabric</Label>
                <Input
                  value={form.fabric}
                  onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
                />
              </div>
              <div>
                <Label>Dimensions</Label>
                <Input
                  value={form.dimensions}
                  onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))}
                  placeholder="e.g. 72 in W × 34 in D × 32 in H"
                />
              </div>
            </div>

            <div>
              <Label>Tagline (short — shows on the catalog card)</Label>
              <Input
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                rows={4}
                value={form.features}
                onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
              />
            </div>

            <div>
              <Label>Photos (first photo is the main catalog image)</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                disabled={uploading}
              />
              {uploading && (
                <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {form.images.map((url) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="h-16 w-16 rounded-lg border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="in_stock"
                type="checkbox"
                checked={form.in_stock}
                onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))}
              />
              <Label htmlFor="in_stock">Visible on the site</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.name}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
