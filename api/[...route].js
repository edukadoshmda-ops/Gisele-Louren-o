const { handleRequest } = require("../src/appHandler");

module.exports = async (req, res) => {
  if (req.query && req.query.route) {
    const segments = Array.isArray(req.query.route) ? req.query.route : [req.query.route];
    const joined = segments.join("/");
    if (!req.url.startsWith(`/api/${joined}`)) {
      const qIndex = req.url.indexOf("?");
      const qs = qIndex !== -1 ? req.url.slice(qIndex) : "";
      req.url = `/api/${joined}${qs}`;
    }
  }
  return handleRequest(req, res);
};
