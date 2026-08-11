import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://jmqnyaemtviwitgxyadm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_BI7D7g0r81w2vm3gyJAmMw_pwMoi5f6";

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
