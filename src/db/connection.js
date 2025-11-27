import { createClient } from "@supabase/supabase-js";
import config from "../config.js";

const supabaseUrl = config.DATA_BASE_URL || "";
const supabaseKey = config.DATA_BASE_TOKEN || "";

if (supabaseUrl === "" || supabaseKey === "") {
  console.error(
    "Supabase: faltan variables de entorno. Verifique SUPABASE_URL y SUPABASE_KEY en su .env"
  );
  throw new Error("Configuración de Supabase incompleta");
}

if (!supabaseUrl.startsWith("http")) {
  console.error(
    `Supabase: URL inválida (${supabaseUrl}). Debe comenzar con http(s)://`
  );
  throw new Error("SUPABASE_URL inválida");
}

export const clientSupabase = createClient(supabaseUrl, supabaseKey);
