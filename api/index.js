const { handleRequest } = require("../src/appHandler");

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
