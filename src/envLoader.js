const fs = require("fs");
const path = require("path");

/**
 * Carrega variáveis de ambiente do arquivo .env (se existir) sem depender de pacotes externos.
 */
function loadEnvFile(rootDir = path.join(__dirname, "..")) {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) return;

  try {
    const content = fs.readFileSync(envPath, "utf-8");
    const lines = content.split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIdx = line.indexOf("=");
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch (err) {
    console.warn("Aviso ao ler .env:", err.message);
  }
}

module.exports = { loadEnvFile };
