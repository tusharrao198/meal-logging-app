const path = require("path");
const express = require("express");
const port = process.env.PORT || 5000;
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { authCheck } = require("./middleware/auth");
const authRoutes = require("./routes/authroutes");
const mealRoutes = require("./routes/mealroutes");

const meals = require("./models/meal.js");

const connectDB = require("./config/db");
const {
	findUserFoodLog,
	createFoodLog,
	hashtagsInfo,
	fooditemsInfo,
} = require("./utils");
var url = require("url");

// Load config
require("dotenv").config({ path: "./config/config.env" });

// Passport Config
require("./config/passport")(passport);

// connect to Database
connectDB();

const app = express();

// Configure bodyParser
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// set template view engine
app.set("views", "./templates");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/static"));
app.use("/images", express.static(__dirname + "static/images"));

app.use(function (req, res, next) {
	if (!req.user) {
		res.header(
			"Cache-Control",
			"private, no-cache, no-store, must-revalidate"
		);
		res.header("Expires", "-1");
		res.header("Pragma", "no-cache");
	}
	next();
});

app.use("/xpecto.ico", express.static("../static/images/xpecto.ico"));
// Sessions middleware
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGO_DATABASE_URI }),
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/", mealRoutes);

app.get("/", async (req, res) => {
	// console.log(req.session.user)
	const hashtags = await hashtagsInfo();
	const fooditems = await fooditemsInfo();
	const userDetails = require("./models/User");
	let context = {
		hashtags: hashtags,
		fooditems: fooditems,
	};
	if (req.isAuthenticated()) {
		const userID = req.user._id;
		let user = await userDetails.findOne({ _id: userID });
		res.render("addfoodlog", {
			authenticated: req.isAuthenticated(),
			username:
				user != null || user !== undefined ? user.displayName : null,
			...context,
		});
	} else {
		res.render("addfoodlog", {
			authenticated: false,
			...context,
		});
	}
});
//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
	res.status(404).send("<h1>404 NOT FOUND!</h1>");
});

app.listen(port, (err) => {
	if (err) throw err;
	console.log(`Connection Established!! http://localhost:${port}`);
});
