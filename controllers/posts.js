const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

//?? this is a variable to add comments. comming from models/Comment
// const Comment = require("../models/Comment")
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains logged-in users info: req.user
      // console.log(req.user) to see everything
      //grabbing just the posts of the logged in user
      const posts = await Post.find({ user: req.user.id });

      //sending posts data from mongodb and user data to ejs template
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      var users = [];
      for (i in posts) {
        var user = await User.findById(posts[i].user);
        users.push(user.userName);
      }
      res.render("feed.ejs", { posts: posts, userName: users, user: req.user });
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
  getPost: async (req, res) => {
    try {
      //id parameter comes from post routes
      //router.get("/:id, ensureAuth, postsController.getPost");
      //example url: http://localhost:2121/post/63dd8cb9a9ee09c2967fbe35
      //id === 63dd8cb9a9ee09c2967fbe35
      const post = await Post.findById(req.params.id);

      //?? controller for comments
      // const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
      // res.render("post.ejs", { post: post, user: req.user, comments: comments });
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption.trim().split("\r\n"),
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      //! maybe redirect to the feed instead of a profile (done)
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from DB
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/feed");
    } catch (err) {
      res.redirect("/feed");
    }
  },
};


