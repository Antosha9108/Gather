//both variables for using express
const express = require("express");
const app = express();
// mongoose variable for using mongoDB
const mongoose = require("mongoose");
// passport variable for authentication (off the shelf solution with strategies)
const passport = require("passport");
// session variable enables to keep user logged in across the application. Uses cookies
const session = require("express-session");
// MongoStore is storing the session in MongoDB
const MongoStore = require("connect-mongo")(session);
//allows us to override CRUD methods. (session in paranthases is actually calling it)
const methodOverride = require("method-override");
//helps us show notifications
const flash = require("express-flash");
//logs messages in the console. mrgan is a dev dependency ( we don't need it in production)
const logger = require("morgan");
//connecting to DB
const connectDB = require("./config/database");
//routes
const mainRoutes = require("./routes/main");
const itemRoutes = require("./routes/item");
//!event route
const eventRoutes = require("./routes/event")
//?? comment route
// const commentsRoutes = require("./routes/comment")

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder. (CSS,JS etc)
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging (this is where we use morgan)
app.use(logger("dev"));

//Use forms for put / delete
//if method sees any type of requests coming in with "_method  query parameter" it overwrites it.
// the browser only uses natively get and post requests. the puts and deletes are the fetch requests (which is Web API method)
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
//!! THIS IS WHAT ACTUALLY KICKS OFF Routes
app.use("/", mainRoutes);
app.use("/item", itemRoutes);
app.use("/event", eventRoutes)

//?? comment route
// app.use("/comment", commentsRoutes)


//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
