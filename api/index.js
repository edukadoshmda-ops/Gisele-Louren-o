const { handleRequest } = require("../src/appHandler");

module.exports = async (req, res) => {
  try {
    const parsed = new URL(req.url, "http://localhost");
    if (parsed.searchParams.has("__path")) {
      const apiPath = parsed.searchParams.get("__path") || "";
      parsed.searchParams.delete("__path");
      const qs = parsed.searchParams.toString();
      req.url = `/api/${apiPath}${qs ? `?${qs}` : ""}`;
    }
  } catch (_) {}

  return handleRequest(req, res);
};
