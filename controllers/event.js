const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const Item = require('../models/Item')

const User = require("../models/User");

// not sure if I need this again? it already exists in posts.js controller
module.exports = {
    // getProfile: async (req, res) => {
    //     try {
    //         //Since we have a session each request (req) contains logged-in users info: req.user
    //         //grabbing just the events of the logged in user
    //         const events = await Event.find({ user: req.user.id });
    //         res.render("profile.ejs", { posts: posts, user: req.user });
    //         //!Since we have a session each request (req) contains logged-in users info: req.user
    //         //!grabbing just the posts of the logged in user
    //         res.render("profile.ejs", { events: events, user: req.user });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // },
    getEventFeed: async (req, res) => {
        try {
            const events = await Event.find().sort({ createdAt: "desc" }).lean();
            var users = [];
            for (i in events) {
                var user = await User.findById(events[i].user);
                users.push(user.userName);
            }
            res.render("eventFeed.ejs", { events: events, userName: users, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },

    getEvent: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            const items = await Item.find({ event: req.params.id });

            res.render("event.ejs", { event: event, items: items, user: req.user, });
        } catch (err) {
            console.log(err);
        }
    },
    createEvent: async (req, res) => {
        try {
            // Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            await Event.create({
                title: req.body.title,
                image: result.secure_url,
                cloudinaryId: result.public_id,
                //!!doublecheck if this is needed
                description: req.body.description,
                // caption: req.body.caption.trim().split("\r\n"),

                user: req.user.id,
            });
            console.log("Event has been created!");
            //! maybe redirect to eventFeed or to the created event
            res.redirect("/eventFeed");
        } catch (err) {
            console.log(err);
        }
    },
    deleteEvent: async (req, res) => {
        try {
            // Find event by id
            let event = await Event.findById({ _id: req.params.id });
            // Delete image from cloudinary
            await cloudinary.uploader.destroy(event.cloudinaryId);
            // Delete event from db
            await Event.remove({ _id: req.params.id });
            console.log("Deleted Event");
            res.redirect("/eventFeed");
        } catch (err) {
            res.redirect("/eventFeed");
        }
    },

















};