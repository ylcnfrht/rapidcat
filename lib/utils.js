function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => body += chunk);
    req.on("error", (err) => reject(err));
    req.on("end", () => resolve(body));
  });
}

function prepareResponseObject(res) {
  return new Promise((resolve) => {
    res.send = (message) => resolve(res.end(message));

    res.json = (data) => {
      res.setHeader("Content-Type", "applirapidcation/json");
      res.end(JSON.stringify(data));
    };

    res.status = (statusCode = 200) => {
      res.statusCode = statusCode;
      return resolve(res);
    };

    return resolve(res);
  })
}

function processMiddleware(req, res, middleware) {
  if (!middleware) return new Promise((resolve) => resolve(true));
  return new Promise((resolve) => middleware(req, res, () => resolve(true)));
}

function isMatchingRoute({ req, routeTable, route }) {
  const parsedRoute = urlToRegexParse(route);
  return new RegExp(parsedRoute).test(req.url) && routeTable[route][req.method.toLowerCase()];
}

function getQuery(url) {
  const queryMatch = url.match(/\?(?<query>.*)/);

  if (!queryMatch) return {};

  const { groups: { query } } = queryMatch;

  return query.split('&').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    acc[key] = value;
    return acc;
  }, {});
}

function urlToRegexParse(url) {
  return url.replace(/:\w+/g, match => `(?<${match.slice(1)}>\\w+)`);
}

function getParams({ req, route }) {
  const { groups: params } = req.url.match(new RegExp(urlToRegexParse(route)));

  return params;
}

function getCallbackFn({ req, routeTable, route }) {
  return routeTable[route][req.method.toLowerCase()];
}

function getMiddleware({ req, routeTable, route }) {
  return routeTable[route][`${req.method.toLowerCase()}-middleware`];
}

function getCallbackFnAndMiddlewares({ req, routeTable, route }) {
  return {
    prevMiddleware: routeTable[route][`${req.method.toLowerCase()}-prevMiddleware`],
    callbackFn: routeTable[route][req.method.toLowerCase()],
    nextMiddleware: routeTable[route][`${req.method.toLowerCase()}-nextMiddleware`],
  };
}

async function getBody({ req, parseMethod }) {
  if (parseMethod === "json") {
    try {
      const requestBody = await readBody(req);
      return requestBody ? JSON.parse(requestBody) : {};
    } catch(error) {
      console.error("Error parsing JSON request body:", error);
      return {};
    }
  } else {
    return {};
  }
}

async function prepareRequestObject(req, route, parseMethod) {
  req.params = getParams({ req, route });
  req.query = getQuery(req.url);
  req.body = await getBody({ req, parseMethod });
}

function registerPath(method, routeTable, path, rest) {
  let callbackFn;
  let prevMiddleware;
  let nextMiddleware;

  if (rest.length === 1) {
    callbackFn = rest[0];
  } else if (rest.length === 2) {
    prevMiddleware = rest[0];
    callbackFn = rest[1];
  } else if (rest.length === 3) {
    prevMiddleware = rest[0];
    callbackFn = rest[1];
    nextMiddleware = rest[2];
  }

  if (!routeTable[path]) {
    routeTable[path] = {};
  }

  routeTable[path] = {
    ...routeTable[path],
    [method]: callbackFn,
    [method + "-prevMiddleware"]: prevMiddleware,
    [method + "-nextMiddleware"]: nextMiddleware
  };
}

module.exports = {
  readBody,
  processMiddleware,
  registerPath,
  isMatchingRoute,
  urlToRegexParse,
  getParams,
  getQuery,
  getCallbackFn,
  getBody,
  prepareRequestObject,
  getMiddleware,
  prepareResponseObject,
  getCallbackFnAndMiddlewares,
}