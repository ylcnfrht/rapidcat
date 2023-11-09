const http = require("http");

const {
  prepareResponseObject,
  processMiddleware,
  registerPath,
  isMatchingRoute,
  prepareRequestObject,
  getCallbackFnAndMiddlewares,
} = require("./utils");

let server;
const routeTable = {};
let parseMethod = 'json';

function createServer() {
  server = http.createServer(async (req, res) => {
    let match = false;

    for (const route of Object.keys(routeTable)) {
      if (isMatchingRoute({ req, routeTable, route })) {

        const {
          prevMiddleware, callbackFn, nextMiddleware
        } = getCallbackFnAndMiddlewares({ req, routeTable, route });

        await prepareRequestObject(req, route, parseMethod);

        res = await prepareResponseObject(res);

        const prevMiddlewareResult = await processMiddleware(req, res, prevMiddleware);

        if (prevMiddlewareResult) callbackFn(req, res);

        await processMiddleware(req, res, nextMiddleware);

        match = true;
        break;
      }
    }

    if (!match) {
      res.statusCode = 404;
      res.end("Not found");
    }
  });
}

function rapidcat(parseMethod = 'json') {
  parseMethod = parseMethod;
  createServer();

  return {
    get: (path, ...rest) => registerPath("get", routeTable, path, rest),
    post: (path, ...rest) => registerPath("post", routeTable, path, rest),
    patch: (path, ...rest) => registerPath("patch", routeTable, path, rest),
    put: (path, ...rest) => registerPath("put", routeTable, path, rest),
    delete: (path, ...rest) => registerPath("delete", routeTable, path, rest),
    status: (statusCode) => server && (server.status = statusCode),
    bodyParse: (method) => parseMethod = method,
    listen: (port, cb) => server && server.listen(port, cb),
    _server: server
  };
}


module.exports = rapidcat;
