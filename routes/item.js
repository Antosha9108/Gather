const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const itemsController = require("../controllers/item");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Item Routes - simplified for now
//Since linked from server js treat each path as:
//item/:id, item/createItem, item/likeItem/:id, item/deleteItem/:id


router.get("/:id", ensureAuth, itemsController.getItem);

//Enables user to create item w/ cloudinary for media uploads
router.post("/createItem", upload.single("file"), itemsController.createItem);

//enables user to like item. In controller, uses POST model to update like by 1
router.put("/likeItem/:id", itemsController.likeItem);

//Enables user to delete item. In controller, uses POST model to delete item from MongoDB collection
router.delete("/deleteItem/:id", itemsController.deleteItem);

module.exports = router;
