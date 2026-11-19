const { Readable } = require("stream");
const { handleRequest } = require("../../src/appHandler");

exports.handler = async (event) => {
  const query = event.rawQuery ? `?${event.rawQuery}` : "";
  const req = Readable.from(
    event.body
      ? [event.isBase64Encoded ? Buffer.from(event.body, "base64") : Buffer.from(event.body)]
      : []
  );
  req.url = `${event.path}${query}`;
  req.method = event.httpMethod;
  req.headers = event.headers || {};
  if (event.body) {
    req.rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body, "utf-8");
  }

  return new Promise((resolve) => {
    const chunks = [];
    let statusCode = 200;
    let headers = {};

    const res = {
      writeHead(code, hdrs = {}) {
        statusCode = code;
        headers = { ...headers, ...hdrs };
      },
      write(chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      },
      end(chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const bodyBuf = Buffer.concat(chunks);
        resolve({
          statusCode,
          headers,
          body: bodyBuf.toString("utf-8")
        });
      }
    };

    handleRequest(req, res);
  });
};
