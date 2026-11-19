const crypto = require("crypto");

const SESSION_SECRET =
  process.env.SESSION_SECRET || "clube_gisele_daviliz_jwt_secret_2026_trocar_em_producao";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "edukadoshmda@gmal.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";
const SUPER_ADMIN_EMAIL = "edukadoshmda@gmal.com";
const SUPER_ADMIN_PASSWORD = "123456";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, key] = storedHash.split(":");
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derived, "hex"));
}

function signToken(payload) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  if (sig.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function getTokenFromRequest(req) {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }
  const cookieHeader = req.headers["cookie"] || "";
  const match = cookieHeader.match(/(?:^|;\s*)clube_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getSessionUser(req) {
  const token = getTokenFromRequest(req);
  return verifyToken(token);
}

function isAdminEmail(email) {
  const clean = String(email || "").trim().toLowerCase();
  return clean === ADMIN_EMAIL || clean === SUPER_ADMIN_EMAIL;
}

function verifyAdminCredentials(email, password) {
  const clean = String(email || "").trim().toLowerCase();
  const pwd = String(password || "");
  return (
    (clean === SUPER_ADMIN_EMAIL && pwd === SUPER_ADMIN_PASSWORD) ||
    (clean === ADMIN_EMAIL && pwd === ADMIN_PASSWORD)
  );
}

module.exports = {
  ADMIN_EMAIL,
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  getSessionUser,
  isAdminEmail,
  verifyAdminCredentials
};
