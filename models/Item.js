const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  // this part is needed to grab event ids (just like comments for posts)
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  // description type is turned into an array so it is easier to display description items on new lines
  description: {
    type: [String],
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    userName: { type: String, unique: true },
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    required: false,
  },
});


//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Item", ItemSchema);
