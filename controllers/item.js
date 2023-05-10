const cloudinary = require("../middleware/cloudinary");
const Item = require("../models/Item");
const Event = require("../models/Event");

//?? this is a variable to add comments. coming from models/Comment
// const Comment = require("../models/Comment")
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains logged-in users info: req.user
      // console.log(req.user) to see everything
      //grabbing just the items of the logged in user
      const items = await Item.find({ user: req.user.id });
      const events = await Event.find({ user: req.user.id });


      //sending items data from mongodb and user data to ejs template
      res.render("profile.ejs", { items: items, events: events, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const items = await Item.find().sort({ createdAt: "desc" }).lean();
      var users = [];
      for (i in items) {
        var user = await User.findById(items[i].user);
        users.push(user.userName);
      }
      res.render("feed.ejs", { items: items, userName: users, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // original getFeed before snagging from Johnaius
  // getFeed: async (req, res) => {
  //   try {
  //     const posts = await Post.find().sort({ createdAt: "desc" }).lean();
  //     res.render("feed.ejs", { posts: posts });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  getItem: async (req, res) => {
    try {
      //id parameter comes from post routes
      //router.get("/:id, ensureAuth, postsController.getPost");
      //example url: http://localhost:2121/post/63dd8cb9a9ee09c2967fbe35
      //id === 63dd8cb9a9ee09c2967fbe35
      const item = await Item.findById(req.params.id);
      const event = await Event.findById(req.params.id);
      const user = await User.findById(req.params.id);


      //?? controller for comments
      // const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
      // res.render("post.ejs", { post: post, user: req.user, comments: comments });
      res.render("item.ejs", { item: item, event: event, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createItem: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      await Item.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        //this like has .trim().split(\r\n to separate description by line)
        description: req.body.description.trim().split("\r\n"),
        likes: 0,
        user: req.user.id,
        event: req.body.eventId,
      });
      console.log("item has been added!");
      res.redirect(`/event/${req.body.eventId}`);





    } catch (err) {
      console.log(err);
    }
  },
  likeItem: async (req, res) => {
    try {
      await Item.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/item/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteItem: async (req, res) => {
    try {
      // Find post by id
      let item = await Item.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(item.cloudinaryId);

      // Delete post from DB
      await Item.remove({ _id: req.params.id });
      console.log("Deleted Item");
      res.redirect("/feed");
    } catch (err) {
      res.redirect("/feed");
    }
  },
};


