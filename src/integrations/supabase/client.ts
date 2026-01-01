import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dfmgbymdehmgissohtrh.supabase.co'
const supabaseAnonKey = 'sb_publishable_-BvBRjJTBXPa5ib249071Q_rUFGRRMf'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
