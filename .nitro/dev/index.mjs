import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { mkdirSync } from 'node:fs';
import { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parentPort, threadId } from 'node:worker_threads';
import { getRequestHeader, splitCookiesString, setResponseHeader, setResponseStatus, send, defineEventHandler, setResponseHeaders, handleCacheHeaders, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, createError, getRouterParam, getQuery as getQuery$1, readBody, readMultipartFormData } from 'file://D:/Projects/lms-q-gen/node_modules/h3/dist/index.mjs';
import { provider, isWindows } from 'file://D:/Projects/lms-q-gen/node_modules/std-env/dist/index.mjs';
import destr from 'file://D:/Projects/lms-q-gen/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file://D:/Projects/lms-q-gen/node_modules/hookable/dist/index.mjs';
import { createFetch as createFetch$1, Headers as Headers$1 } from 'file://D:/Projects/lms-q-gen/node_modules/ofetch/dist/node.mjs';
import { createCall, createFetch } from 'file://D:/Projects/lms-q-gen/node_modules/unenv/runtime/fetch/index.mjs';
import { hash } from 'file://D:/Projects/lms-q-gen/node_modules/ohash/dist/index.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery } from 'file://D:/Projects/lms-q-gen/node_modules/ufo/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://D:/Projects/lms-q-gen/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://D:/Projects/lms-q-gen/node_modules/unstorage/drivers/fs.mjs';
import { klona } from 'file://D:/Projects/lms-q-gen/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://D:/Projects/lms-q-gen/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file://D:/Projects/lms-q-gen/node_modules/scule/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://D:/Projects/lms-q-gen/node_modules/radix3/dist/index.mjs';
import { StringOutputParser } from 'file://D:/Projects/lms-q-gen/node_modules/@langchain/core/output_parsers.js';
import { ChatPromptTemplate } from 'file://D:/Projects/lms-q-gen/node_modules/@langchain/core/prompts.js';
import { RunnableSequence } from 'file://D:/Projects/lms-q-gen/node_modules/@langchain/core/runnables.js';
import { PineconeStore } from 'file://D:/Projects/lms-q-gen/node_modules/@langchain/pinecone/index.js';
import { OpenAIEmbeddings, ChatOpenAI } from 'file://D:/Projects/lms-q-gen/node_modules/@langchain/openai/index.js';
import { Pinecone } from 'file://D:/Projects/lms-q-gen/node_modules/@pinecone-database/pinecone/dist/index.js';
import { WebPDFLoader } from 'file://D:/Projects/lms-q-gen/node_modules/@langchain/community/document_loaders/web/pdf.js';
import { RecursiveCharacterTextSplitter } from 'file://D:/Projects/lms-q-gen/node_modules/@langchain/textsplitters/index.js';
import axios from 'file://D:/Projects/lms-q-gen/node_modules/axios/index.js';

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error, isDev) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}
const errorHandler = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const { stack, statusCode, statusMessage, message } = normalizeError(
      error);
    const showDetails = statusCode !== 404;
    const errorObject = {
      url: event.path || "",
      statusCode,
      statusMessage,
      message,
      stack: showDetails ? stack.map((i) => i.text) : void 0
    };
    if (error.unhandled || error.fatal) {
      const tags = [
        "[nitro]",
        "[request error]",
        error.unhandled && "[unhandled]",
        error.fatal && "[fatal]"
      ].filter(Boolean).join(" ");
      console.error(
        tags,
        error.message + "\n" + stack.map((l) => "  " + l.text).join("  \n")
      );
    }
    if (statusCode === 404) {
      setResponseHeader(event, "Cache-Control", "no-cache");
    }
    setResponseStatus(event, statusCode, statusMessage);
    if (isJsonRequest(event)) {
      setResponseHeader(event, "Content-Type", "application/json");
      return send(event, JSON.stringify(errorObject));
    }
    setResponseHeader(event, "Content-Type", "text/html");
    return send(event, renderHTMLError(errorObject));
  }
);
function renderHTMLError(error) {
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Request Error";
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${statusCode} ${statusMessage}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico/css/pico.min.css">
  </head>
  <body>
    <main class="container">
      <dialog open>
        <article>
          <header>
            <h2>${statusCode} ${statusMessage}</h2>
          </header>
          <code>
            ${error.message}<br><br>
            ${"\n" + (error.stack || []).map((i) => `&nbsp;&nbsp;${i}`).join("<br>")}
          </code>
          <footer>
            <a href="/" onclick="event.preventDefault();history.back();">Go Back</a>
          </footer>
        </article>
      </dialog>
    </main>
  </body>
</html>
`;
}

const plugins = [
  
];

const _MARcAM = defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*"
  });
  if (event.method === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.statusMessage = "No Content.";
    return "OK";
  }
});

const _lazy_L5A06g = () => Promise.resolve().then(function () { return chatChain_post$1; });
const _lazy_UfJpEa = () => Promise.resolve().then(function () { return convert_post$1; });
const _lazy_RCHmQp = () => Promise.resolve().then(function () { return save_post$1; });
const _lazy_LEVvap = () => Promise.resolve().then(function () { return genChunk_post$1; });
const _lazy_GKtiZQ = () => Promise.resolve().then(function () { return saveVector_post$1; });
const _lazy_Fk7PMK = () => Promise.resolve().then(function () { return direction_post$1; });
const _lazy_brpP0V = () => Promise.resolve().then(function () { return places_post$1; });
const _lazy_Ts7rKo = () => Promise.resolve().then(function () { return index$1; });

const handlers = [
  { route: '', handler: _MARcAM, lazy: false, middleware: true, method: undefined },
  { route: '/api/chat/chat-chain', handler: _lazy_L5A06g, lazy: true, middleware: false, method: "post" },
  { route: '/api/embeddings/convert', handler: _lazy_UfJpEa, lazy: true, middleware: false, method: "post" },
  { route: '/api/embeddings/save', handler: _lazy_RCHmQp, lazy: true, middleware: false, method: "post" },
  { route: '/api/file/gen-chunk', handler: _lazy_LEVvap, lazy: true, middleware: false, method: "post" },
  { route: '/api/file/save-vector', handler: _lazy_GKtiZQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/navigation/direction', handler: _lazy_Fk7PMK, lazy: true, middleware: false, method: "post" },
  { route: '/api/navigation/places', handler: _lazy_brpP0V, lazy: true, middleware: false, method: "post" },
  { route: '/', handler: _lazy_Ts7rKo, lazy: true, middleware: false, method: undefined }
];

const serverAssets = [{"baseName":"server","dir":"D:/Projects/lms-q-gen/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:\\Projects\\lms-q-gen","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:\\Projects\\lms-q-gen\\server","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:\\Projects\\lms-q-gen\\.nitro","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:\\Projects\\lms-q-gen\\.nitro\\cache","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"D:\\Projects\\lms-q-gen\\.data\\kv","ignore":["**/node_modules/**","**/.git/**"]}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[nitro] [cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[nitro] [cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /{{(.*?)}}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {}
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
function getAddress() {
  if (provider === "stackblitz" || process.env.NITRO_NO_UNIX_SOCKET || process.versions.bun) {
    return 0;
  }
  const socketName = `worker-${process.pid}-${threadId}.sock`;
  if (isWindows) {
    return join(String.raw`\\.\pipe\nitro`, socketName);
  }
  const socketDir = join(tmpdir(), "nitro");
  mkdirSync(socketDir, { recursive: true });
  return join(socketDir, socketName);
}
const listenAddress = getAddress();
server.listen(listenAddress, () => {
  const _address = server.address();
  parentPort?.postMessage({
    event: "listen",
    address: typeof _address === "string" ? { socketPath: _address } : { host: "localhost", port: _address?.port }
  });
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
trapUnhandledNodeErrors();
async function onShutdown(signal) {
  await nitroApp.hooks.callHook("close");
}
parentPort?.on("message", async (msg) => {
  if (msg && msg.event === "shutdown") {
    await onShutdown();
    parentPort?.postMessage({ event: "exit" });
  }
});

const getClient = async () => {
  const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
  });
  return pineconeClient;
};
const getIndex = async () => {
  const client = await getClient();
  const index = client.Index(process.env.PINECONE_INDEX_NAME);
  return index;
};

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_KEY,
  batchSize: 512,
  model: "text-embedding-ada-002"
});

const getFromIndex = async () => {
  const index = await getIndex();
  const store = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });
  return store;
};

const streamingChatModel = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  streaming: true,
  verbose: true,
  temperature: 0.7,
  apiKey: process.env.OPENAI_KEY
});
new ChatOpenAI({
  modelName: "gpt-4o-mini",
  streaming: false,
  verbose: true,
  temperature: 0.7,
  apiKey: process.env.OPENAI_KEY
});

const BASE_TEMPLATE = `Classify the user's question into one of the following categories: [Places recommendation, Tour Packages, Budget Estimation].
Examples:
Question: "What are the best places to visit in Sri Lanka?"
Classification: Places recommendation
Answer layout: end of the answer provide a list of places in json separately

Question: "I like to enjoy the wildlife, do surfing and hiking. Can you suggest some places to visit?"
Classification: Tour Packages
Answer layout: end of the answer provide a list of places in json separately

Question: "How much does it cost to visit ?"
Classification: Budget Estimation

{context}

Now classify the following:
Question: "{question}"
Classification:
Helpful answer in markdown:
`;
const STANDALONE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const chatProcess = async (message, chatHistory, options) => {
  try {
    const getStore = await getFromIndex();
    if (getStore) {
      const retrieve = getStore.asRetriever({
        k: (options == null ? void 0 : options.k) || 10
      });
      const retrievedDocs = await retrieve.invoke(message);
      if (!retrievedDocs || retrievedDocs.length === 0) {
        throw new Error("No documents found");
      }
      let prompt;
      if (chatHistory.length == 0) {
        prompt = ChatPromptTemplate.fromTemplate(BASE_TEMPLATE);
      } else {
        prompt = ChatPromptTemplate.fromTemplate(STANDALONE_TEMPLATE.replace("{chat_history}", chatHistory.join("\n")));
      }
      const chain = RunnableSequence.from([
        prompt,
        streamingChatModel,
        new StringOutputParser()
      ]);
      const response = await chain.invoke({
        context: retrievedDocs,
        question: message
      });
      return response;
    }
  } catch (error) {
    console.error("Chat process error:", error);
    return "An error occurred while processing your request.";
  }
};

const Constants = {
  MAX_TOKEN_COUNT: 8e3
};

let chatHistory = [];
const estimateTotalTokenCount = (chatHistory2) => {
  return chatHistory2.reduce((total, message) => total + message.split(/\s+/).length, 0);
};
const chatChain_post = defineEventHandler(async (event) => {
  console.log("Chat histroy: ", chatHistory);
  try {
    const body = await readBody(event);
    if (!body || body === void 0) {
      return {
        message: "Error: No body found",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    const totalTokens = estimateTotalTokenCount(chatHistory);
    if (totalTokens >= Constants.MAX_TOKEN_COUNT) {
      return {
        message: "Error: Chat history limit exceeded. Please start a new conversation.",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    const response = await chatProcess(body.message, chatHistory);
    chatHistory.push(`User: ${body.message}`);
    chatHistory.push(`Bot: ${response}`);
    return {
      message: "Chat Response created successfully",
      statusCode: 200,
      body: response,
      success: true
    };
  } catch (error) {
    return error;
  }
});

const chatChain_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: chatChain_post
});

const convert_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || body === void 0) {
      return {
        message: "Error: No body found",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    const response = await getEmbeddings(body.message);
    return {
      message: "Embeddings created successfully",
      statusCode: 200,
      body: response,
      success: true
    };
  } catch (error) {
    return error;
  }
});

const convert_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: convert_post
});

const saveIndex = async (text, meta) => {
  const index = await getIndex();
  await PineconeStore.fromDocuments(text, embeddings, { pineconeIndex: index });
};

const saveEmbeddings = async (chunks, meta) => {
  try {
    if (chunks.length > 0) {
      await saveIndex(chunks, meta);
    }
  } catch (error) {
    throw new Error("Error saving embeddings: " + error);
  }
};

const save_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || body === void 0) {
      return {
        message: "Error: No body found",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    await saveEmbeddings(body.chunks, "pdf");
    return {
      message: "Embeddings created successfully",
      statusCode: 200,
      success: true
    };
  } catch (error) {
    return error;
  }
});

const save_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: save_post
});

const pdfTextSplitter = async (blob) => {
  try {
    const pdfLoader = new WebPDFLoader(blob);
    const docs = await pdfLoader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1e3,
      chunkOverlap: 200
    });
    const chunkedDocs = await splitter.splitDocuments(docs);
    return chunkedDocs;
  } catch (error) {
    throw new Error("Error splitting PDF: " + error);
  }
};

const genChunk_post = defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    const file = formData[0];
    if (file.filename === "") {
      return {
        message: "No file uploaded",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    const blob = new Blob([file.data], { type: "application/pdf" });
    const response = await pdfTextSplitter(blob);
    return {
      message: "File uploaded successfully",
      statusCode: 200,
      body: response,
      success: true
    };
  } catch (error) {
    return {
      message: "Error uploading file" + error,
      statusCode: 500,
      body: null,
      success: false
    };
  }
});

const genChunk_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: genChunk_post
});

const saveVector_post = defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    const file = formData[0];
    if (file.filename === "") {
      return {
        message: "No file uploaded",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    const blob = new Blob([file.data], { type: "application/pdf" });
    const response = await pdfTextSplitter(blob);
    await saveEmbeddings(response, "pdf");
    return {
      message: "Created Chunks and Saved successfully",
      statusCode: 200,
      success: true
    };
  } catch (error) {
    return {
      message: "Error uploading file" + error,
      statusCode: 500,
      body: null,
      success: false
    };
  }
});

const saveVector_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: saveVector_post
});

const getGeoCodes = async ({ startLocation, endLocation }) => {
  try {
    const start = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: `${startLocation}, Sri Lanka`,
          key: process.env.GCLOUD_API_KEY
        }
      }
    );
    const end = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: `${endLocation}, Sri Lanka`,
          key: process.env.GCLOUD_API_KEY
        }
      }
    );
    return {
      departure: start.data.results[0].geometry.location,
      destination: end.data.results[0].geometry.location
    };
  } catch (error) {
    console.error("Error getting geocodes:", error);
    throw error;
  }
};

const listPollyLines = async ({ departure, destination }) => {
  const params = {
    origin: `${departure.lat},${departure.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    key: process.env.GCLOUD_API_KEY
  };
  const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
    params
  });
  if (!response) {
    console.log("No response" + response);
  }
  const route = response.data.routes[0];
  return route.overview_polyline.points;
};

const getLocationProcess = async ({ start, end }) => {
  try {
    const response = await getGeoCodes({ startLocation: start, endLocation: end });
    if (!response) {
      return "An error occurred while processing your request.";
    }
    const polyLineData = await listPollyLines({
      departure: response.departure,
      destination: response.destination
    });
    const points = decodePollyLines(polyLineData);
    if (points.length === 0) return "An error occurred while processing your request.";
    return {
      coordinates: [response.departure, response.destination],
      points: releasePoints(points)
    };
  } catch (error) {
    return "An error occurred while processing your request." + error;
  }
};

const direction_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || body === void 0) {
      return {
        message: "Error: No body found",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    const { start, end } = body;
    const response = await getLocationProcess({ start: start.toLocaleString(), end: end.toLocaleString() });
    return {
      message: "Fetched successfully",
      body: response,
      statusCode: 200,
      success: true
    };
  } catch (error) {
    return error;
  }
});

const direction_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: direction_post
});

const places_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || body === void 0) {
      return {
        message: "Error: No query found",
        statusCode: 400,
        body: null,
        success: false
      };
    }
    const { start, end } = body;
    return {
      message: "Fetched successfully",
      body: { start, end },
      statusCode: 200,
      success: true
    };
  } catch (error) {
    return error;
  }
});

const places_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: places_post
});

const index = eventHandler((event) => {
  return "Hello & Welcome to Travel Right \u{1F680}";
});

const index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index
});
//# sourceMappingURL=index.mjs.map
