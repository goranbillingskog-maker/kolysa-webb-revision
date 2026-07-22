import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  computeLadderStatus,
  type LadderStatus,
} from "./ladder-config";

// Publik läsning av kampanjstatus. Ingen inloggning krävs — sidan visar
// samma sak för alla besökare (och sökrobotar). RLS tillåter select på
// ladder_state för anon.
export const getLadderStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<LadderStatus> => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      // Faller tillbaka till "kampanjen slut" om något är trasigt så att
      // sajten aldrig kraschar på ordinarie pris.
      return computeLadderStatus(Number.MAX_SAFE_INTEGER);
    }

    const isNewKey =
      key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");
    const supabase = createClient<Database>(url, key, {
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (isNewKey && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data, error } = await supabase
      .from("ladder_state")
      .select("orders_count")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return computeLadderStatus(0);
    }
    return computeLadderStatus(data.orders_count);
  },
);
