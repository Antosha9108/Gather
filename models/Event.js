const mongoose = require("mongoose");


const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    cloudinaryId: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

//MongoDB Collection named here - will give lowercase plural of name 

module.exports = mongoose.model("Event", EventSchema);