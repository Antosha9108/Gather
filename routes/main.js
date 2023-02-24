const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
// const commentController = require("../controllers/comment")
const { ensureAuth, ensureGuest } = require("../middleware/auth");
//! this is new events controller
const eventsController = require("../controllers/events")

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);

//Routes for login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

// !!!!!this is new events route!!!!!!
router.get("/eventFeed", ensureAuth, eventsController.getEventFeed)




module.exports = router;
