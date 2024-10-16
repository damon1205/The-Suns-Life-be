const express = require("express");
const path = require("path");
const httpStatus = require("http-status");
const cors = require("cors");
const config = require('./config/config');
var cron = require("node-cron");
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const session = require('express-session');
const morgan = require('./config/morgan');
const GOOGLE_WEB_STRATERGY = require('./google.auth.js');
const GOOGLE_APP_STRATERGY = require('./google.appauth.js');

const { getTokenForTracking } = require("./modules/shiptheory/services/getTokenForTracking.js");
const { sentAbandonedCartMails } = require("./modules/cart/services/index.js");




const app = express();
const port = process.env.PORT;


// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}
// parse json request body
app.use(express.json({ limit: '50mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// enable cors
app.use(cors());
app.options('*', cors());


//Middleware
app.use(session({
	secret: "secret",
	resave: false,
	saveUninitialized: true,
}))
passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});
// jwt authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use('jwt', jwtStrategy);




app.use('/webpanel', express.static(path.join(__dirname, 'frontend', 'admin', 'build', "index.html")));

app.use('/webpanel/assets', express.static(path.join(__dirname, 'frontend', 'admin', 'build', 'assets'), {
	setHeaders: (res, path) => {
		if (path.endsWith('.css')) {
			res.setHeader('Content-Type', 'text/css');
		}
	},
}));

//   cron.schedule("* * * * *", () => {

// 	console.log("running a task every minute");
// //    getTokenForTracking()
// });

//getTokenForTracking()

// app.use(express.static(path.join(__dirname,'frontend', 'admin', 'build')));

// app.get('adminapp/*', function(req,res) {
//         res.sendFile(path.join(__dirname, 'frontend', 'admin','build', 'index.html'));
// });

// cron.schedule("0 */2 * * *", () => {
// 	console.log("Sending Abandoned cart mails in every 2 hours.");
// 	sentAbandonedCartMails()
// });
app.use('/v1', routes);
app.use('/web', GOOGLE_WEB_STRATERGY);
app.use('/app', GOOGLE_APP_STRATERGY);
app.all('/', (req, res) => {
	res.send("Hello from Backend")
});
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/v1/auth', authLimiter);
}

// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
// 	next(new ApiError(httpStatus.NOT_FOUND, 'API Not Found'));
// });

// convert error to ApiError, if needed
app.use(errorConverter);


// handle error
app.use(errorHandler);

//cron job to take tracking id


module.exports = app;