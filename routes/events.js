const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const eventsController = require("../controllers/events");
const { ensureAuth, ensureGuest } = require("../middleware/auth");







router.get("/:id", ensureAuth, eventsController.getEvent);

//Enables user to create post w/ cloudinary for media uploads
router.post("/createEvent", upload.single("file"), eventsController.createEvent);

//enables user to like event. In controller, uses POST model to update like by 1
// router.put("/likeEvent/:id", eventsController.likeEvent);

//Enables user to delete event. In controller, uses POST model to delete event from MongoDB collection
router.delete("/deleteEvent/:id", eventsController.deleteEvent);

module.exports = router;