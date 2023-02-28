const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const itemsController = require("../controllers/item");
// const commentController = require("../controllers/comment")
const { ensureAuth, ensureGuest } = require("../middleware/auth");
//! this is new events controller
const eventsController = require("../controllers/event")

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, itemsController.getProfile);
router.get("/feed", ensureAuth, itemsController.getFeed);
// !!!!!this is new events route!!!!!!
router.get("/eventFeed", ensureAuth, eventsController.getEventFeed)

//Routes for login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);




module.exports = router;
