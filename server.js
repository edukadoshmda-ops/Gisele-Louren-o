const http = require("http");
const { loadEnvFile } = require("./src/envLoader");

loadEnvFile(__dirname);

const { handleRequest } = require("./src/appHandler");
const { isSupabaseConfigured } = require("./src/dbRepository");

const PORT = process.env.PORT || 3000;
const server = http.createServer(handleRequest);

process.on("uncaughtException", (err) => {
  console.error("Erro tratado:", err.message);
});
process.on("unhandledRejection", (err) => {
  console.error("Promise rejeitada tratada:", err?.message || err);
});

server.listen(PORT, () => {
  console.log(`\n==================================================================`);
  console.log(`🚀 Plataforma SaaS Gisele Lourenço & Clube DaviLiz (Asaas Ready)`);
  console.log(`🌐 Acesse no navegador: http://localhost:${PORT}`);
  console.log(`💾 Persistência: ${isSupabaseConfigured() ? "Supabase Cloud" : "Local JSON (data/db.json)"}`);
  console.log(`==================================================================\n`);
});
