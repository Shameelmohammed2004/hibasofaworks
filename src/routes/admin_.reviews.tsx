import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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

export const Route = createFileRoute("/admin_/reviews")({
  head: () => ({
    meta: [
      { title: "Manage reviews — Hiba Sofa Works" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReviewsDashboard,
});

type ReviewRow = {
  id: string;
  author_name: string;
  city: string | null;
  rating: number;
  review_text: string;
  visible: boolean | null;
  sort_order: number | null;
};

type FormState = {
  id: string | undefined;
  author_name: string;
  city: string;
  rating: number;
  review_text: string;
  visible: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  id: undefined,
  author_name: "",
  city: "",
  rating: 5,
  review_text: "",
  visible: true,
  sort_order: 0,
};

async function fetchRows(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as ReviewRow[];
}

function ReviewsDashboard() {
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: fetchRows,
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...emptyForm, sort_order: rows.length });
    setOpen(true);
  }

  function openEdit(row: ReviewRow) {
    setForm({
      id: row.id,
      author_name: row.author_name,
      city: row.city ?? "",
      rating: row.rating,
      review_text: row.review_text,
      visible: row.visible ?? true,
      sort_order: row.sort_order ?? 0,
    });
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      author_name: form.author_name,
      city: form.city,
      rating: form.rating,
      review_text: form.review_text,
      visible: form.visible,
      sort_order: form.sort_order,
    };

    const { error } = form.id
      ? await supabase.from("reviews").update(payload).eq("id", form.id)
      : await supabase.from("reviews").insert(payload);

    setSaving(false);
    if (error) {
      alert(`Save failed: ${error.message}`);
      return;
    }
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  }

  async function handleDelete(row: ReviewRow) {
    if (!confirm(`Delete this review from "${row.author_name}"? This can't be undone.`)) return;
    const { error } = await supabase.from("reviews").delete().eq("id", row.id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  }

  return (
    <div className="container-hiba py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-3xl">Manage reviews</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNew}>Add review</Button>
          <Button asChild variant="outline">
            <Link to="/admin">← Back to products</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
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
                  No reviews yet. Click "Add review" to paste in your first Google review.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.author_name}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.rating} ★</TableCell>
                <TableCell className="max-w-xs truncate">{row.review_text}</TableCell>
                <TableCell>{row.visible ? "Visible" : "Hidden"}</TableCell>
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit review" : "Add review"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Customer name</Label>
                <Input
                  value={form.author_name}
                  onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                  placeholder="e.g. Anitha R."
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. Bengaluru"
                />
              </div>
            </div>

            <div>
              <Label>Rating (1–5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: Number(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label>Review text</Label>
              <Textarea
                rows={4}
                value={form.review_text}
                onChange={(e) => setForm((f) => ({ ...f, review_text: e.target.value }))}
                placeholder="Paste the review text from Google here"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="visible"
                type="checkbox"
                checked={form.visible}
                onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
              />
              <Label htmlFor="visible">Visible on the site</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.author_name || !form.review_text}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}