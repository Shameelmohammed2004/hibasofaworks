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

export const Route = createFileRoute("/admin_/our-work")({
  head: () => ({
    meta: [
      { title: "Manage our work — Hiba Sofa Works" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OurWorkDashboard,
});

type WorkRow = {
  id: string;
  title: string;
  description: string | null;
  before_url: string;
  after_url: string;
  visible: boolean | null;
  sort_order: number | null;
};

type FormState = {
  id: string | undefined;
  title: string;
  description: string;
  before_url: string;
  after_url: string;
  visible: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  id: undefined,
  title: "",
  description: "",
  before_url: "",
  after_url: "",
  visible: true,
  sort_order: 0,
};

async function fetchRows(): Promise<WorkRow[]> {
  const { data, error } = await supabase
    .from("our_work")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as WorkRow[];
}

function OurWorkDashboard() {
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-our-work"],
    queryFn: fetchRows,
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...emptyForm, sort_order: rows.length });
    setOpen(true);
  }

  function openEdit(row: WorkRow) {
    setForm({
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      before_url: row.before_url,
      after_url: row.after_url,
      visible: row.visible ?? true,
      sort_order: row.sort_order ?? 0,
    });
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      before_url: form.before_url,
      after_url: form.after_url,
      visible: form.visible,
      sort_order: form.sort_order,
    };

    const { error } = form.id
      ? await supabase.from("our_work").update(payload).eq("id", form.id)
      : await supabase.from("our_work").insert(payload);

    setSaving(false);
    if (error) {
      alert(`Save failed: ${error.message}`);
      return;
    }
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-our-work"] });
    queryClient.invalidateQueries({ queryKey: ["our-work"] });
  }

  async function handleDelete(row: WorkRow) {
    if (!confirm(`Delete the project "${row.title}"? This can't be undone.`))
      return;
    const { error } = await supabase.from("our_work").delete().eq("id", row.id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-our-work"] });
    queryClient.invalidateQueries({ queryKey: ["our-work"] });
  }

  return (
    <div className="container-hiba py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-3xl">Manage our work</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNew}>Add project</Button>
          <Button asChild variant="outline">
            <Link to="/admin">← Back to products</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Before</TableHead>
              <TableHead>After</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No projects yet. Click "Add project" to add your first
                  before-and-after.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.before_url ? (
                    <img
                      src={row.before_url}
                      alt=""
                      className="h-12 w-16 rounded object-cover"
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {row.after_url ? (
                    <img
                      src={row.after_url}
                      alt=""
                      className="h-12 w-16 rounded object-cover"
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {row.description}
                </TableCell>
                <TableCell>{row.visible ? "Visible" : "Hidden"}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(row)}
                  >
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
            <DialogTitle>
              {form.id ? "Edit project" : "Add project"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div>
              <Label>Project title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Recliner set — Indiranagar"
              />
            </div>

            <div>
              <Label>Short description (optional)</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="e.g. Full frame rebuild and re-cover in rust boucle."
              />
            </div>

            <div>
              <Label>Before photo URL</Label>
              <Input
                value={form.before_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, before_url: e.target.value }))
                }
                placeholder="https://…"
              />
              {form.before_url && (
                <img
                  src={form.before_url}
                  alt=""
                  className="mt-2 h-24 w-full rounded object-cover"
                />
              )}
            </div>

            <div>
              <Label>After photo URL</Label>
              <Input
                value={form.after_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, after_url: e.target.value }))
                }
                placeholder="https://…"
              />
              {form.after_url && (
                <img
                  src={form.after_url}
                  alt=""
                  className="mt-2 h-24 w-full rounded object-cover"
                />
              )}
            </div>

            <div>
              <Label>Sort order</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="visible"
                type="checkbox"
                checked={form.visible}
                onChange={(e) =>
                  setForm((f) => ({ ...f, visible: e.target.checked }))
                }
              />
              <Label htmlFor="visible">Visible on the site</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                saving || !form.title || !form.before_url || !form.after_url
              }
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
