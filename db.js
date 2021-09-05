import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SP_URL,
  process.env.NEXT_PUBLIC_SP_KEY
);
