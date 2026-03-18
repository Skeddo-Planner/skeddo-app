import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kjlsnlzcammvbdbqpiwp.supabase.co";
const supabaseAnonKey = "sb_publishable_hX7ySanhuSroJPE6Wq7Xog_sgv2Kwi0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
