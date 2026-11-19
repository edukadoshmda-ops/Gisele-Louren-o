const fs = require("fs");
const path = require("path");

const LOCAL_DATA_DIR = path.join(__dirname, "..", "data");
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, "db.json");

function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_URL.startsWith("http")
  );
}

function getSupabaseHeaders(extra = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra
  };
}

/**
 * Carrega o banco de dados:
 * 1. Se SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estiverem configurados, lê da tabela `clube_state`.
 * 2. Caso contrário, lê/cria o arquivo local `data/db.json`.
 */
async function loadDatabase(initialData) {
  if (isSupabaseConfigured()) {
    try {
      const baseUrl = process.env.SUPABASE_URL.replace(/\/+$/, "");
      const res = await fetch(`${baseUrl}/rest/v1/clube_state?id=eq.main&select=data`, {
        headers: getSupabaseHeaders()
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
          return mergeWithDefaults(rows[0].data, initialData);
        }
        // Semeia o Supabase na primeira execução
        const seeded = JSON.parse(JSON.stringify(initialData));
        await saveDatabase(seeded);
        return seeded;
      }
      console.warn("Aviso Supabase REST (fallback para memória/local):", res.status);
    } catch (err) {
      console.warn("Erro ao conectar no Supabase (usando fallback):", err.message);
    }
  }

  // Fallback local em disco (data/db.json)
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const raw = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return mergeWithDefaults(parsed, initialData);
    }
    const seeded = JSON.parse(JSON.stringify(initialData));
    await saveDatabase(seeded);
    return seeded;
  } catch (err) {
    console.warn("Usando estado inicial em memória:", err.message);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function mergeWithDefaults(saved, initialData) {
  const merged = { ...JSON.parse(JSON.stringify(initialData)), ...saved };
  // Sempre mantém dados institucionais mais recentes do authorProfile se não editados manualmente
  merged.authorProfile = { ...initialData.authorProfile, ...(saved.authorProfile || {}) };
  return merged;
}

/**
 * Persiste o estado completo no Supabase ou no arquivo local data/db.json.
 */
async function saveDatabase(db) {
  if (isSupabaseConfigured()) {
    try {
      const baseUrl = process.env.SUPABASE_URL.replace(/\/+$/, "");
      const res = await fetch(`${baseUrl}/rest/v1/clube_state?on_conflict=id`, {
        method: "POST",
        headers: getSupabaseHeaders({
          Prefer: "resolution=merge-duplicates,return=minimal"
        }),
        body: JSON.stringify({
          id: "main",
          data: db,
          updated_at: new Date().toISOString()
        })
      });
      if (!res.ok) {
        const txt = await res.text();
        console.warn("Erro ao salvar no Supabase:", res.status, txt);
      }
      return;
    } catch (err) {
      console.warn("Falha ao persistir no Supabase:", err.message);
    }
  }

  // Em ambiente Serverless read-only (Vercel/Netlify sem Supabase), ignora escrita em disco
  if (process.env.VERCEL || process.env.NETLIFY) return;

  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.warn("Não foi possível salvar data/db.json:", err.message);
  }
}

/**
 * Faz upload de mídia (MP3, MP4, PDF, Imagens) para o Supabase Storage (bucket público `clube-media`).
 */
async function uploadToSupabaseStorage(buffer, savedFileName, contentType) {
  if (!isSupabaseConfigured()) return null;
  const baseUrl = process.env.SUPABASE_URL.replace(/\/+$/, "");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "clube-media";
  const uploadUrl = `${baseUrl}/storage/v1/object/${bucket}/${encodeURIComponent(savedFileName)}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": contentType || "application/octet-stream",
      "x-upsert": "true"
    },
    body: buffer
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Falha no Supabase Storage (${res.status}): ${errText}`);
  }

  return `${baseUrl}/storage/v1/object/public/${bucket}/${encodeURIComponent(savedFileName)}`;
}

module.exports = {
  isSupabaseConfigured,
  loadDatabase,
  saveDatabase,
  uploadToSupabaseStorage
};
