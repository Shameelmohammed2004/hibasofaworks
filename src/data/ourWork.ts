import { supabase } from "@/lib/supabase";

export type WorkProject = {
  id?: string;
  title: string;
  description: string;
  beforeUrl: string;
  afterUrl: string;
};

type WorkRow = {
  id: string;
  title: string;
  description: string | null;
  before_url: string;
  after_url: string;
  visible: boolean | null;
  sort_order: number | null;
};

function rowToProject(row: WorkRow): WorkProject {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    beforeUrl: row.before_url,
    afterUrl: row.after_url,
  };
}

export async function fetchWorkProjects(): Promise<WorkProject[]> {
  const { data, error } = await supabase
    .from("our_work")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as WorkRow[]).map(rowToProject);
}
