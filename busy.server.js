/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname, module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderers_ampRenderer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__handlers_createSsrHandler__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__handlers_createSsrHandler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__handlers_createSsrHandler__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__handlers_createAmpHandler__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__steemAPI__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__steemAPI___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__steemAPI__);
/* eslint-disable no-console */





const fs = __webpack_require__(22);
const express = __webpack_require__(23);
const path = __webpack_require__(24);
const bodyParser = __webpack_require__(25);
const cookieParser = __webpack_require__(26);
const http = __webpack_require__(27);
const https = __webpack_require__(28);

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);

const rootDir = path.join(__dirname, '../..');

app.locals.env = process.env;
app.enable('trust proxy');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (true) {
  app.use(express.static(path.join(rootDir, 'public'), { maxAge: OneWeek, index: false }));
} else {
  app.use(express.static(path.join(rootDir, 'public'), { index: false }));
}

const indexPath = `${rootDir}/public/index.html`;
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

const ampIndexPath = `${rootDir}/templates/amp_index.hbs`;
const ampIndexHtml = fs.readFileSync(ampIndexPath, 'utf-8');
const ampTemplate = Object(__WEBPACK_IMPORTED_MODULE_0__renderers_ampRenderer__["a" /* compileAmpTemplate */])(ampIndexHtml);

const ssrHandler = Object(__WEBPACK_IMPORTED_MODULE_1__handlers_createSsrHandler__["default"])(indexHtml);
const ampHandler = Object(__WEBPACK_IMPORTED_MODULE_2__handlers_createAmpHandler__["a" /* default */])(ampTemplate);

app.get('/callback', (req, res) => {
  const accessToken = req.query.access_token;
  const expiresIn = req.query.expires_in;
  const state = req.query.state;
  const next = state && state[0] === '/' ? state : '/';
  if (accessToken && expiresIn) {
    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
    res.redirect(next);
  } else {
    res.status(401).send({ error: 'access_token or expires_in Missing' });
  }
});

app.get('/i/@:referral', async (req, res) => {
  try {
    const { referral } = req.params;

    const accounts = await __WEBPACK_IMPORTED_MODULE_3__steemAPI___default.a.sendAsync('get_accounts', [[referral]]);
    if (accounts[0]) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/i/:parent/@:referral/:permlink', async (req, res) => {
  try {
    const { parent, referral, permlink } = req.params;

    const content = await __WEBPACK_IMPORTED_MODULE_3__steemAPI___default.a.sendAsync('get_content', [referral, permlink]);

    if (content.author) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect(`/${parent}/@${referral}/${permlink}`);
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/@:author/:permlink/amp', ampHandler);
app.get('/:category/@:author/:permlink/amp', (req, res) => {
  const { author, permlink } = req.params;
  res.redirect(301, `/@${author}/${permlink}/amp`);
});
app.get('/:category/@:author/:permlink', (req, res) => {
  const { author, permlink } = req.params;
  res.redirect(301, `/@${author}/${permlink}`);
});
app.get('/*', ssrHandler);

module.exports = { app, server };

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src/server", __webpack_require__(7)(module)))

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compileAmpTemplate;
/* harmony export (immutable) */ __webpack_exports__["b"] = renderAmpPage;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_cheerio__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_cheerio___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_cheerio__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_handlebars__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_handlebars___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_handlebars__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_handlebars_intl__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_handlebars_intl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_handlebars_intl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__client_components_Story_Body__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__client_components_Story_Body___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__client_components_Story_Body__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__client_helpers_postHelpers__ = __webpack_require__(12);







__WEBPACK_IMPORTED_MODULE_3_handlebars_intl___default.a.registerWith(__WEBPACK_IMPORTED_MODULE_2_handlebars___default.a);

function upgradeURL(url) {
  return url.replace(/^(\/\/)|(http:\/\/)/, 'https://');
}

function cleanHTML(html) {
  const $ = __WEBPACK_IMPORTED_MODULE_1_cheerio___default.a.load(html);
  $('head').remove();

  // AMP requires amp-img instead of img
  $('img').each((i, elem) => {
    $(elem).replaceWith(
      `<div class="fixed-container"><amp-img class="contain" layout="fill" src="${$(elem).attr(
        'src',
      )}"></amp-img></div>`,
    );
  });

  // AMP requires amp-iframe instead of iframe
  const allowedIframeAttrs = ['src', 'frameborder', 'allowfullscreen', 'width', 'height'];
  $('iframe').each((i, elem) => {
    const el = $('<amp-iframe></amp-iframe>');
    const attribs = elem.attribs;

    Object.keys(attribs).forEach(key => {
      if (allowedIframeAttrs.includes(key)) {
        const value = key === 'src' ? upgradeURL(attribs[key]) : attribs[key];
        el.attr(key, value);
      }
    });

    el.attr('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    $(el).append('<span placeholder>Loading iframe</span>');
    $(elem).replaceWith(el);
  });

  return $('body').html();
}

function getContext(post, body, appUrl) {
  const metadata = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.attempt(JSON.parse, post.json_metadata);
  let images = [];
  if (!__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isError(metadata) && metadata.image) images = metadata.image;

  const datePublished = `${post.created}Z`;
  const dateModified = `${post.last_update}Z`;
  const canonical = `${appUrl}${Object(__WEBPACK_IMPORTED_MODULE_5__client_helpers_postHelpers__["a" /* dropCategory */])(post.url)}`;

  const manifest = {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Busy.org',
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/images/logo-brand.png`,
        height: 32,
        width: 32,
      },
    },
    mainEntityOfPage: canonical,
    headline: post.title,
    datePublished,
    dateModified,
    image: images[0] || `${appUrl}/images/logo.png`,
  };

  const context = {
    manifest: JSON.stringify(manifest),
    title: post.title,
    canonical,
    datePublished,
    dateModified,
    author: post.author,
    body,
  };

  return context;
}

function compileAmpTemplate(template) {
  return __WEBPACK_IMPORTED_MODULE_2_handlebars___default.a.compile(template);
}

function renderAmpPage(post, appUrl, template) {
  const body = cleanHTML(Object(__WEBPACK_IMPORTED_MODULE_4__client_components_Story_Body__["getHtml"])(post.body, post.jsonMetadata, 'text'));
  const context = getContext(post, body, appUrl);

  return template(context, {
    data: {
      intl: {
        locales: 'en-US',
      },
    },
  });
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const createClient = __webpack_require__(21).createClient;

const client = createClient("https://api.steemit.com" || 'https://api.steemit.com');
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

module.exports = client;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* eslint-disable no-console */
/**
 * Module dependencies.
 */
const app = __webpack_require__(0).app;
const debug = __webpack_require__(4)('busy:server');
__webpack_require__(29).config();
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.CLIENT_PORT) || 3456;
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = __webpack_require__(0).server;

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

if (!module.parent) {
  server.listen(port);
}
server.on('error', onError);
server.on('listening', onListening);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("cheerio");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("handlebars");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("handlebars-intl");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (88:38)\nYou may need an appropriate loader to handle this file type.\n|       const embed = getEmbed(link);\n|       sections.push(\n|         ReactDOMServer.renderToString(<PostFeedEmbed key={`embed-a-${i}`} inPost embed={embed} />),\n|       );\n|       section = section.substring(`${id} ${type} ${link} ~~~`.length);");

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = dropCategory;
/* unused harmony export getAppData */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__regexHelpers__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__formatter__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_constants_dmca_json__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_constants_dmca_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__common_constants_dmca_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__apps__ = __webpack_require__(16);






const isPostDeleted = post => post.title === 'deleted' && post.body === 'deleted';
/* unused harmony export isPostDeleted */


const isPostTaggedNSFW = post => {
  if (post.parent_permlink === 'nsfw') return true;

  const postJSONMetaData = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.attempt(JSON.parse, post.json_metadata);

  if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isError(postJSONMetaData)) return false;

  return __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.includes(postJSONMetaData.tags, 'nsfw');
};
/* unused harmony export isPostTaggedNSFW */


function dropCategory(url) {
  return url.replace(__WEBPACK_IMPORTED_MODULE_1__regexHelpers__["a" /* categoryRegex */], '');
}

/**
 * Gets app data from a post.
 * Only Returns app info from apps whitelisted in apps.json
 * @param post
 * @returns An empty object if app is not valid otherwise an object with {appName: String, version: String}
 */
function getAppData(post) {
  try {
    const jsonMetadata = Object(__WEBPACK_IMPORTED_MODULE_2__formatter__["a" /* jsonParse */])(post.json_metadata);
    const appDetails = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.get(jsonMetadata, 'app', '');
    const appData = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.split(appDetails, '/');
    const appKey = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.get(appData, 0, '');
    const version = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.get(appData, 1, '');

    if (__WEBPACK_IMPORTED_MODULE_4__apps__["a" /* default */][appKey]) {
      return {
        appName: __WEBPACK_IMPORTED_MODULE_4__apps__["a" /* default */][appKey],
        version,
      };
    }
    return {};
  } catch (error) {
    return {};
  }
}

const isBannedPost = post => {
  const bannedAuthors = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.get(__WEBPACK_IMPORTED_MODULE_3__common_constants_dmca_json___default.a, 'authors', []);
  const bannedPosts = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.get(__WEBPACK_IMPORTED_MODULE_3__common_constants_dmca_json___default.a, 'posts', []);
  const postURL = `${post.author}/${post.permlink}`;

  return __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.includes(bannedAuthors, post.author) || __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.includes(bannedPosts, postURL);
};
/* unused harmony export isBannedPost */


/* unused harmony default export */ var _unused_webpack_default_export = (null);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;
/* unused harmony export imageRegex */


const dtubeImageRegex = /<a href="https:\/\/d.tube.#!\/v\/[^/"]+\/[^/"]+"><img src="[^"]+"\/><\/a>/g;
/* unused harmony export dtubeImageRegex */


const usernameURLRegex = /@([^/]+)/;
/* unused harmony export usernameURLRegex */


const categoryRegex = /\/([^/]+)/;
/* harmony export (immutable) */ __webpack_exports__["a"] = categoryRegex;


/* unused harmony default export */ var _unused_webpack_default_export = (null);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const jsonParse = str => {
  try {
    return jsonParse(JSON.parse(str));
  } catch (e) {
    return str;
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = jsonParse;


const epochToUTC = epochTimestamp => new Date(0).setUTCSeconds(epochTimestamp);
/* unused harmony export epochToUTC */


/* unused harmony default export */ var _unused_webpack_default_export = (jsonParse);


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = {"authors":[],"posts":["cracked-games/ltxziiz9","bleh773/2ryjej-on-off","fatzer/decore-table-artisanale-de-salon-marocaine-or-dykwr-maedh-alsalwn-almghrby-altqlydyh","harshvasistha/10-best-bitcoin-faucets-to-get-free-bitcoins-2017","harshvasistha/6ugrdj-7-top-cryptocurrency-to-invest-besides-bitcoin-2017-18","harshvasistha/best-bitcoin-exchanges-10-best-bitcoin-exchanges-worldwide-2017","harshvasistha/instant-cryptocurrency-exchange-in-depth-review-shapeshift-vs-changelly","harshvasistha/10-best-bitcoin-faucets-to-get-free-bitcoins-2017","harshvasistha/3nchsn-instant-cryptocurrency-exchange-in-depth-review-shapeshift-vs-changelly","harshvasistha/instant-cryptocurrency-exchange-in-depth-review-shapeshift-vs-changelly","harshvasistha/10-best-bitcoin-faucets-to-get-free-bitcoins-2017","fumegi/allison-parker"]}

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const appsList = __webpack_require__(17);

const apps = {};

Object.keys(appsList).forEach(key => {
  apps[key] = appsList[key].name;
});

/* harmony default export */ __webpack_exports__["a"] = (apps);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {"steemit":{"name":"Steemit","homepage":"https://steemit.com","url_scheme":"https://steemit.com/{category}/@{username}/{permlink}"},"busy":{"name":"Busy","homepage":"https://busy.org","url_scheme":"https://busy.org/@{username}/{permlink}"},"esteem":{"name":"eSteem","homepage":"https://esteem.ws"},"chainbb":{"name":"chainBB","homepage":"https://chainbb.com","url_scheme":"https://chainbb.com/{category}/@{username}/{permlink}"},"utopian":{"name":"Utopian","homepage":"https://utopian.io","url_scheme":"https://utopian.io/{category}/@{username}/{permlink}"},"dtube":{"name":"DTube","homepage":"https://d.tube","url_scheme":"https://d.tube/#!/v/{username}/{permlink}"},"dlive":{"name":"DLive","homepage":"https://www.dlive.io","url_scheme":"https://www.dlive.io/#/livestream/{username}/{permlink}"},"dmania":{"name":"dMania","homepage":"https://dmania.lol","url_scheme":"https://dmania.lol/post/{username}/{permlink}"},"dsound":{"name":"DSound","homepage":"https://dsound.audio","url_scheme":"https://dsound.audio/#/@{username}/{permlink}"},"steepshot":{"name":"Steepshot","homepage":"https://steepshot.io","url_scheme":"https://alpha.steepshot.io/post/{category}/@{username}/{permlink}"},"zappl":{"name":"Zappl","homepage":"https://zappl.com","url_scheme":"https://zappl.com/zappl/a21/lochintar-bar-lal"},"steemkr":{"name":"Steemkr","homepage":"https://steemkr.com","url_scheme":"https://steemkr.com/{category}/@{username}/{permlink}"},"steemjs":{"name":"Steem.js","homepage":"https://github.com/steemit/steem-js"},"strimi":{"name":"Strimi","homepage":"https://strimi.pl","url_scheme":"https://strimi.pl/{category}/@{username}/{permlink}"},"steemhunt":{"name":"Steemhunt","homepage":"https://steemhunt.com/","url_scheme":"https://steemhunt.com/@{username}/{permlink}"}}

/***/ }),
/* 18 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (54:8)\nYou may need an appropriate loader to handle this file type.\n|       const context = {};\n|       const content = renderToString(\n|         <Provider store={store}>\n|           <StaticRouter location={req.url} context={context}>\n|             {renderRoutes(routes)}");

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createAmpHandler;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_url__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_url___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_url__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__steemAPI__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__steemAPI___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__steemAPI__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__renderers_ampRenderer__ = __webpack_require__(1);




const debug = __webpack_require__(4)('busy:server');

function createAmpHandler(template) {
  return async function ampResponse(req, res) {
    try {
      const result = await __WEBPACK_IMPORTED_MODULE_1__steemAPI___default.a.sendAsync('get_content', [
        req.params.author,
        req.params.permlink,
      ]);
      if (result.id === 0) return res.sendStatus(404);
      const appUrl = __WEBPACK_IMPORTED_MODULE_0_url___default.a.format({
        protocol: req.protocol,
        host: req.get('host'),
      });

      const page = Object(__WEBPACK_IMPORTED_MODULE_2__renderers_ampRenderer__["b" /* default */])(result, appUrl, template);
      return res.send(page);
    } catch (error) {
      debug('Error while parsing AMP response', error);
      return res.status(500).send('500 Internal Server Error');
    }
  };
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("lightrpc");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ })
/******/ ]);