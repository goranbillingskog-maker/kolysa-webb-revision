import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { marked } from "marked";
import type { Database } from "@/integrations/supabase/types";

function createPublishableClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Saknar Supabase-konfiguration");
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function isFullHtmlDocument(content: string): boolean {
  const trimmed = content.trim().toLowerCase();
  return trimmed.startsWith("<!doctype") || trimmed.startsWith("<html");
}

function renderContent(content: string): string {
  if (!content.trim()) return "";
  if (isFullHtmlDocument(content)) return content;
  return marked.parse(content, { gfm: true }) as string;
}

export type ReportFormat = "html" | "markdown" | "empty";

export type ReportContent = {
  content: string;
  html: string;
  format: ReportFormat;
  updated_at: string | null;
};

function detectFormat(content: string): ReportFormat {
  if (!content.trim()) return "empty";
  return isFullHtmlDocument(content) ? "html" : "markdown";
}

export const getReportContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<ReportContent> => {
    const supabase = createPublishableClient();
    const { data } = await supabase
      .from("report_content")
      .select("content, updated_at")
      .eq("id", 1)
      .maybeSingle();

    const content = data?.content ?? "";
    return {
      content,
      html: renderContent(content),
      format: detectFormat(content),
      updated_at: data?.updated_at ?? null,
    };
  },
);

const saveSchema = z.object({
  content: z.string().max(200000),
});

export const saveReportContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => saveSchema.parse(d))
  .handler(async ({ data, context }): Promise<ReportContent> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Åtkomst nekad");

    const { data: row, error } = await context.supabase
      .from("report_content")
      .upsert({ id: 1, content: data.content })
      .select("content, updated_at")
      .single();

    if (error) throw new Error(error.message);

    return {
      content: row.content,
      html: renderContent(row.content),
      format: detectFormat(row.content),
      updated_at: row.updated_at,
    };
  });
