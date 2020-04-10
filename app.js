const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const path = require('path');

const searchRoute = require('./routes/searchRoutes');
const recipeRoute = require('./routes/recipeRoutes');
const viewRoute = require('./routes/viewRoutes');

const app = express();

// Limit amount of data from req.body to 10kb to protect server from attacker(overload server)
app.use(express.json({ limit: '10kb' })); // Like body-parser, using this middleware to attach req.body property, default in express
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // for using req.body when data was submitted by html-form

app.use(express.static(path.join(__dirname, 'crawler')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// IMPLEMENT CORS (Cross-Origin-Resource-Sharing)
// We can set 'cors' in specific route -> Read doc
app.use(cors()); // Middleware to add some header('Access-Control-Allow-Origin' = * (* all req)) to request
app.options('*', cors()); // options is HTTP method like PUT, GET... * is for all routes

// After attach req.body, now we need to fileter body out of malicious code in body
// Data sanitization against NoSQL injection( "email": { $gt: "" })
app.use(mongoSanitize()); // This middleware removes all . $ from req.body

// Data sanitization against XSS(cross-site script attack)
app.use(xss());

// For compressing text only like (JSON, HTML) in res to client
app.use(compression());

// Set security HTTP header
app.use(helmet()); //use(put a fuction not function call, so helmet() return a function)

// Using rate limiting to prevent 'Brute force attack' and 'denial of server' by limiting
// number of request per certain amount of time.
const limiter = rateLimit({
  max: 100, // max request
  windowMs: 60 * 60 * 1000, // per 1 hours was transfer to milli second
  message: 'Too many requests from this IP, please try again in 1 hour !',
});
app.use('/api', limiter);

// ROUTES
app.use('/', viewRoute);
app.use('/api/v1/search', searchRoute);
app.use('/api/v1/recipe', recipeRoute);

// If there is no middleware was matched and run above, this is the final middlewares in req-res-cycle
// Therefore, it will handle all route was not declared.
app.all('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views/pageNotFound.html'));
});

module.exports = app;
